import { query } from "@/lib/db";
import websiteOptions from "@/data/websiteOptions";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const WORKSPACE_ID = 252988;

function getAllowedDomainsForWebsiteIds(websiteIds) {
  const domains = new Set();

  websiteOptions.forEach((site) => {
    if (websiteIds.includes(site.id)) {
      site.linklyDomains.forEach((d) => domains.add(d));
    }
  });

  return domains;
}

export async function getAdvertiseAnalyticsData(websiteIds = [1, 3, 7]) {
  if (!Array.isArray(websiteIds) || websiteIds.length === 0) {
    return {
      subscribersMonthly: [],
      opensByCountry: [],
      opensMonthly: [],
      opensByGender: [],
      adClickActivity: [
        { week: "Week 1", lastMonth: 0, thisMonth: 0 },
        { week: "Week 2", lastMonth: 0, thisMonth: 0 },
        { week: "Week 3", lastMonth: 0, thisMonth: 0 },
        { week: "Week 4", lastMonth: 0, thisMonth: 0 },
      ],
      lastCampaignOpenSummary: {
        totalOpens: 0,
        formattedTotalOpens: "0",
      },
    };
  }

  const subscribersSql = `
    WITH months AS (
      SELECT
        date_trunc('month', current_date) - INTERVAL '12 months'
          + (g.m * INTERVAL '1 month') AS month_start
      FROM generate_series(0, 11) AS g(m)
    )
    SELECT
      TO_CHAR(m.month_start::date, 'YYYY-MM-01') AS month,
      COALESCE(SUM(ces.emails_sent_count), 0)::BIGINT AS subscribers_count
    FROM months m
    LEFT JOIN campaign_email_stats ces
      ON ces.campaign_date >= m.month_start
     AND ces.campaign_date < (m.month_start + INTERVAL '1 month')
     AND ces.website_id = ANY($1::int[])
    GROUP BY m.month_start
    ORDER BY m.month_start;
  `;

  const countrySql = `
    WITH relevant_opens AS (
      SELECT DISTINCT eo.user_id
      FROM emails_open eo
      JOIN campaigns c ON c.id = eo.campaign_id
      WHERE c.website_id = ANY($1::int[])
    ),
    country_counts AS (
      SELECT
        u.country,
        COUNT(*) AS unique_openers
      FROM relevant_opens ro
      JOIN users u ON u.id = ro.user_id
      WHERE u.country IS NOT NULL
        AND u.country <> ''
      GROUP BY u.country
    )
    SELECT
      country,
      unique_openers,
      unique_openers AS total_opens
    FROM country_counts
    ORDER BY unique_openers DESC;
  `;

  const opensMonthlySql = `
    WITH months AS (
      SELECT
        date_trunc('month', current_date) - INTERVAL '12 months'
          + (g.m * INTERVAL '1 month') AS month_start
      FROM generate_series(0, 11) AS g(m)
    )
    SELECT
      TO_CHAR(m.month_start::date, 'YYYY-MM-01') AS month,
      COALESCE(SUM(ces.emails_open_count), 0)::BIGINT AS total_opens
    FROM months m
    LEFT JOIN campaign_email_stats ces
      ON ces.campaign_date >= m.month_start
     AND ces.campaign_date < (m.month_start + INTERVAL '1 month')
     AND ces.website_id = ANY($1::int[])
    GROUP BY m.month_start
    ORDER BY m.month_start;
  `;

  const genderSql = `
    WITH relevant_campaigns AS (
      SELECT id
      FROM campaigns
      WHERE website_id = ANY($1::int[])
    )
    SELECT
      u.gender,
      COUNT(DISTINCT eo.user_id) AS total_openers
    FROM emails_open eo
    JOIN relevant_campaigns c ON c.id = eo.campaign_id
    JOIN users u ON u.id = eo.user_id
    WHERE u.gender IS NOT NULL
      AND u.gender <> ''
    GROUP BY u.gender
    ORDER BY total_openers DESC;
  `;

  const lastCampaignOpensSql = `
  WITH yesterday_campaigns AS (
  SELECT id
  FROM campaigns
  WHERE website_id = ANY($1::int[])
    AND date::date = CURRENT_DATE - INTERVAL '1 day'
)
SELECT
  COUNT(eo.id) AS total_opens_last_campaigns
FROM yesterday_campaigns yc
LEFT JOIN emails_open eo
  ON eo.campaign_id = yc.id;
  `;

  const allowedDomains = getAllowedDomainsForWebsiteIds(websiteIds);

  const linklyListUrl =
    `https://app.linklyhq.com/api/v1/workspace/${WORKSPACE_ID}/list_links` +
    `?page_size=500` +
    `&search=p-ad` +
    `&sort_by=inserted_at` +
    `&sort_dir=desc` +
    `&api_key=${process.env.LINKLY_API_KEY}`;

  const [
    subscribersResult,
    countryResult,
    opensMonthlyResult,
    genderResult,
    linklyListData,
    lastCampaignOpensResult,
  ] = await Promise.all([
    query(subscribersSql, [websiteIds]),
    query(countrySql, [websiteIds]),
    query(opensMonthlySql, [websiteIds]),
    query(genderSql, [websiteIds]),
    fetch(linklyListUrl, { next: { revalidate: 10800 } }).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch Linkly links");
      return res.json();
    }),
    query(lastCampaignOpensSql, [websiteIds]),
  ]);

  const subscribersMonthly = subscribersResult.rows.map((r) => ({
    month: r.month,
    count: Number(r.subscribers_count || 0),
  }));

  const totalOpensAll = countryResult.rows.reduce(
    (sum, r) => sum + Number(r.total_opens || 0),
    0,
  );

  const opensByCountryAll = countryResult.rows.map((r) => {
    const totalOpens = Number(r.total_opens || 0);
    const percentage = totalOpensAll ? (totalOpens / totalOpensAll) * 100 : 0;

    return {
      country: r.country,
      uniqueOpeners: Number(r.unique_openers || 0),
      totalOpens,
      totalPercentage: Number(percentage.toFixed(2)),
    };
  });

  const opensByCountry = opensByCountryAll.slice(0, 5);

  const opensMonthly = opensMonthlyResult.rows.map((r) => ({
    month: r.month,
    count: Number(r.total_opens || 0),
  }));

  const totalGenderOpeners = genderResult.rows.reduce(
    (sum, r) => sum + Number(r.total_openers || 0),
    0,
  );

  const opensByGender = genderResult.rows.map((r) => {
    const openers = Number(r.total_openers || 0);
    const percentage = totalGenderOpeners
      ? (openers / totalGenderOpeners) * 100
      : 0;

    return {
      gender: r.gender,
      totalOpeners: openers,
      percentage: Number(percentage.toFixed(2)),
    };
  });

  let lastCampaignOpenSummary = {
    totalOpens: 0,
    formattedTotalOpens: "0",
  };

  if (lastCampaignOpensResult.rows.length > 0) {
    const r = lastCampaignOpensResult.rows[0];
    const total = Number(r.total_opens_last_campaigns || 0);

    lastCampaignOpenSummary = {
      totalOpens: total,
      formattedTotalOpens: total.toLocaleString("en-US"),
    };
  }

  const links = linklyListData.links || linklyListData.data || [];
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const sixtyDaysAgo = new Date(today.getTime() - 60 * MS_PER_DAY);

  const linkIds = links
    .filter((link) => allowedDomains.has(link.domain))
    .map((l) => l.id)
    .filter(Boolean);

  let adClickActivity = [
    { week: "Week 1", lastMonth: 0, thisMonth: 0 },
    { week: "Week 2", lastMonth: 0, thisMonth: 0 },
    { week: "Week 3", lastMonth: 0, thisMonth: 0 },
    { week: "Week 4", lastMonth: 0, thisMonth: 0 },
  ];

  if (linkIds.length > 0) {
    const linkIdsParams = `link_ids=${linkIds.join("-")}`;
    const start = sixtyDaysAgo.toISOString().slice(0, 10);
    const end = today.toISOString().slice(0, 10);

    const clicksUrl =
      `https://app.linklyhq.com/api/v1/workspace/${WORKSPACE_ID}/clicks` +
      `?start=${encodeURIComponent(start)}` +
      `&end=${encodeURIComponent(end)}` +
      `&workspace_id=${WORKSPACE_ID}` +
      `&${linkIdsParams}` +
      `&api_key=${process.env.LINKLY_API_KEY}` +
      `&bots=false`;

    const response = await fetch(clicksUrl, {
      headers: {
        Authorization: `Bearer ${process.env.LINKLY_API_KEY}`,
      },
      next: { revalidate: 10800 },
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Linkly API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: clicksUrl,
      });

      throw new Error(
        `Failed to fetch Linkly clicks: ${response.status} ${response.statusText}`,
      );
    }

    const clickData = await response.json();

    const traffic = clickData.traffic || [];

    const BUCKETS_PER_WINDOW = 4;
    const DAYS_PER_WINDOW = 30;
    const bucketSpan = DAYS_PER_WINDOW / BUCKETS_PER_WINDOW;

    const thisMonthBuckets = Array(BUCKETS_PER_WINDOW).fill(0);
    const lastMonthBuckets = Array(BUCKETS_PER_WINDOW).fill(0);

    for (const point of traffic) {
      const { t, y } = point;
      if (!t || y == null) continue;

      const day = new Date(t);
      if (Number.isNaN(day.getTime())) continue;

      const dayMidnight = new Date(day);
      dayMidnight.setHours(0, 0, 0, 0);

      const diffMs = today.getTime() - dayMidnight.getTime();
      const daysAgo = Math.floor(diffMs / MS_PER_DAY);

      if (daysAgo < 0 || daysAgo >= 60) continue;

      if (daysAgo < 30) {
        const pos = 29 - daysAgo;
        let bucket = Math.floor(pos / bucketSpan);
        if (bucket < 0) bucket = 0;
        if (bucket >= BUCKETS_PER_WINDOW) bucket = BUCKETS_PER_WINDOW - 1;
        thisMonthBuckets[bucket] += Number(y) || 0;
      } else {
        const pos = 59 - daysAgo;
        let bucket = Math.floor(pos / bucketSpan);
        if (bucket < 0) bucket = 0;
        if (bucket >= BUCKETS_PER_WINDOW) bucket = BUCKETS_PER_WINDOW - 1;
        lastMonthBuckets[bucket] += Number(y) || 0;
      }
    }

    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    adClickActivity = weeks.map((label, i) => ({
      week: label,
      lastMonth: lastMonthBuckets[i],
      thisMonth: thisMonthBuckets[i],
    }));
  }

  return {
    subscribersMonthly,
    opensByCountry,
    opensMonthly,
    opensByGender,
    adClickActivity,
    lastCampaignOpenSummary,
  };
}
