const BASE = "https://graph.facebook.com";
const VERSION = process.env.META_API_VERSION ?? "v22.0";
const TOKEN = process.env.META_ACCESS_TOKEN!;

export class MetaApiError extends Error {
  constructor(public title: string, public userMsg: string, public code?: number) {
    super(title);
  }
}

export async function metaGet(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE}/${VERSION}/${path}`);
  url.searchParams.set("access_token", TOKEN);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString());
  const json = await res.json();

  if (json.error) {
    throw new MetaApiError(
      json.error.error_user_title ?? json.error.type,
      json.error.error_user_msg ?? json.error.message,
      json.error.code
    );
  }
  return json;
}

export async function metaPost(path: string, body: Record<string, any> = {}) {
  const url = new URL(`${BASE}/${VERSION}/${path}`);
  url.searchParams.set("access_token", TOKEN);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();

  if (json.error) {
    throw new MetaApiError(
      json.error.error_user_title ?? json.error.type,
      json.error.error_user_msg ?? json.error.message,
      json.error.code
    );
  }
  return json;
}

export async function paginateAll(path: string, params: Record<string, string> = {}) {
  const results: any[] = [];
  let data = await metaGet(path, params);
  results.push(...(data.data ?? []));

  while (data.paging?.next) {
    const next = new URL(data.paging.next);
    next.searchParams.set("access_token", TOKEN);
    const res = await fetch(next.toString());
    data = await res.json();
    results.push(...(data.data ?? []));
  }
  return results;
}
