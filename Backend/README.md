# Backend Services Engine

This service operates as the REST API hub for the HE Skincare E-Commerce Platform. It provides secure business logic layer routing, database schema definitions, automated messaging gateways, and server analytics.

*For high-level project details and architecture overview, refer to the [**Root System README**](../README.md).*

---

## 🔒 Hybrid Authentication & Security Engine

The API applies security gates on all route endpoints to protect against parameter tampering and scanning:

1. **Hybrid Auth Guard (`authMiddleware.js` & `authController.js`):**
   - Combines stateless JSON Web Tokens (JWT) and stateful HTTP sessions (`express-session` backed by `connect-mongo` storage).
   - Extracts and validates Bearer tokens for admin-protected routes.
   
2. **Token Invalidation & Blacklisting:**
   - On logout or refresh, old JWT tokens are blacklisted by saving them in the `BlacklistedToken` Mongoose model.
   - A MongoDB TTL index automatically cleans up expired tokens from the collection after 12 hours.

3. **Session Refresh Controller (`/api/auth/refresh`):**
   - Revokes old JWT tokens, extends the session cookie lifetime, and issues a new JWT token.

4. **Rate Limiting Engine (`rateLimiter.js`):**
   - Prevents brute-forcing with limiters on `/api/auth/login` (maximum 5 attempts per 15 minutes).
   - Global API limiters throttle rapid traffic spikes.

5. **Validation and Sanitization (`express-validator`):**
   - Inputs are parsed to verify data types. Prevents NoSQL Injection vectors using Mongoose schemas.
   - Trust Proxy configured via `app.set('trust proxy', 1)` to capture correct customer IPs behind Railway or Cloudflare.

---

## 💾 Bilingual Mongoose Schema Architectures

Bilingual text attributes are modeled as nested subdocuments in MongoDB. Refer to the main project README for the complete UML schema diagram mapping.

---

## 📡 WhatsApp Automation Gateway & Storage Volume

A headless WhatsApp container is loaded on startup using Puppeteer through `whatsapp-web.js`:
- **Railway Volume Storage:** Session credentials are saved in `/app/whatsapp_session` which is bound to a persistent **Railway Volume** to prevent session loss on Docker container redeployments.
- **Singleton Lock Cleanups:** Wipes stale Chromium lock files (`SingletonLock`, `SingletonCookie`, `SingletonSocket`) using `lstatSync` and `unlinkSync` on startup to prevent initialization freezes.
- **Client Dispatches:** Automatically sends order details and notifications to the store owner's WhatsApp when an order is placed, and allows admins to message customers from the Dashboard.

---

## 🧪 Integration Testing (`Jest`)
The backend is verified by integration tests under `/Backend/tests` (`orders.test.js`, `auth.test.js`, etc.) using Jest and Supertest.
```bash
npm run test
```
*Note: Enforces `--runInBand` and `--forceExit` to guarantee clean database transactions without hanging sockets.*

---

## 📄 Documentation References
For detailed specs on endpoints and testing structures:
- Refer to [**`API_README.md`**](./API_README.md) for full REST API parameters, payloads, and response statuses.
- Refer to [**`TESTING_README.md`**](./TESTING_README.md) for test execution scripts, libraries, and integration coverage.
