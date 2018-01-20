# Market Watch
To migrate data, run `sh migrate.sh`
The data migration syncs in data from Alpha Vantage, which can take a while since API requests are rate limited.
Run with the optional argument `--no-sync` to skip the API sync.

[Live app](https://market-watch.herokuapp.com)

You can run the sync without doing a full data migration by running `node cron` which will trigger the daily sync that runs in production.

---

### Features
- Stock data updates daily
- You can search companies and view their stock data
- Uses websockets to toggle company stock charts on all clients
---
### Stack
- Mongo
- NodeJS
- Express
- Mongoose
- Angular 5 (TypeScript & SCSS)
