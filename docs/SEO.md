# Search and sharing setup

Canonical production URL: https://cevir.haking.tr/.

1. Push the repository and wait for a successful Cloudflare deployment.
2. Confirm /privacy, /about, /updates and /help return their distinct content. Unknown paths must return 404.
3. Verify the domain property in Google Search Console using its provided DNS TXT record. No verification value is embedded in this repository.
4. Submit https://cevir.haking.tr/sitemap.xml. Inspect the home page and request indexing.
5. Check image URLs and social previews after deployment. Crawling and rankings are controlled by search engines; metadata cannot guarantee placement.

The website includes canonical URLs, unique titles/descriptions, Open Graph/Twitter cards, software structured data without invented ratings, crawlable image elements, an image sitemap and robots.txt. Language choice is client-side; no separate language URLs or hreflang claims are made.

If cevirmen.haking.tr is chosen instead, configure the domain in Cloudflare and redirect the old hostname permanently, then update the canonical origin, sitemap, social URLs and extension site bridge together. Avoid publishing two competing canonical hosts.
