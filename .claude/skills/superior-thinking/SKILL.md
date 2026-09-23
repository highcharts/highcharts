---
name: superior-thinking
description: >
 Overriding pattern of reasoning and collaboration when working on
 Highcharts. Use at the start of EVERY conversation about a bug,
 regression, unexpected behavior, code analysis, or implementation
 decision — before the first hypothesis and before opening the first
 file. Also use whenever you catch yourself making a claim you have not
 verified, or when an experiment's result surprises you.
---

# superior-thinking — how I think when working on Highcharts

This skill records the full process of reasoning, verification, and
communication used when solving Highcharts bugs. It is the overriding
pattern: other skills are modes layered ON TOP of this process, not
instead of it. Even in a mode that leads via questions, the verification
and epistemic rules from this skill still hold unchanged.

## Fix and understanding

The work has two products, not one: the fixed bug **and** an accurate
understanding of why it broke at the mechanism level. Each bug is an
opportunity to sharpen knowledge of how Highcharts behaves at runtime
(the options layers, chart lifecycle, axis translation, modules). In
practice:

- explain the mechanism **during the investigation**, not only in the
 summary — every significant finding is a chance to state how Highcharts
 works at runtime;
- extract **general principles** from a case, not just the fix for this one bug;
- after a verified fix, capture the reusable principle it revealed — a
 bug-fix record is a store of Highcharts principles, not a changelog.

## Rule zero: fact ≠ conclusion ≠ guess

Every claim belongs to one of three categories and must be marked as such
in communication:

- **Fact** — checked directly: ran the code and saw the output, read the
 literal source lines, saw the test result. I can point to the evidence
 (`ts/Core/Axis/Axis.ts:1234`, command output, a value dump).
- **Conclusion** — follows logically from facts but was not itself
 checked. State what it follows from: "since X and Y, then probably Z".
- **Guess** — pattern-matching from experience, no evidence in this repo.
 Always explicit: "I'm guessing that…", "typically in such cases…".

Never state a conclusion or a guess in the grammar of a fact. If I don't
remember an issue number, an option name, or an API signature — I don't
invent it; I check the source or leave a blank and say so plainly.

The same taxonomy applies to **other people's claims**. A diagnosis handed
over by someone else ("it's 100% X's fault") enters the process as the
highest-priority hypothesis — I check it first — but never as a fact until
I see the evidence myself. Passing someone else's diagnosis onward by
attribution ("since you established that…") without verification is the
same dishonesty as one's own guess in the grammar of a fact.

## Process map
Understand problem → Reproduce/observe → Understand code → Hypothesis → Verify
↑                              |
└──────────── hypothesis refuted: go back up ────────────────┘
→ Fix → Test (red→green) → Evidence → "done"



The phases are not bureaucracy — they may be shortened when a bug is
trivial. They must not be shortened in the verification part: a claim
without evidence does not get promoted to a fact no matter how simple the
case seems.

Time pressure changes at most the order and scope of the work, never the
epistemics: everything this skill calls mandatory stays mandatory.
Deferred steps (broader tests, documenting the principle) are named
explicitly — silently skipping them is a lie by omission.

## Phase 0 — understand the problem before touching code

Before opening any file:

1. **Restate the symptom in my own words**: what happens, what should
  happen, under exactly which configuration (options, modules, data,
  version). If the issue description is ambiguous, I say which reading I
  adopt.
2. **Separate symptom from cause.** "The tooltip disappears" is a symptom;
  the cause may be a NaN from `translate`, a wrong `hoverPoint`, an event
  not detached on update. The symptom sets the starting point for
  tracing, not the location of the fix.
3. **Classify the bug**, because the class determines the strategy:
  - *regression* (used to work) → history first: `git log`, bisect across
   versions, changelog — hunt for the commit, don't read the whole
   subsystem;
  - *always been wrong* → read the mechanism and look for the false
   assumption;
  - *configuration-dependent* → differentiate: which option/module toggles
   the behavior, and go to the code that consumes that option;
  - *module interaction* (Stock, Boost, a11y, ordinal, dataGrouping…) →
   look for the composition/wrap that replaces core behavior.
4. **Form initial hypotheses from the description alone** — reading with
  comprehension before the debugger. Rank them by likelihood and cost to
  check.
5. **Establish the deliverable.** If the request describes a problem or
  asks "why" — the deliverable is the diagnosis; I don't introduce a fix
  until asked. If a fix is requested — the diagnosis still comes first,
  because a fix without a diagnosis is guessing.

## Phase 1 — reproduction and observation

- **Minimal reproduction**: cut the config down to the smallest one that
 still shows the bug. Every removed option after which the bug disappears
 is information — I record it, because it narrows the suspect code.
- **Comparison against a known answer**: next to the buggy case, set up a
 case whose result I know for sure. If a measurement tool gets the known
 case wrong, its result for the unknown one is worthless.
- **Not every bug needs a reproduction.** If the error is faster to see in
 the code itself (an obviously inverted condition, a typo in a property
 name), I say so and show the lines instead of firing up a browser. The
 reproduction returns as verification of the fix.
- Browser observation goes through DevTools; I log values at the point of
 suspicion, not "somewhere nearby".
- **Reproduction workbench**: a local repro file (`demo.html`,
 `repro.html`) outside `ts/`, cleaned up when the topic closes; version
 comparison on jsfiddle/CDN for regressions; the Elements
 inspector and DOM breakpoints for DOM/CSS bugs; a screenshot when the
 bug is visual.[5:04 PM]## Phase 2 — how I read and understand code

### Entering the code

I enter through identifiers, not by guessing filenames: grep by option
name, function, error message, CSS class. From a hit I go both directions
— I read the **whole function**, not just the matched line, and I check
**all callers**, because the caller defines the meaning of a parameter.

### Layers whose confusion generates wrong diagnoses

For each fragment I establish:

- what `this` is here (`Point`, `Series`, `Chart`, `Axis`, event context,
 formatter context) — without that, reading a method is guessing;
- which layer a value comes from: user option → option after merge with
 defaults (`chart.options`) → runtime state (`series.points`,
 `axis.min/max`) → property generated at render time (`point.plotX`, SVG
 elements). Bugs often come from reading the wrong layer;
- whether the behavior is replaced by a module: composition, `wrap`,
 `addEvent` (Stock, ordinal, dataGrouping, Boost, a11y can rewrite half
 of core). A grep of the function name across all of `ts/` catches these.

### Git archaeology — mandatory before a change

Before removing or modifying any code — a condition, a cache, a whole
mechanism — I check why it exists: `git blame`, `git log -p -L`, the
issue/PR number in the commit message. Every line in a mature library may
guard against a regression someone already fixed once. The commit message alone is not enough if it points to an issue/PR — I read the issue,
because only it tells me which case the code protects. Only once I know
what the code guarded against can I judge whether it is still a live
invariant or a historical heuristic.

### Hot-path awareness

Before adding code to a path, I check how often it is called:
`TimeBase.makeTime`, `TimeBase.getTimezoneOffset` (expensive `Intl`),
`Time.getTimeTicks`, `Axis.translate`, `Axis.setExtremes`,
pointer/tooltip, Boost, and data grouping. In these places every
allocation, `Intl`, DOM access, or extra iteration needs justification and
measurement. For changes on this list, measurement is not optional:
removing a mechanism that guards against an expensive call (a cache, a
limiting condition) requires counting how many times the expensive path
fires before and after the change — a verbal "it should be fine" is not
enough. The benchmark chart must exercise the path the removed mechanism protected (e.g. for an offset cache: a dense datetime axis with data grouping, not 10 points with no time axis) — a measurement on a chart that never touches the expensive path measures nothing.

## Phase 3 — hypotheses and their verification

This is the heart of the process, and the place where discipline is
absolute.

### The hypothesis cycle

1. Formulate the hypothesis so it is **falsifiable**: "if the cause is X,
  then after doing E I'll see Y; if I see Z, the hypothesis dies".
2. Pick the **cheapest decisive experiment** — one whose result actually
  discriminates between hypotheses, not one that merely "shows something".
3. **Run it and look at the real output.** I don't predict what the script
  will return — even a trivial one. Predicting instead of running is the
  most common source of false "facts".
4. Confront the result with a known-answer case (see Phase 1).
5. Hypothesis refuted → back onto the list as *ruled out with evidence*.
  Elimination is progress: I keep an explicit "checked and rejected" list
  so I don't go in circles.

### A surprising result = suspect the experiment first

If a result sounds like a discovery ("a DST transition at noon", "a
negative offset east of Greenwich in July") — that is first of all a signal
of an error in the measurement method, not a discovery. I verify with a
second, **independent** method (a different mechanism, not the same script
with a different log) before using the result in reasoning. Only agreement
between two independent methods promotes a result to a fact.

### Boundaries and comparisons — literally on the numbers

Claims about `<` vs `<=`, off-by-one, tick ranges, indices — always worked
out on concrete values (a mini truth table, substituting boundary
numbers), never "from memory". De Morgan on paper, not in the head:
`!(a && b)` written out explicitly before transforming a condition.

### Fragile patterns I don't use to gather data

- parsing a localized string back into a date:
 `new Date(date.toLocaleString(...))` interprets the string in the
 machine's timezone and silently corrupts results;
- comparing floats with `===` for pixels/translation;
- testing timezone behavior on a machine with no `TZ` set;
- a conclusion from a single run where timing/async is in play;
- **the symptom disappearing after removing a mechanism as proof of cause**:
 "I cut the cache and the tooltip works" does not prove the cache was the
 cause — removal may only have changed the timing or granularity at which
 the symptom manifests. Proof of cause is catching the bad value at its
 source (e.g. a wrong offset coming out of the cache while the freshly
 computed one is correct), not the symptom vanishing after amputation.

### When I'm stuck

After two or three refuted hypotheses I don't push into further variants of
the same theory. Instead:

1. I return to the **earliest unchecked assumption** — usually something I
  took as obvious in Phase 0 ("the data comes in sorted", "this event
  fires once");
2. I write out the state: what's ruled out (with evidence), what remains,
  what I don't know;
3. I widen the field: maybe the bug is one floor up the call chain, in a
  different options layer, in a module I didn't suspect.

An honest "I'm stuck, here's what I know" beats another confident theory.

## Phase 4 — designing the fix

- **Fix the false assumption, not the symptom.** First name it explicitly:
 which assumption of the condition was false, and which is still true. If
 the invariant is correct, narrow or widen the condition as locally as
 possible. A guard masking a symptom (`if (!isNaN(x))` at the point of
 manifestation) is not a fix until I know where the NaN came from.
- **Remove code only with evidence from archaeology**: when a condition is
 a historical heuristic, no longer describes a real invariant, or needs
 ever more exceptions to keep working.
- **Protect the public API.** Before changing behavior I check whether I'm
 touching: user options, events, exported types, JSDoc doclets, the
 behavior of Stock/Maps/Gantt/Boost/Accessibility/Dashboards/Grid. A
 public API change = a doclet update (declarations and docs are generated
 from JSDoc; TS types alone are not enough).
- **Compute the performance cost** (see hot paths in Phase 2): how many
 times the function is called before and after, what I'm adding, whether
 the removed condition was limiting expensive calls.
- **Edge cases as a habit**: `undefined`, `null`, `0`, empty array, missing
 option, string instead of number, a series with no points, no `zones`.
 Unrealistic in normal Highcharts flow — I say so plainly instead of
 adding dead guards.
- I work in `ts/`; I don't edit `code/`, `out/`, or `ts/masters/*.src.ts`.
 Style: match the nearest file — 4 spaces, single quotes, ~80 chars, no
 `console.*`, no `any`, narrow types instead of `as`.

### When there are several ways to fix it

If the bug can be fixed in more than one reasonable way, I don't choose
silently. I present the variants, and for each: scope of change, cost,
performance impact, and regression risk — plus my recommendation with
justification.

Default rule when choosing a variant: where possible, avoid reworking old,
elaborate functions called from dozens of places, because the consequences
of such a change can't be predicted. I prefer the narrowest variant: a
change at the caller, in the branch affected by the bug, in the module —
rather than in the heart of core.

Architectural decisions — a new abstraction, a change to the API shape,
moving responsibility between layers, touching an old, widely-called
function like that — are decisions to raise explicitly rather than take
unilaterally. Before implementing anything, lay out an exact description of
the potential effects of each option: what could break, in which modules,
and what can't be predicted.

## Phase 5 — tests and verification before "done"

- **The lightest test that really catches the regression**: pure logic →
 `test/ts-node-unit-tests/tests/`; the main place → QUnit in
 `samples/unit-tests/`; DOM/rendering → `tests/highcharts/<area>/`
 (always in an area subfolder); a visual test only as a last resort.
- **Proof of redness is mandatory.** A test that can't fail on the buggy
 code is worthless. Procedure: the test passes on the fix → temporarily
 restore the bug → the test goes red → restore the fix. Show both
 results. The test asserts **behavior visible from the library user's
 side** (the symptom from the issue: the right date in the tooltip, the
 correct tick position), not the fix mechanism — a "the cache doesn't
 exist" test is red-green theater, because it passes after any change to
 the mechanism, not only after fixing the symptom.
- For time/DST I test DST transitions, UTC, the local timezone, and named
 timezones, if the code touches them.
- **"Done" only with evidence**: a run test/command with shown output.
 Tests failed → I say they failed, with output. A step skipped → I say it
 was skipped. Zero "should work".
- After a verified fix, capture the reusable Highcharts principle it
 revealed.

## Communication

- **Technical, without dumbing down.** Highcharts terminology and property
 names in English.
- **Runtime context instead of detached JS**: what `this` is, which layer
 an option comes from, when in the chart lifecycle the code fires.
- **Name entities by their real identifiers** (`globalUserPlotOptions`, not
 a nickname); show the literal code fragment (2–6 lines) I'm talking about.
- **Mark epistemics** per rule zero: what's a fact (with evidence), what's a
 conclusion, what's a guess. A change in a hypothesis's status = a message.
- **Start with the result**, then the justification. During a longer
 investigation, give short updates when the direction changes and at every
 significant finding — including negative ones. "I checked X, it's out,
 because…" is a full-value result.
- **Ask when genuinely blocked**: a decision that isn't mine to make
 unilaterally (a scope change, a choice between fix variants with different
 consequences, a direction that breaks the API, an architectural decision)
 — yes; a fact checkable in the repo — no, I check it myself.
- Code comments: intent or invariant, never change history nor a
 description of code that no longer exists.[5:04 PM]## Red flags — catch yourself

Each of these thoughts means STOP and return to the process:

| Temptation | Reality |
|--------|---------------|
| "It's obvious, no need to run it" | A predicted output is a guess, not a fact. Run it. |
| "The result is surprising — interesting discovery!" | Suspect the experiment first. A second independent method. |
| "This condition looks redundant" | `git blame` first. Someone already fixed what it guards against. |
| "I remember this boundary is `<=`" | Boundaries are checked on numbers, not from memory. |
| "The test will surely pass" | A test with no proof of redness on the bug proves nothing. |
| "Faster to rewrite the whole fragment" | Surgical fix. A rewrite changes N behaviors; you're tracing one. |
| "The issue number is probably #24xxx" | Don't invent identifiers. Check, or leave a blank and say so. |
| "I'll add a NaN guard and be done" | Masking a symptom without knowing the source is debt, not a fix. |
| "It's just one line in a hot path" | One line × millions of calls. Compute the cost. |
| "They probably want the fix right away" | A problem description = the diagnosis is the deliverable. Fix after confirmation. |
| "They said it's X, so it's X" | Someone else's diagnosis = hypothesis #1 to check, not a fact. |
| "I removed it and the symptom vanished — cause found" | Amputation ≠ diagnosis. Catch the bad value at the source. |
| "Deadline, so I'll skip verification" | Time pressure changes scope, not epistemics. Defer explicitly. |
| "I'll pick the fix variant myself, why involve anyone" | Variants with consequences on the table. Architectural decisions are raised, not taken silently. |