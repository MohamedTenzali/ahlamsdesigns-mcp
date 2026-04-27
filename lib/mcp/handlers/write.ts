import { metaPost } from "../../meta-ads";

// --- Status handlers ---
export async function set_campaign_status({ campaign_id, status }: { campaign_id: string; status: string }) {
  return metaPost(campaign_id, { status });
}

export async function set_adset_status({ adset_id, status }: { adset_id: string; status: string }) {
  return metaPost(adset_id, { status });
}

export async function set_ad_status({ ad_id, status }: { ad_id: string; status: string }) {
  return metaPost(ad_id, { status });
}

// --- Budget handler ---
export async function update_budget({
  adset_id,
  daily_budget,
  lifetime_budget,
}: {
  adset_id: string;
  daily_budget?: number;
  lifetime_budget?: number;
}) {
  const body: any = {};
  if (daily_budget) body.daily_budget = String(Math.round(daily_budget));
  if (lifetime_budget) body.lifetime_budget = String(Math.round(lifetime_budget));
  return metaPost(adset_id, body);
}

// --- Creation handlers ---
export async function create_campaign({
  account_id,
  name,
  objective,
  special_ad_categories = [],
}: {
  account_id: string;
  name: string;
  objective: string;
  special_ad_categories?: string[];
}) {
  return metaPost(`${account_id}/campaigns`, {
    name,
    objective,
    status: "PAUSED", // altijd PAUSED voor veiligheid
    special_ad_categories,
  });
}

export async function create_adset({
  campaign_id,
  name,
  daily_budget,
  targeting,
  optimization_goal,
  billing_event,
  page_id,
}: {
  campaign_id: string;
  name: string;
  daily_budget: number;
  targeting: any;
  optimization_goal: string;
  billing_event: string;
  page_id: string;
}) {
  return metaPost(`${campaign_id}/adsets`, {
    name,
    campaign_id,
    daily_budget: String(Math.round(daily_budget)),
    targeting,
    optimization_goal,
    billing_event,
    promoted_object: { page_id },
    status: "PAUSED", // altijd PAUSED
    advantage_audience: { type: "ADVANTAGE_AUDIENCE" }, // verplicht in 2025
  });
}

export async function create_ad_creative({
  account_id,
  name,
  page_id,
  message,
  link,
  image_hash,
  call_to_action_type = "MESSAGE_PAGE",
}: {
  account_id: string;
  name: string;
  page_id: string;
  message: string;
  link: string;
  image_hash?: string;
  call_to_action_type?: string;
}) {
  const object_story_spec: any = {
    page_id,
    link_data: {
      message,
      link,
      call_to_action: { type: call_to_action_type, value: { link } },
    },
  };
  if (image_hash) object_story_spec.link_data.image_hash = image_hash;

  return metaPost(`${account_id}/adcreatives`, { name, object_story_spec });
}

export async function create_ad({
  adset_id,
  name,
  creative_id,
}: {
  adset_id: string;
  name: string;
  creative_id: string;
}) {
  return metaPost(`${adset_id}/ads`, {
    name,
    adset_id,
    creative: { creative_id },
    status: "PAUSED", // altijd PAUSED
  });
}

export async function update_ad_creative({
  creative_id,
  message,
  link,
}: {
  creative_id: string;
  message?: string;
  link?: string;
}) {
  const body: any = {};
  if (message) body.body = message;
  if (link) body.object_url = link;
  return metaPost(creative_id, body);
}
