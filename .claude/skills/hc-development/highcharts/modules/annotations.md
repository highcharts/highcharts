# Annotations

`modules/annotations`; `annotations-advanced` adds `Annotations/Types/*` (Fibonacci, Pitchfork, Measure, …). Stock tools build on it.

## Files

`Extensions/Annotations/`: `Annotation.ts` (class, `types` registry, `shapesMap`), `AnnotationChart.ts` (chart methods, pointer wrap), `Controllables/*` (label, path, rect, circle, ellipse, image), `ControlPoint.ts`, `ControlTarget.ts`, `MockPoint.ts` (points from x/y), `EventEmitter.ts` (drag), `Popup/*` (edit popup, indicator popup for stock tools), `NavigationBindings*.ts` (buttons → bindings), `Types/*`.

## Flow

- `options.annotations` → chart callback → `initAnnotation` → `new (Annotation.types[type] || Annotation)` → `setOptions` → `linkPoints` (series points or `MockPoint`) → shapes and labels via `Controllable*` → control points → `render`. Chart `redraw` → `drawAnnotations`.
- `update`, `addAnnotation`, `removeAnnotation` keep `chart.options.annotations` in sync.
- NavigationBindings (created on chart `load`): button click → `bindingsButtonClick` → plot clicks run the binding's `start`, `steps`, `end` → `addAnnotation`. Selecting an annotation fires `showPopup`.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Drag, touch, DOM events | `EventEmitter::addEvents`, `onDrag` | |
| Position on another axis | `MockPoint`, `ControlTarget` | |
| Advanced type bugs | `Types/<Type>.ts` | |
| Not exported | `Annotation::update` | export copies from options |
| Stock tools popup | `NavigationBindings::fieldsToOptions`, `Popup/*` | `ts/Stock/StockTools/*` |

Tests: `samples/unit-tests/annotations/`, `stock-tools/`.

## Couplings

- New annotation type: `Types/X.ts` (`Annotation.types.x`, `declare module './AnnotationType'`), import in `annotations-advanced.src.ts`, a binding in `NavigationBindingsDefaults.ts` or `StockToolsBindings.ts`.
- `annotations-advanced` inlines the whole stack again; `Annotation.types` differs per copy.
- export-data columns come from the `exportData` listener in `AnnotationChart.ts`; a11y descriptions from `AnnotationsA11y.ts`.
- The `connector` symbol is defined twice (`ControllableLabel.ts`, `SeriesLabel.ts`).
