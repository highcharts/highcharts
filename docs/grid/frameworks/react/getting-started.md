---
sidebar_label: "Getting started"
---

# Getting started
Use the official React package for Grid Lite or Grid Pro. It is a self-contained
component package that handles grid setup/cleanup and loads the Grid CSS for you.
Requires React 18 or higher.

## 1. Install the Grid React package
```bash
npm install @highcharts/grid-lite-react
# or
npm install @highcharts/grid-pro-react
```

The core Grid library is included as a dependency and will be installed
automatically.

### Updating to newer versions
- **Minor and patch updates:** Run `npm update` to get the latest compatible version
- **Major updates:** Install the latest React package which will include the new major version:
  ```bash
  npm install @highcharts/grid-lite-react@latest
  ```

## 2. Create your grid

Start with the `Grid` component and pass `Data` and `Column` as children, or
pass the same Grid `options` object used in Core. Both work, and they can be
combined.

```tsx
import { Grid, Data, Column } from '@highcharts/grid-lite-react';

export default function App() {
    return (
        <Grid>
            <Data
                columns={{
                    name: ['Alice', 'Bob', 'Charlie', 'David'],
                    age: [23, 34, 45, 56],
                    city: ['New York', 'Oslo', 'Paris', 'Tokyo']
                }}
            />
            <Column columnId="name" headerFormat="Name" />
            <Column columnId="age" dataType="number" headerFormat="Age" />
            <Column columnId="city" headerFormat="City" />
        </Grid>
    );
}
```

The same grid with the Core `options` object:

```tsx
import { Grid, type GridOptions } from '@highcharts/grid-lite-react';

const options: GridOptions = {
    data: {
        columns: {
            name: ['Alice', 'Bob', 'Charlie', 'David'],
            age: [23, 34, 45, 56],
            city: ['New York', 'Oslo', 'Paris', 'Tokyo']
        }
    },
    columns: [
        { id: 'name', header: { format: 'Name' } },
        { id: 'age', dataType: 'number', header: { format: 'Age' } },
        { id: 'city', header: { format: 'City' } }
    ]
};

export default function App() {
    return <Grid options={options} />;
}
```

How `options` merges with children, and Grid Pro (`gridKey`), are documented
with
[the Grid component](https://www.highcharts.com/docs/grid/frameworks/react/grid).

See the [live Grid Lite example](https://stackblitz.com/edit/highcharts-grid-lite-integration-demo).
See the [live Grid Pro example](https://stackblitz.com/edit/highcharts-grid-pro-integration-demo).

<!-- Sample placeholder: grid/react/getting-started
<iframe src="https://www.highcharts.com/samples/embed/grid/react/getting-started?force-light-theme" allow="fullscreen"></iframe>
-->

## 3. Customize your grid

The same Grid features are available as child components or as keys on the
`options` object. The examples below add a table caption: `Caption` children
become `caption.text`.

```tsx
import { Grid, Data, Column, Caption } from '@highcharts/grid-lite-react';

export default function App() {
    return (
        <Grid>
            <Caption>Team directory</Caption>
            <Data
                columns={{
                    name: ['Alice', 'Bob', 'Charlie', 'David'],
                    age: [23, 34, 45, 56],
                    city: ['New York', 'Oslo', 'Paris', 'Tokyo']
                }}
            />
            <Column columnId="name" headerFormat="Name" />
            <Column columnId="age" dataType="number" headerFormat="Age" />
            <Column columnId="city" headerFormat="City" />
        </Grid>
    );
}
```

The same caption through `options`:

```tsx
import { Grid, type GridOptions } from '@highcharts/grid-lite-react';

const options: GridOptions = {
    caption: {
        text: 'Team directory'
    },
    data: {
        columns: {
            name: ['Alice', 'Bob', 'Charlie', 'David'],
            age: [23, 34, 45, 56],
            city: ['New York', 'Oslo', 'Paris', 'Tokyo']
        }
    },
    columns: [
        { id: 'name', header: { format: 'Name' } },
        { id: 'age', dataType: 'number', header: { format: 'Age' } },
        { id: 'city', header: { format: 'City' } }
    ]
};

export default function App() {
    return <Grid options={options} />;
}
```

Pagination, sorting, and the rest of the catalog follow the same pattern.

Continue with:

- [Grid](https://www.highcharts.com/docs/grid/frameworks/react/grid) for the
  root component, the options object, refs, and `gridKey`
- [Components](https://www.highcharts.com/docs/grid/frameworks/react/components)
  for the component catalog
- [Columns](https://www.highcharts.com/docs/grid/frameworks/react/columns) for
  `Column` and `ColumnDefaults`
- [Data](https://www.highcharts.com/docs/grid/frameworks/react/data) for loading
  and updating row data
- [Styling](https://www.highcharts.com/docs/grid/frameworks/react/styling) for
  themes, class names, and Tailwind
- [Next.js](https://www.highcharts.com/docs/grid/frameworks/nextjs) when the
  app uses the Next.js App Router
