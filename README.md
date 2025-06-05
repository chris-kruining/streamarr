


# Notes

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