# dietta-server
Backend for the Dietta App
Based on express.js, connects to an external mongodb database.

Todo:
- [ ] tracking weight
- [ ] reduce jankiness

## Running
Project root must include a .env file contaning JWT secret and db password
```
DB_PASS=verysecret
JWT_SECRET=randomnumbers
```

Then:
```
npm install
npm run dev
```

