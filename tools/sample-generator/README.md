# Sample Generator

Generates sample assets from `config.ts` files under `samples/**`.

## Run

Run commands from the repository root.

Generate classic and React samples (always both):

```bash
npx gulp generate-samples
```

## Unit tests

Run commands from the repository root.

Run sample-generator unit tests:

```bash
node --import tsx --test tools/sample-generator/tests/*.test.ts
```

Run these tests whenever you change:

- generator logic in `index.ts`
- templates in `tpl/`
- output mode behavior (`classic`/`react`)
- import/module setup behavior for React samples
- checksum logic or generated file lists

## Formatting examples

`getChartOptionsLiteral` normalizes generated option objects to keep output
readable and stable. The examples below document the intended transformations.

### Arrays of objects

Input:

```js
series: [
    {
        type: 'line',
        data: [1, 2, 3]
    },
    {
        type: 'line',
        data: [4, 5, 6]
    }
]
```

Output:

```js
series: [{
    type: 'line',
    data: [1, 2, 3]
}, {
    type: 'line',
    data: [4, 5, 6]
}]
```

### Arrays of numbers

Input (short):

```js
data: [
    29.9,
    71.5,
    106.4,
    129.2
]
```

Output (short, single line):

```js
data: [29.9, 71.5, 106.4, 129.2]
```

Input (long):

```js
data: [
    29.9,
    71.5,
    106.4,
    129.2,
    144,
    176,
    135.6,
    148.5,
    216.4,
    194.1,
    95.6
]
```

Output (wrapped to line length):

```js
data: [
    29.9, 71.5, 106.4, 129.2, 144, 176,
    135.6, 148.5, 216.4, 194.1, 95.6
]
```

### Arrays of strings

Input (short):

```js
categories: [
    'Apples',
    'Bananas',
    'Oranges',
    'Pears'
]
```

Output (short, single line):

```js
categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
```

Input (long):

```js
categories: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]
```

Output (wrapped to line length):

```js
categories: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]
```

## React option component extraction

When generating React samples, the generator extracts supported option blocks
from `chartOptions` and emits them as JSX children of the chart wrapper
component. Extraction is **all-or-nothing per block** — if a block contains
unsupported keys, it stays entirely in `chartOptions`.

Explicit blocks from `chartOptionsExtra` are always candidates for extraction.
In addition, samples with non-array `xAxis` / `yAxis` controls implicitly
extract the matching axis component plus the generated root `<Title>` and
template `<Series>` blocks, so axis demos do not need placeholder `title` or
`series` entries just to trigger React option components.

### Supported components

| Option block | Component | Extraction rule |
|---|---|---|
| `title` | `<Title>` | Only if `title` has exactly one key (`text`) |
| `tooltip` | `<Tooltip>` | Simple values → props, format strings → `<data-hc-option>` children |
| `series` | `<Series>` | `type`, `data`, `name` → direct props; remainder → `options={}` |
| `xAxis` | `<XAxis>` | Extracts the axis into `options={...}`; `title.text` becomes a `<Title>` child; skipped if axis is an array |
| `yAxis` | `<YAxis>` | Same as xAxis |
| `legend` | `<Legend>` | `labelFormat` → `<data-hc-option>` child; other keys → props |

### Example output

```jsx
import { Chart, Title, Series, Legend } from '@highcharts/react';

// ...
return (
    <Chart options={chartOptions}>
        <Title>My Chart Title</Title>
        <Series type="line" data={[1, 2, 3]} name="Revenue" />
        <Legend align="right" layout="proximate">
            <data-hc-option name="labelFormat">{name} (Click to hide)</data-hc-option>
        </Legend>
    </Chart>
);
```
