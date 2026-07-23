# CI/CD Pipeline & Workflow Documentation

This directory contains the automated workflows and continuous integration jobs built for the HE Skincare E-Commerce Platform.

*For high-level project details and architecture overview, refer to the [**Root System README**](../../README.md).*

---

## 🚀 Workflows & Pipelines Overview

The CI/CD pipeline runs on GitHub Actions to ensure code quality, type safety, and test compliance before changes are merged into the `main` branch. 

```
[ Git Push / PR to main ]
          │
          ├──► Backend Service Build & Test (Jest Integration Suite)
          ├──► Storefront UI Build & Test (Vitest)
          └──► Dashboard Admin UI Build & Test (Vitest)
```

The workflow file is defined in [`ci.yml`](file:///d:/SkinCareProject/.github/workflows/ci.yml) and runs three concurrent, independent build pipelines on an `ubuntu-latest` runner virtual machine.

---

## 🛠️ Step-by-Step CI/CD Jobs

### 1. Backend Integration Service Job
Runs backend database schemas and routes integration tests:
- **Environment Setup:** Loads Node.js and installs Backend packages.
- **Mock Environment Injection:** Injects required environment secrets (`JWT_SECRET`, `SESSION_SECRET`, `MONGO_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`) into the runner context.
- **Execution:** Runs the integration test suite via Jest:
  ```bash
  npm test
  ```
  *Note: Enforces `--runInBand` and `--forceExit` to guarantee clean database teardowns without hanging sockets.*

### 2. Storefront WebPage Service Job
Ensures storefront components are compiled and clean:
- **Environment Setup:** Installs dependencies under `Frontend/WebPage`.
- **Validation:** Runs component units and logic validation tests using Vitest:
  ```bash
  npm run test
  ```

### 3. Dashboard Administrative Service Job
Verifies the admin control panel:
- **Environment Setup:** Installs dependencies under `Frontend/Dashboard`.
- **Validation:** Runs dashboard component tests using Vitest.

---

## 📦 Deployment pipeline (Staging & Production)

Once the GitHub Actions workflow returns a success status (green checkmark), deployment triggers:
1. **API Backend Engine:** Hosted on **Railway** inside a secure Docker container, with `/app/whatsapp_session` bound to a persistent Railway Volume to protect stateful Puppeteer sessions.
2. **Storefront & Dashboard:** Deployed on **Vercel** with automatic CDN caching and edge network distribution.
