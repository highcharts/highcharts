---
name: browser-security-validation
description: Write temporary Playwright tests for one suspected browser-security issue or fix in Highcharts Core, Grid or Dashboards, with commands for the user to run manually. Invoke explicitly, including from another skill; does not execute browser validation or implement fixes.
---

# Browser security validation

Prepare Playwright tests for the caller's specific claim through the public
product API. The user runs them manually. Stop after writing the tests and
handoff; do not launch browsers, execute the generated tests, start servers,
build assets or install dependencies. This boundary also applies to delegated
agents and CLI tools. Never claim a finding reproduced or a fix verified from
preparation alone.

## Caller contract

Accept one finding per invocation: the claimed effect, attacker-controlled
input, source references, target checkout/revisions and relevant constraints.
Derive the tests from source; a caller's finding is a hypothesis. Ask only for
missing information that prevents meaningful preparation. If given several
findings, have the caller select one or invoke the skill separately for each.
A caller's execution or attempt budget does not authorize running tests here.

Static-only scans can request this preparation when writing temporary artifacts
is permitted. Preserve their restrictions and sealed reports. If preparation is
blocked, return the missing prerequisite without inventing tests or observations.

## Prepare the tests

1. Inspect the relevant implementation, public entry point and existing tests.
   Read [the repository recipe](references/repository-recipe.md) for runner paths,
   browser-policy checks and the handoff contract.
2. Record the source revision and relevant working-tree differences. Identify
   the assets the tests will load. Hash existing assets and verify provenance
   when possible; otherwise record the missing build/identity check as a manual
   prerequisite. An adjacent checkout's bundle is not proof of source identity.
3. Reuse existing Playwright dependencies, fixtures and build tasks. Inspect the
   supported Node version and installed tools without installing anything.
   Include exact manual setup/build commands for missing prerequisites.
4. Write the spec, minimal configuration and local fixtures in a uniquely named
   ignored `tmp/` directory or OS temporary directory. Keep product source,
   permanent tests, shared configuration and existing work unchanged. Do not
   switch or reset the checkout for revision comparisons.
5. Configure discovery, outputs and reporters explicitly so the manual command
   runs only the prepared cases. Keep browser/server startup inside fixtures or
   test hooks; importing the spec or config must not execute the experiment.

## What the generated tests must check

- Start with Chromium. Add Firefox/WebKit cases when namespace handling,
  navigation, serialization or another browser-dependent mechanism matters.
  Missing browsers and unsupported features must be explicit, never passing
  evidence. Avoid implicit downloads in the supplied commands.
- Prefer existing product fixtures; use a temporary isolated page when origin,
  headers or an exported document require it. Explain the fallback. Use fresh
  contexts without credentials or user profiles. Register local fixture routes
  before navigation and block unexpected outbound requests, including popups
  and workers; block service workers that could bypass routing.
- Keep input within the claimed attacker boundary. Exercise actual focus,
  click, load or export interactions and observe a harmless execution signal.
  Do not evaluate the payload through Playwright, enable sanitizer bypasses or
  add trusted callbacks that manufacture the effect. Markup alone is not proof.
- Include a benign feature/interaction control and a separate positive detector
  control for negative results. Fail clearly if either control fails.
- Test ordinary settings before relevant CSP and Trusted Types cases. Capture
  policy violations and prove enforcement; distinguish policy blocking from
  sanitization. For exported SVG, test live DOM and serialized/reparsed active
  documents separately, recording origin and embedding context.
- When vulnerable and fixed revisions are supplied, prepare the same cases for
  both with separate assets and outputs. A missing reproduced baseline cannot
  establish a verified fix.
- Give each case a named uncertainty and explicit assertions. Explain what a
  pass or failure means: a test asserting execution can pass when the suspected
  vulnerability reproduces. Timeouts, failed controls and setup failures must
  remain distinguishable from meaningful negative results. Retain browser
  versions, signals, errors, policy events and relevant markup as attachments.

## Return and stop

Write `report.md` and `result.json` using the recipe's preparation contract.
Include exact working directories and manual commands, prerequisite checks,
expected observations and interpretation. Link only created files. Clearly
label the tests **not run**; future evidence paths are expected outputs, not
existing artifacts.

Before marking preparation ready, statically review the spec against the required
cases and controls above. Resolve imports from the generated file's location,
check that export retains its control fixtures, and trace each assertion to the
interaction and detector. Do not require the disputed namespace or execution
behavior as a setup assertion that prevents the experiment from reaching its
click. Explain policy omissions from the mechanism, not merely from baseline
scope. Record unresolved generation problems as preparation blockers.

Syntax-only checks that do not
execute the spec/config or import application code are allowed. Do not run
Playwright, including discovery commands, or delegate execution to another tool.
Return when the tests and manual handoff are complete, or name the preparation
blocker. Browser execution and assessment of its results belong to a separate,
explicitly requested task outside this skill.
