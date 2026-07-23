# Frontend Applications

This directory manages the visual customer interface and the administrative control dashboard for the HE Skincare E-Commerce Platform.

*For high-level project details and architecture overview, refer to the [**Root System README**](../README.md).*

---

## 🎨 Design & Styling Frameworks

The storefront and admin dashboard utilize separate design systems optimized for their target users:

### 1. Storefront (`/WebPage` - Muted Quiet Luxury)
- **Styling Tech:** Built with **Tailwind CSS** utility classes and custom **Vanilla CSS** branding variables.
- **Theming & Localization:** Supports full Dark/Light modes and English/Arabic translation layouts.
- **Optimizations:** Implements image lazy-loading (`loading="lazy"`) and optimized React state context pipelines.

### 2. Admin Portal (`/Dashboard` - Clean Operational Interface)
- **Styling Tech:** Tailwind CSS (v3+) utility classes coupled with custom layouts.
- **Validation Highlights:** Admin forms contain real-time validation checks with **luminous bright red borders (`#ff3333`)** and glowing focus shadows.

---

## 📡 On-The-Fly Dynamic Translation (`SettingsContext.jsx`)

Instead of utilizing static translation files for user content, the customer storefront (`WebPage`) translates fetched content dynamically:
- **Client Translation Engine:** When the language changes to Arabic (`ar`), the storefront uses a translation hook inside `SettingsContext.jsx`.
- **Google Translate Integration:** The provider interceptor loops through all category names and descriptions and requests their translated equivalents in real-time from the Google translation API (`translate.googleapis.com`).
- **Dynamic Propagation:** The translated records are updated inside the context and propagated to all child components (ProductCard, CartPage, ShopPage).

---

## 🧪 Frontend Verification Systems

The frontend code uses Vitest for component unit tests and Cypress for end-to-end user-flow simulations.

### 1. Vitest (Component Testing)
Component logic is tested using `@testing-library/react` and Vitest:
- **WebPage component tests:**
  ```bash
  cd WebPage
  npm run test
  ```
- **Dashboard component tests:**
  ```bash
  cd Dashboard
  npm run test
  ```

### 2. Cypress (End-to-End Staging Tests)
Cypress E2E tests are configured in `Frontend/Dashboard/cypress` to simulate:
- Admin authorization flows (login validation, token storage, session rejection).
- Inventory catalog updates (adding products, validation checks, uploading product images).
- Storefront settings configuration changes.

- **To run Cypress tests locally:**
  ```bash
  cd Dashboard
  npx cypress open
  ```
