# Market Watch
---
To build run `sh build.sh`
The data migration syncs in data from Alpha Vantage, which can take a while since API requests are rate limited.
Run with the optional argument `--no-sync` to skip the API sync.

You can run the sync without doing a full data migration by running `node cron` which will trigger the daily sync that runs in production.
