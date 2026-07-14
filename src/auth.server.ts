import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface AuthSession {
  user: {
    username?: string | null;
    name: string;
    email: string;
    image?: string | null;
  };
}

export async function getAuthSession(request: Request): Promise<AuthSession | null> {
  if (getOptionalConvexSiteUrl() === undefined) {
    return null;
  }

  const response = await fetchConvexAuth(request, "/api/auth/get-session");

  if (!response.ok) {
    throw new Error(`Failed to fetch auth session from Convex: ${response.status}`);
  }

  return response.json() as Promise<AuthSession | null>;
}

export async function proxyAuthRequest(request: Request): Promise<Response> {
  return fetchConvexAuth(request);
}

function fetchConvexAuth(request: Request, pathOverride?: string) {
  const requestUrl = new URL(request.url);
  const convexSiteUrl = getConvexSiteUrl();
  const targetPath = pathOverride ?? `${requestUrl.pathname}${requestUrl.search}`;
  const targetUrl = new URL(targetPath, convexSiteUrl);
  const headers = createForwardedHeaders(request, convexSiteUrl);
  const init: RequestInit = {
    headers,
    method: request.method,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    // Required by Node-compatible fetch implementations for streaming bodies.
    // @ts-expect-error RequestInit.duplex is not in every DOM typing yet.
    init.duplex = "half";
  }

  return fetch(targetUrl, init);
}

function createForwardedHeaders(request: Request, convexSiteUrl: string) {
  const requestUrl = new URL(request.url);
  const headers = new Headers(request.headers);

  headers.delete("connection");
  headers.delete("content-length");
  headers.delete("transfer-encoding");
  headers.set("accept-encoding", "identity");
  headers.set("host", new URL(convexSiteUrl).host);
  headers.set("x-forwarded-host", requestUrl.host);
  headers.set("x-forwarded-proto", requestUrl.protocol.replace(/:$/, ""));
  headers.set("x-better-auth-forwarded-host", requestUrl.host);
  headers.set(
    "x-better-auth-forwarded-proto",
    requestUrl.protocol.replace(/:$/, ""),
  );

  return headers;
}

function getConvexSiteUrl() {
  const convexSiteUrl = getOptionalConvexSiteUrl();

  if (convexSiteUrl === undefined) {
    throw new Error(
      "Set CONVEX_SITE_URL or NEXT_PUBLIC_CONVEX_URL to your Convex deployment URL.",
    );
  }

  return convexSiteUrl;
}

function getOptionalConvexSiteUrl() {
  const configuredUrl =
    getServerEnv("CONVEX_SITE_URL") ??
    getServerEnv("NEXT_PUBLIC_CONVEX_SITE_URL") ??
    getServerEnv("VITE_CONVEX_SITE_URL");

  if (configuredUrl !== undefined) {
    return configuredUrl;
  }

  const convexUrl =
    getServerEnv("CONVEX_URL") ??
    getServerEnv("NEXT_PUBLIC_CONVEX_URL") ??
    getServerEnv("VITE_CONVEX_URL");

  return convexUrl?.replace(/\.convex\.cloud$/, ".convex.site");
}

function getServerEnv(name: string) {
  return process.env[name] ?? readLocalEnvFiles()[name];
}

let localEnv: Record<string, string> | undefined;

function readLocalEnvFiles() {
  if (localEnv !== undefined) {
    return localEnv;
  }

  localEnv = {};

  for (const file of [".env", ".env.local"]) {
    const path = join(process.cwd(), file);

    if (!existsSync(path)) {
      continue;
    }

    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*(?:export\s+)?([^#=\s]+)\s*=\s*(.*)\s*$/);

      if (match === null) {
        continue;
      }

      localEnv[match[1]] = parseEnvValue(match[2]);
    }
  }

  return localEnv;
}

function parseEnvValue(value: string) {
  const trimmed = value.trim();
  const quote = trimmed[0];

  if (
    (quote === '"' || quote === "'") &&
    trimmed.endsWith(quote) &&
    trimmed.length >= 2
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}
