import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { GenericCtx } from "@convex-dev/better-auth/utils";
import { betterAuth } from "better-auth";
import type { BetterAuthOptions } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuthOptions = (ctx: GenericCtx<DataModel>) =>
  ({
    appName: "Streamarr",
    basePath: "/api/auth",
    baseURL: process.env.SITE_URL ?? "http://localhost:3000",
    secret:
      process.env.BETTER_AUTH_SECRET ??
      process.env.AUTH_SECRET ??
      "streamarr-local-development-secret-change-me",
    database: authComponent.adapter(ctx),
    user: {
      additionalFields: {
        name: {
          type: "string",
          required: false,
        },
        username: {
          type: "string",
          required: false,
        },
      },
    },
    plugins: [
      genericOAuth({
        config: [
          {
            providerId: "authelia",
            clientId: process.env.AUTHELIA_CLIENT_ID ?? "streamarr",
            clientSecret: process.env.AUTHELIA_CLIENT_SECRET ?? "",
            discoveryUrl:
              process.env.AUTHELIA_DISCOVERY_URL ??
              "https://auth.kruining.eu/.well-known/openid-configuration",
            scopes: [
              "offline_access",
              "openid",
              "email",
              "picture",
              "profile",
              "groups",
            ],
            accessType: "offline",
            pkce: true,
            mapProfileToUser: ({
              id,
              name,
              email,
              image,
              preferred_username,
              emailVerified,
            }) => ({
              id,
              name,
              email,
              emailVerified,
              image,
              username: preferred_username,
            }),
          },
        ],
      }),
      convex({ authConfig }),
    ],
  }) satisfies BetterAuthOptions;

export const options = createAuthOptions({} as GenericCtx<DataModel>);

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth(createAuthOptions(ctx));
