# Security Policy — SafeHaven Women Safety Network

SafeHaven takes the security and privacy of our mission-critical safety platform very seriously. Because our application is designed to protect vulnerable individuals and broadcast emergency telemetry, maintaining rigorous security standards is paramount.

---

## 🔒 Supported Versions

The following versions of SafeHaven are currently supported with active security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## 🛡️ Security Features Implemented

SafeHaven implements multiple defense-in-depth security layers:
- **Role-Based Access Control (RBAC):** Strict administrative authorization separating standard users from command center administrative privileges.
- **Automated Login Telemetry Alerts:** Real-time email dispatch alerting users upon any sign-in detection to prevent unauthorized account access.
- **Session Verification:** Isolated token handling with cryptographic verification across Firebase Auth and REST API endpoints.
- **Data Minimization:** No plaintext passwords stored; high-entropy password hashing and zero-knowledge evidence encryption.
- **Rate Limiting & Anti-Spam:** Outbound distress and authentication throttling to mitigate denial-of-service and credential brute-force attempts.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or privacy concern within SafeHaven:

1. **Do NOT open a public GitHub issue.**
2. Send an email directly to our security team:
   - **Lead Developer & Administrator:** `ridwanulk08@gmail.com`
3. Please include in your report:
   - A description of the vulnerability.
   - Exact steps or proof-of-concept (PoC) to reproduce the issue.
   - Potential impact on user privacy or distress telemetry.

### Our Commitment
- We will acknowledge receipt of your vulnerability report within **24 hours**.
- We will investigate and deploy an urgent patch within **48–72 hours** depending on severity.
- We appreciate responsible disclosure and will credit researchers appropriately.

---

*SafeHaven — 24/7 Mission-Critical Women Emergency & Distress Network*
