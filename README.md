


# Notes

## Setting up the project

Install dependencies with `bun install`, then run `bun run dev`.

The dev script starts Convex first, waits for Convex environment variables from `.env.local` or `.env`, then starts Solid Start on http://localhost:3000. The app can start without media-service credentials; Jellyfin, Radarr, Sonarr, TMDB, and Authelia features become active when their environment variables are configured.

Recommended local secrets:

```bash
BETTER_AUTH_SECRET=change-me
SITE_URL=http://localhost:3000
AUTHELIA_CLIENT_SECRET=change-me
```

Better Auth now runs on Convex. Set `BETTER_AUTH_SECRET`, `SITE_URL`, `AUTHELIA_CLIENT_ID`, `AUTHELIA_CLIENT_SECRET`, and optionally `AUTHELIA_DISCOVERY_URL` in the Convex deployment with `bunx convex env set ...`. The app derives the auth proxy URL from Convex's generated `NEXT_PUBLIC_CONVEX_URL`, or you can override it with `CONVEX_SITE_URL`.

## APIS

### Host mocked api's

```bash
docker compose up
```

### Generate openapi client

- path to source yml or json
- path to output, will create a typescript file

example  
```bash
bunx openapi-typescript .\src\features\content\apis\api.json -o .\src\features\content\apis\api.generated.ts
```