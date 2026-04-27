import { metaGet, metaPost, paginateAll } from "../../meta-ads";
import crypto from "crypto";

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.toLowerCase().trim()).digest("hex");
}

export async function list_audiences({ account_id }: { account_id: string }) {
  return paginateAll(`${account_id}/customaudiences`, {
    fields: "id,name,subtype,approximate_count,description",
  });
}

export async function create_custom_audience({
  account_id,
  name,
  description = "",
  subtype,
}: {
  account_id: string;
  name: string;
  description?: string;
  subtype: string;
}) {
  return metaPost(`${account_id}/customaudiences`, { name, description, subtype });
}

export async function add_users_to_audience({
  audience_id,
  phones = [],
  emails = [],
}: {
  audience_id: string;
  phones?: string[];
  emails?: string[];
}) {
  const schema: string[] = [];
  const data: string[][] = [];

  if (phones.length) {
    schema.push("PHONE");
    phones.forEach((p) => data.push([sha256(p)]));
  }
  if (emails.length) {
    schema.push("EMAIL");
    emails.forEach((e) => data.push([sha256(e)]));
  }

  return metaPost(`${audience_id}/users`, { schema, data });
}

export async function create_lookalike_audience({
  account_id,
  origin_audience_id,
  country,
  ratio,
}: {
  account_id: string;
  origin_audience_id: string;
  country: string;
  ratio: number;
}) {
  return metaPost(`${account_id}/customaudiences`, {
    name: `Lookalike ${country} ${ratio * 100}% - ${origin_audience_id}`,
    subtype: "LOOKALIKE",
    origin_audience_id,
    lookalike_spec: JSON.stringify({ country, ratio, type: "similarity" }),
  });
}
