


# Notes

## Setting up the project

run the command `bun --bun run db:generate` in order to create and populate the better-auht database

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