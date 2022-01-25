## Substack Scraper
Express server with a single POST endpoint. Returns an array of objects by scraping different substack pages.

Created by: Brendan Walker

## Test Locally

```bash
curl -X POST http://localhost:4000 \
   -H 'Content-Type: application/json' \
   -d '{"usernames": ["alexberenson", "rwmalonemd", "stevekirsch"]}'
```
