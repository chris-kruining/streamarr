import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { createAuthClient } from "better-auth/solid";
import { genericOAuthClient } from "better-auth/client/plugins";

export const auth = betterAuth({
  appName: "Streamarr",
  basePath: "/api/auth",
  logger: {
    level: "info",
  },
  user: {
    additionalFields: {
      name: {
        type: "string",
        nullable: true,
      },
      preferred_username: {
        type: "string",
        nullable: true,
      },
      username: {
        type: "string",
        nullable: true,
      },
      profile: {
        type: "string",
        nullable: true,
      },
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "authelia",
          clientId: "streamarr",
          clientSecret:
            "ZPuiW2gpVV6MGXIJFk5P3EeSW8V_ICgqduF.hJVCKkrnVmRqIQXRk0o~HSA8ZdCf8joA4m_F",
          discoveryUrl:
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
        },
      ],
    }),
  ],
});

export const { signIn, signOut, useSession, ...client } = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [genericOAuthClient()],
});
