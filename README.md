# Trim - URL Shortener with Analytics

Built using MongoDB, Express, React, Node, and TypeScript.

## Quick Start Setup
1. Ensure local MongoDB is active at `mongodb+srv://stag:veda123@satg.bauwhnj.mongodb.net/trimDB`
2. Run `npm install` from the root workspace directory.
3. Run `npm run dev` to launch both backend and frontend layers concurrently.

## Technical Design Decisions & Defenses
* **Short-Code Generation**: Random 6-char strings via NanoID to ensure operational security and prevent scraping attacks.
* **Click Analytics Storage**: Embedded sub-document tracking arrays inside each unique parent URL record, alongside an atomic increment hit counter. This maintains raw analysis breakdown potential without paying distributed lookup costs.
* **Database Indexes**: Unique index explicitly mapped directly onto the `shortCode` property to guarantee fast performance.
* **Redirection Strategy (301 vs 302)**: We strictly route clicks via an HTTP 302 Found Temporary Redirect. An HTTP 301 caches links inside browsers permanently, which stops subsequent user clicks from hitting our API server, breaking real-time metrics capture completely.