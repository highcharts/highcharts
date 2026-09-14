# Visual Testing

Domain language for the visual regression testing pipeline.

## Language

**Visual-test runner**:
The component responsible for spec execution and browser automation.
_Avoid_: Test executor, visual executor

**Visual comparison system**:
The authoritative system for reference storage, pixel-diff semantics, reporting, and artifacts.
_Avoid_: Diff engine, comparison tool

**Reference rendering**:
A rendering produced from the `master` revision that serves as the baseline in a visual comparison.
_Avoid_: Baseline, golden image, snapshot, reference screenshot

**Candidate rendering**:
A rendering produced from the revision under test and submitted to the visual comparison system for diffing against the reference rendering.
_Avoid_: Actual, output screenshot, candidate screenshot

**Numeric visual difference**:
A comparison outcome where the candidate and reference renderings differ by a measurable pixel count with no associated execution error.
_Avoid_: Pixel diff, visual diff, diff count

**Sample execution error**:
A comparison outcome where the spec itself fails during rendering — distinct from a numeric visual difference and not caused by the browser or run environment.
_Avoid_: Test failure, spec error

**Terminal run error**:
A comparison outcome where the browser or run environment fails in a way that prevents rendering from completing.
_Avoid_: Runner error, browser crash, run failure

**Completion signal**:
A marker emitted by the visual-test runner when a product run finishes normally; its absence indicates a terminal run error.
_Avoid_: Done marker, finish flag
