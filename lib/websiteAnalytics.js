import { query } from "@/lib/db";
import websiteOptions from "@/data/websiteOptions";

const WORKSPACE_ID = 252988;
const ZERO_MONTHS = 6;

function buildEmptyMonths(count = ZERO_MONTHS, key = "totalClicks") {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const months = [];

  for (let i = 0; i < count; i++) {
    const mStart = new Date(
      currentMonthStart.getFullYear(),
      currentMonthStart.getMonth() - count + i,
      1,
    );

    const month = `${mStart.getFullYear()}-${String(
      mStart.getMonth() + 1,
    ).padStart(2, "0")}-01`;

    months.push({
      month,
      [key]: 0,
    });
  }

  return months;
}

export async function getWebsiteAnalyticsData(websiteId) {
  const numericWebsiteId = Number(websiteId);

  if (!numericWebsiteId || Number.isNaN(numericWebsiteId)) {
    return {
      websiteId: null,
      opensByMonth: [],
      subscribersByMonth: [],
      genderBreakdown: [],
      countryBreakdown: [],
      adClicksMonthly: buildEmptyMonths(),
    };
  }

  const opensSql = `
    WITH months AS (
      SELECT
        date_trunc('month', current_date) - INTERVAL '6 months'
          + (g.m * INTERVAL '1 month') AS month_start
      FROM generate_series(0, 5) AS g(m)
    )
    SELECT
      TO_CHAR(m.month_start::date, 'YYYY-MM-01') AS month,
      COALESCE(SUM(ces.emails_open_count), 0)::BIGINT AS total_opens,
      0::BIGINT AS total_openers,
      0::BIGINT AS heavy_openers
    FROM months m
    LEFT JOIN campaign_email_stats ces
      ON ces.campaign_date >= m.month_start
     AND ces.campaign_date < (m.month_start + INTERVAL '1 month')
     AND ces.website_id = $1
    GROUP BY m.month_start
    ORDER BY m.month_start;
  `;

  const subscribersSql = `
    WITH months AS (
      SELECT
        date_trunc('month', current_date) - INTERVAL '6 months'
          + (g.m * INTERVAL '1 month') AS month_start
      FROM generate_series(0, 5) AS g(m)
    )
    SELECT
      TO_CHAR(m.month_start::date, 'YYYY-MM-01') AS month,
      COALESCE(SUM(ces.emails_sent_count), 0)::BIGINT AS subscribers_count
    FROM months m
    LEFT JOIN campaign_email_stats ces
      ON ces.campaign_date >= m.month_start
     AND ces.campaign_date < (m.month_start + INTERVAL '1 month')
     AND ces.website_id = $1
    GROUP BY m.month_start
    ORDER BY m.month_start;
  `;

  const genderSql = `
    WITH date_window AS (
      SELECT
        date_trunc('month', current_date) - INTERVAL '6 months' AS start_month,
        date_trunc('month', current_date) AS current_month_start
    ),
    relevant_campaigns AS (
      SELECT c.id
      FROM campaigns c
      JOIN date_window w
        ON c.date::date >= w.start_month
       AND c.date::date < w.current_month_start
      WHERE c.website_id = $1
    ),
    relevant_opens AS (
      SELECT eo.user_id
      FROM emails_open eo
      JOIN relevant_campaigns rc ON rc.id = eo.campaign_id
    )
    SELECT
      u.gender,
      COUNT(DISTINCT ro.user_id) AS total_openers
    FROM relevant_opens ro
    JOIN users u ON u.id = ro.user_id
    WHERE u.gender IS NOT NULL
      AND u.gender <> ''
    GROUP BY u.gender
    ORDER BY total_openers DESC;
  `;

  const countrySql = `
    WITH date_window AS (
      SELECT
        date_trunc('month', current_date) - INTERVAL '6 months' AS start_month,
        date_trunc('month', current_date) AS current_month_start
    ),
    relevant_campaigns AS (
      SELECT c.id
      FROM campaigns c
      JOIN date_window w
        ON c.date::date >= w.start_month
       AND c.date::date < w.current_month_start
      WHERE c.website_id = $1
    ),
    relevant_opens AS (
      SELECT eo.user_id
      FROM emails_open eo
      JOIN relevant_campaigns rc ON rc.id = eo.campaign_id
    )
    SELECT
      u.country,
      COUNT(DISTINCT ro.user_id) AS total_openers
    FROM relevant_opens ro
    JOIN users u ON u.id = ro.user_id
    WHERE u.country IS NOT NULL
      AND u.country <> ''
    GROUP BY u.country
    ORDER BY total_openers DESC;
  `;

  const [opensResult, subscribersResult, genderResult, countryResult] =
    await Promise.all([
      query(opensSql, [numericWebsiteId]),
      query(subscribersSql, [numericWebsiteId]),
      query(genderSql, [numericWebsiteId]),
      query(countrySql, [numericWebsiteId]),
    ]);

  const opensByMonth = opensResult.rows.map((r) => ({
    month: r.month,
    totalOpens: Number(r.total_opens || 0),
    totalOpeners: Number(r.total_openers || 0),
    heavyOpeners: Number(r.heavy_openers || 0),
  }));

  const subscribersByMonth = subscribersResult.rows.map((r) => ({
    month: r.month,
    subscribersCount: Number(r.subscribers_count || 0),
  }));

  const genderBreakdown = genderResult.rows.map((r) => ({
    gender: r.gender,
    totalOpeners: Number(r.total_openers || 0),
  }));

  const countriesAll = countryResult.rows.map((r) => ({
    country: r.country,
    totalOpeners: Number(r.total_openers || 0),
  }));

  const countryBreakdown = countriesAll.slice(0, 4);

  const site = websiteOptions.find((s) => s.id === numericWebsiteId);
  const allowedDomains = new Set(site?.linklyDomains || []);

  let adClicksMonthly = buildEmptyMonths();

  if (allowedDomains.size > 0 && process.env.LINKLY_API_KEY) {
    try {
      const listUrl =
        `https://app.linklyhq.com/api/workspace/${WORKSPACE_ID}/list_links` +
        `?page_size=500` +
        `&search=p-ad` +
        `&sort_by=inserted_at` +
        `&sort_dir=desc` +
        `&api_key=${process.env.LINKLY_API_KEY}`;

      const listRes = await fetch(listUrl, { next: { revalidate: 43200 } });
      if (!listRes.ok) {
        throw new Error(`Failed to fetch Linkly links: ${listRes.status}`);
      }

      const listJson = await listRes.json();
      const links = listJson.links || listJson.data || [];

      const linkIds = links
        .filter((link) => allowedDomains.has(link.domain))
        .map((l) => l.id)
        .filter(Boolean);

      if (linkIds.length > 0) {
        const now = new Date();
        const currentMonthStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          1,
        );
        const startDate = new Date(currentMonthStart);
        startDate.setMonth(startDate.getMonth() - 6);
        const endDate = new Date(currentMonthStart);
        endDate.setDate(endDate.getDate() - 1);

        const yyyyMmDd = (d) =>
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0",
          )}-${String(d.getDate()).padStart(2, "0")}`;

        const clicksUrl =
          `https://app.linklyhq.com/api/v1/workspace/${WORKSPACE_ID}/clicks` +
          `?start=${encodeURIComponent(yyyyMmDd(startDate))}` +
          `&end=${encodeURIComponent(yyyyMmDd(endDate))}` +
          `&workspace_id=${WORKSPACE_ID}` +
          `&link_ids=${linkIds.join("-")}` +
          `&api_key=${process.env.LINKLY_API_KEY}` +
          `&bots=false`;

        const clicksRes = await fetch(clicksUrl, {
          next: { revalidate: 43200 },
        });

        if (clicksRes.ok) {
          const clicksJson = await clicksRes.json();
          const traffic = clicksJson.traffic || [];
          const monthBuckets = {};

          for (const point of traffic) {
            const t = point.t;
            const y = point.y;
            if (!t || y == null) continue;

            const d = new Date(t);
            if (Number.isNaN(d.getTime())) continue;

            const monthKey = `${d.getFullYear()}-${String(
              d.getMonth() + 1,
            ).padStart(2, "0")}-01`;

            monthBuckets[monthKey] = (monthBuckets[monthKey] || 0) + Number(y);
          }

          adClicksMonthly = buildEmptyMonths().map((m) => ({
            month: m.month,
            totalClicks: Number(monthBuckets[m.month] || 0),
          }));
        }
      }
    } catch (error) {
      console.error("[getWebsiteAnalyticsData] Linkly error:", error);
    }
  }

  return {
    websiteId: numericWebsiteId,
    opensByMonth,
    subscribersByMonth,
    genderBreakdown,
    countryBreakdown,
    adClicksMonthly,
  };
}
