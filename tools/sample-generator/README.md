# Sample Generator

Generates sample assets from `config.ts` files under `samples/**`.

## Run

Run commands from the repository root.

Generate classic samples:

```bash
npx gulp generate-samples
```

Generate React samples:

```bash
npx gulp generate-samples --outputMode react
```

Generate both classic and React samples:

```bash
npx gulp generate-samples --outputMode both
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
