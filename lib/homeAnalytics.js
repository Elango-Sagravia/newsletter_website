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

export async function getHomeAnalyticsData(websiteIds = [1, 3, 7]) {
  if (!Array.isArray(websiteIds) || websiteIds.length === 0) {
    return {
      subscribersMonthly: [],
      opensMonthly: [],
      adClickActivity: [
        { week: "Week 1", lastMonth: 0, thisMonth: 0 },
        { week: "Week 2", lastMonth: 0, thisMonth: 0 },
        { week: "Week 3", lastMonth: 0, thisMonth: 0 },
        { week: "Week 4", lastMonth: 0, thisMonth: 0 },
      ],
    };
  }

  const subscribersSql = `
    WITH months AS (
      SELECT
        date_trunc('month', current_date) - INTERVAL '12 months'
          + (g.m * INTERVAL '1 month') AS month_start
      FROM generate_series(0, 11) g(m)
    )
    SELECT
      TO_CHAR(m.month_start, 'YYYY-MM-01') AS month,
      COALESCE(SUM(ces.emails_sent_count), 0)::BIGINT AS subscribers_count
    FROM months m
    LEFT JOIN campaign_email_stats ces
      ON ces.campaign_date >= m.month_start
     AND ces.campaign_date < (m.month_start + INTERVAL '1 month')
     AND ces.website_id = ANY($1::int[])
    GROUP BY m.month_start
    ORDER BY m.month_start;
  `;

  const opensMonthlySql = `
    WITH months AS (
      SELECT
        date_trunc('month', current_date) - INTERVAL '12 months'
          + (g.m * INTERVAL '1 month') AS month_start
      FROM generate_series(0, 11) g(m)
    )
    SELECT
      TO_CHAR(m.month_start, 'YYYY-MM-01') AS month,
      COALESCE(SUM(ces.emails_open_count), 0)::BIGINT AS total_opens
    FROM months m
    LEFT JOIN campaign_email_stats ces
      ON ces.campaign_date >= m.month_start
     AND ces.campaign_date < (m.month_start + INTERVAL '1 month')
     AND ces.website_id = ANY($1::int[])
    GROUP BY m.month_start
    ORDER BY m.month_start;
  `;

  const allowedDomains = getAllowedDomainsForWebsiteIds(websiteIds);

  const linklyListUrl =
    `https://app.linklyhq.com/api/v1/workspace/${WORKSPACE_ID}/list_links` +
    `?page_size=500&search=p-ad&sort_by=inserted_at&sort_dir=desc` +
    `&api_key=${process.env.LINKLY_API_KEY}`;

  const [subscribersResult, opensMonthlyResult, linklyListData] =
    await Promise.all([
      query(subscribersSql, [websiteIds]),
      query(opensMonthlySql, [websiteIds]),
      fetch(linklyListUrl, { cache: "no-store" }).then((res) => res.json()),
    ]);

  const subscribersMonthly = subscribersResult.rows.map((r) => ({
    month: r.month,
    count: Number(r.subscribers_count || 0),
  }));

  const opensMonthly = opensMonthlyResult.rows.map((r) => ({
    month: r.month,
    count: Number(r.total_opens || 0),
  }));

  const links = linklyListData.links || linklyListData.data || [];
  const today = new Date();
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
      `?start=${start}&end=${end}` +
      `&workspace_id=${WORKSPACE_ID}` +
      `&${linkIdsParams}` +
      `&api_key=${process.env.LINKLY_API_KEY}` +
      `&bots=false`;

    const clicksData = await fetch(clicksUrl, { cache: "no-store" }).then((r) =>
      r.json(),
    );

    const traffic = clicksData.traffic || [];

    const BUCKETS = 4;
    const bucketSpan = 30 / BUCKETS;

    const lastMonthBuckets = Array(BUCKETS).fill(0);
    const thisMonthBuckets = Array(BUCKETS).fill(0);

    for (const point of traffic) {
      const day = new Date(point.t);
      const y = Number(point.y);

      const daysAgo = Math.floor(
        (today.getTime() - day.setHours(0, 0, 0, 0)) / MS_PER_DAY,
      );

      if (daysAgo < 0 || daysAgo >= 60) continue;

      if (daysAgo < 30) {
        const pos = 29 - daysAgo;
        const bucket = Math.min(
          BUCKETS - 1,
          Math.max(0, Math.floor(pos / bucketSpan)),
        );
        thisMonthBuckets[bucket] += y;
      } else {
        const pos = 59 - daysAgo;
        const bucket = Math.min(
          BUCKETS - 1,
          Math.max(0, Math.floor(pos / bucketSpan)),
        );
        lastMonthBuckets[bucket] += y;
      }
    }

    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    adClickActivity = weeks.map((w, i) => ({
      week: w,
      lastMonth: lastMonthBuckets[i],
      thisMonth: thisMonthBuckets[i],
    }));
  }

  return {
    subscribersMonthly,
    opensMonthly,
    adClickActivity,
  };
}
