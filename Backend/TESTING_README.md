# Comprehensive Testing Manual

This document details the multi-tier testing suites implemented across the backend and frontend components.

---

## 🧪 Testing Pyramid Structure

```
              /‾‾‾‾‾‾‾‾‾‾‾‾‾\
             /   Cypress E2E \       ◄— Simulated user browser flows
            /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
           /  Vitest Components \     ◄— Component logic verification
          /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
         /   Jest Integration API \   ◄— Route auth & schema validators
        /__________________________\
```

---

## 🟢 1. Backend REST API Tests (Jest & Supertest)

Integration tests verify database schemas, security middlewares, and business logic routing under `/Backend/tests`.

### Running Backend Tests
Execute the test command inside the `Backend` directory:
```bash
npm run test
```
*Note: Jest runs with `--runInBand` (runs tests sequentially to avoid database transaction conflicts) and `--forceExit` (ensures the process exits cleanly by closing database connections and mock HTTP servers).*

### Backend Test Suites:
- **Authentication (`auth.test.js`):** Verifies registration flow, password encryption with `bcryptjs`, JWT validation gates, cookie setups, and token blacklisting on logout.
- **Product Operations (`products.test.js`):** Tests product listings, category verification filters, and file attachments in multipart forms.
- **Orders Flow (`orders.test.js`):** Evaluates bag checkouts, payment references, state transitions, and mocked WhatsApp notification dispatches.

---

## 🔵 2. Frontend Component Tests (Vitest)

Uses **Vitest** and `@testing-library/react` inside `/Frontend/WebPage` and `/Frontend/Dashboard` to verify component rendering and user state transitions.

### Running Vitest Component Tests
Run the test command inside either directory:
```bash
npm run test
```

### Storefront Component Tests (`/WebPage`):
- **`utils.test.js`:** Verifies currency formatting rules (`formatPrice()`) return `EGP` or `ج` based on active language settings.
- **`cart-context.test.jsx`:** Tests core cart state transitions (add item, adjust quantity, verify totals, and clean slate resets).
- **`ProductCard.test.jsx`:** Mocks `useLanguage`, `useSettings`, and `useCart` contexts to verify product card elements.

---

## 🟡 3. End-to-End browser Tests (Cypress)

Admin panel interactions are validated using **Cypress** to test complete user-flows against a headless browser instance.

### Running Cypress E2E Tests
1. Ensure the backend and dashboard dev servers are running.
2. Launch the Cypress test runner:
   ```bash
   cd Frontend/Dashboard
   npx cypress open
   ```

### Tested E2E User-Flows:
- **Authorization Verification:** Tests form invalidation warnings (bright red highlights), login submissions, redirects, and token storage.
- **Catalog Management:** Simulates creating a new product category, uploading images to Cloudinary, and deleting items.
- **Dynamic Site Adjustments:** Updates store settings (name, hero banners, contact location coordinates) and verifies details save correctly.
