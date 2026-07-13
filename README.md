


# Notes

## Setting up the project

Install dependencies with `bun install`, then run `bun --bun run db:generate` to create and populate the Better Auth database.

For local development, run `bun run dev` and open http://localhost:3000. The app can start without media-service credentials; Jellyfin, Radarr, Sonarr, TMDB, and Authelia features become active when their environment variables are configured.

Recommended local secrets:

```bash
BETTER_AUTH_SECRET=change-me
SESSION_SECRET=change-me
AUTHELIA_CLIENT_SECRET=change-me
```

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