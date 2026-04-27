import { metaGet, paginateAll } from "../../meta-ads";
import { resolveAlias } from "../../supabase";

export async function list_ad_accounts() {
  const data = await metaGet("me/adaccounts", {
    fields: "id,name,account_status,currency,timezone_name",
  });
  return data.data ?? [];
}

export async function get_account_details({ account_id }: { account_id: string }) {
  const id = await resolveAlias(account_id);
  return metaGet(id, {
    fields: "id,name,account_status,currency,timezone_name,spend_cap,amount_spent",
  });
}

export async function list_campaigns({ account_id }: { account_id: string }) {
  const id = await resolveAlias(account_id);
  return paginateAll(`${id}/campaigns`, {
    fields: "id,name,status,objective,daily_budget,lifetime_budget,created_time",
  });
}

export async function list_adsets({ campaign_id }: { campaign_id: string }) {
  return paginateAll(`${campaign_id}/adsets`, {
    fields: "id,name,status,daily_budget,targeting,optimization_goal,created_time",
  });
}

export async function list_ads({ adset_id }: { adset_id: string }) {
  return paginateAll(`${adset_id}/ads`, {
    fields: "id,name,status,creative,created_time",
  });
}

export async function get_ad_creative({ creative_id }: { creative_id: string }) {
  return metaGet(creative_id, {
    fields: "id,name,body,title,image_url,object_url,call_to_action",
  });
}

export async function list_pages() {
  const data = await metaGet("me/accounts", {
    fields: "id,name,category,fan_count",
  });
  return data.data ?? [];
}

export async function list_instagram_accounts({ page_id }: { page_id: string }) {
  const data = await metaGet(`${page_id}/instagram_accounts`, {
    fields: "id,username,profile_pic",
  });
  return data.data ?? [];
}

export async function get_campaign_insights({
  campaign_id,
  date_preset = "last_30d",
}: {
  campaign_id: string;
  date_preset?: string;
}) {
  return metaGet(`${campaign_id}/insights`, {
    fields: "impressions,reach,clicks,ctr,cpc,spend,actions,cost_per_action_type",
    date_preset,
  });
}
