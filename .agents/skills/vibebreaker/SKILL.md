---
name: vibebreaker
description: 20-pass adversarial audit protocol for vibe-coded software. Locates security, correctness, resilience, consistency, performance, and operability failures across the codebase.
---

# VibeBreaker — The 20-Pass Adversarial Audit Protocol

> **Your AI said "it works." Make it prove it.**

Use this skill when asked to audit, review, security-check, or stress-test the codebase using VibeBreaker or the 20-pass protocol.

## Protocol Entry Point & Execution Rules

1. **Read Protocol**: Read [AUDIT_PROTOCOL.md](./AUDIT_PROTOCOL.md) completely before starting.
2. **Determine Mode**:
   - `FULL` (default): All 20 passes.
   - `SECURITY`: Passes 01, 02, 03, 04, 14, 15, 20.
   - `FAST`: Passes 01, 03, 05, 06, 11, 20.
   - `RELIABILITY`: Passes 05, 06, 07, 11, 12, 13, 20.
   - `PERFORMANCE`: Passes 08, 09, 10, 20.
3. **Read Pass Prompts**: Read only the required pass files from [prompts/](./prompts/).
4. **Read-Only Codebase**: Remain strictly read-only with respect to product code and product data during the audit.
5. **Audit Artifacts**:
   - Write raw pass results under `.vibebreaker/raw/`.
   - Write the final report to `.vibebreaker/FINAL_REPORT.md` formatted using [templates/final-report.md](./templates/final-report.md).
6. **Pass 20 Authority**: Pass 20 ([prompts/20-verification-false-positive-filter.md](./prompts/20-verification-false-positive-filter.md)) is the adversarial verifier and sole authority for final finding status.
7. **Remediation**: If fixes are requested, finish the audit first, then propose a separate remediation plan. Never silently mix review and repair.

## Pass Inventory

| Pass | Focus Area | Prompt File |
| :--- | :--- | :--- |
| **01** | Injection & Untrusted Input | [01-injection-untrusted-input.md](./prompts/01-injection-untrusted-input.md) |
| **02** | Auth & Session Management | [02-auth-session-management.md](./prompts/02-auth-session-management.md) |
| **03** | Authorization & IDOR | [03-authorization-idor.md](./prompts/03-authorization-idor.md) |
| **04** | Secrets & Sensitive Data | [04-secrets-sensitive-data.md](./prompts/04-secrets-sensitive-data.md) |
| **05** | Error Handling & Failure Paths | [05-error-handling-failure-paths.md](./prompts/05-error-handling-failure-paths.md) |
| **06** | Concurrency & Race Conditions | [06-concurrency-race-conditions.md](./prompts/06-concurrency-race-conditions.md) |
| **07** | Resource Lifecycle & Leaks | [07-resource-lifecycle-leaks.md](./prompts/07-resource-lifecycle-leaks.md) |
| **08** | Data Access & N+1 | [08-data-access-n-plus-one.md](./prompts/08-data-access-n-plus-one.md) |
| **09** | Algorithmic Complexity | [09-algorithmic-complexity-hot-paths.md](./prompts/09-algorithmic-complexity-hot-paths.md) |
| **10** | Memory & Unbounded Growth | [10-memory-unbounded-growth.md](./prompts/10-memory-unbounded-growth.md) |
| **11** | External Calls & Resilience | [11-external-calls-timeouts-resilience.md](./prompts/11-external-calls-timeouts-resilience.md) |
| **12** | Idempotency & Retry Safety | [12-idempotency-retry-safety.md](./prompts/12-idempotency-retry-safety.md) |
| **13** | Transactions & Consistency | [13-transactions-consistency-boundaries.md](./prompts/13-transactions-consistency-boundaries.md) |
| **14** | Config & Env Hardening | [14-config-environment-hardening.md](./prompts/14-config-environment-hardening.md) |
| **15** | Dependencies & Supply Chain | [15-dependencies-supply-chain.md](./prompts/15-dependencies-supply-chain.md) |
| **16** | Logging & Auditability | [16-logging-observability-auditability.md](./prompts/16-logging-observability-auditability.md) |
| **17** | API Contract Consistency | [17-api-contract-consistency.md](./prompts/17-api-contract-consistency.md) |
| **18** | Cross-Module Contracts | [18-cross-module-contracts.md](./prompts/18-cross-module-contracts.md) |
| **19** | Test Gaps & Quality | [19-test-gaps-validation-quality.md](./prompts/19-test-gaps-validation-quality.md) |
| **20** | Adversarial Verification | [20-verification-false-positive-filter.md](./prompts/20-verification-false-positive-filter.md) |
