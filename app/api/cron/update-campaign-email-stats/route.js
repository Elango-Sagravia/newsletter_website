export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const LOCK_ID = 987654321;

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lockResult = await query(
      `SELECT pg_try_advisory_lock($1) AS locked`,
      [LOCK_ID],
    );

    const locked = lockResult.rows?.[0]?.locked;

    if (!locked) {
      return NextResponse.json({
        success: true,
        skipped: true,
        message: "Another sync is already running",
      });
    }

    try {
      const sql = `
        INSERT INTO campaign_email_stats (
          campaign_id,
          website_id,
          campaign_date,
          emails_sent_count,
          emails_open_count,
          updated_at,
          last_recomputed_at
        )
        WITH recent_campaigns AS (
          SELECT
            c.id,
            c.website_id,
            COALESCE(c.date, c.created_at::date) AS campaign_date
          FROM campaigns c
          WHERE COALESCE(c.date, c.created_at::date) >= CURRENT_DATE - INTERVAL '30 days'
        ),
        sent_counts AS (
          SELECT
            es.campaign_id,
            COUNT(*)::BIGINT AS sent_count
          FROM emails_sent es
          INNER JOIN recent_campaigns rc
            ON rc.id = es.campaign_id
          GROUP BY es.campaign_id
        ),
        open_counts AS (
          SELECT
            eo.campaign_id,
            COUNT(*)::BIGINT AS open_count
          FROM emails_open eo
          INNER JOIN recent_campaigns rc
            ON rc.id = eo.campaign_id
          GROUP BY eo.campaign_id
        )
        SELECT
          rc.id AS campaign_id,
          rc.website_id,
          rc.campaign_date,
          COALESCE(sc.sent_count, 0) AS emails_sent_count,
          COALESCE(oc.open_count, 0) AS emails_open_count,
          NOW(),
          NOW()
        FROM recent_campaigns rc
        LEFT JOIN sent_counts sc
          ON sc.campaign_id = rc.id
        LEFT JOIN open_counts oc
          ON oc.campaign_id = rc.id
        ON CONFLICT (campaign_id)
        DO UPDATE SET
          website_id = EXCLUDED.website_id,
          campaign_date = EXCLUDED.campaign_date,
          emails_sent_count = EXCLUDED.emails_sent_count,
          emails_open_count = EXCLUDED.emails_open_count,
          updated_at = NOW(),
          last_recomputed_at = NOW();
      `;

      const result = await query(sql);

      return NextResponse.json({
        success: true,
        updated_campaigns: result.rowCount || 0,
        window: "last 30 days",
        ran_at: new Date().toISOString(),
      });
    } finally {
      await query(`SELECT pg_advisory_unlock($1)`, [LOCK_ID]);
    }
  } catch (error) {
    console.error("Cron update-campaign-email-stats failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
