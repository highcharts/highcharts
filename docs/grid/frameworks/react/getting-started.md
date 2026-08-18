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
Start by creating a simple grid using the `Grid` root and option components:

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

For Grid Pro, swap the imports to `@highcharts/grid-pro-react`.

See the [live Grid Lite example](https://stackblitz.com/edit/highcharts-grid-lite-integration-demo).
See the [live Grid Pro example](https://stackblitz.com/edit/highcharts-grid-pro-integration-demo).

## 3. Customize your grid
Highcharts Grid React provides dedicated React components for grid elements.

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

You can also pass a Core `options` object to `Grid` when you need the options
API. See the [Grid](https://www.highcharts.com/docs/grid/frameworks/react/grid)
article for the root component, `options`, refs, and callbacks.

Learn more:

- [Option components](https://www.highcharts.com/docs/grid/frameworks/react/components)
- [Columns](https://www.highcharts.com/docs/grid/frameworks/react/columns)
- [Data](https://www.highcharts.com/docs/grid/frameworks/react/data)
- [Styling](https://www.highcharts.com/docs/grid/frameworks/react/styling)

For Next.js applications, see the dedicated [Next.js integration guide](https://www.highcharts.com/docs/grid/frameworks/nextjs).
