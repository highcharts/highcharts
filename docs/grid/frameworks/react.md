---
sidebar_label: "Getting started"
---

# Highcharts Grid with React
Use the official React package for Grid Lite or Grid Pro. It is a self-contained
component package that handles grid setup/cleanup and loads the Grid CSS for you.
Requires React 18 or higher.

Configure the grid with dedicated React components. You can still pass an
`options` object when you need the Core options API.

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
Start with the `Grid` root and option components for data and columns:

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

## 3. Customize with components
Add caption, shared column defaults, grouped headers, and pagination as sibling
components of `Data` and `Column`:

```tsx
import {
    Grid,
    Data,
    Column,
    ColumnDefaults,
    Caption,
    Header,
    Pagination
} from '@highcharts/grid-lite-react';

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
            <ColumnDefaults sortingEnabled filteringEnabled />
            <Caption>Team directory</Caption>
            <Header
                header={[
                    'name',
                    {
                        format: 'Details',
                        columns: ['age', 'city']
                    }
                ]}
            />
            <Column columnId="name" headerFormat="Name" />
            <Column columnId="age" dataType="number" headerFormat="Age" />
            <Column columnId="city" headerFormat="City" />
            <Pagination pageSize={5} />
        </Grid>
    );
}
```

## 4. Style with class names
Pass `className` to the React mount container and `tableClassName` to the table.
Set `theme` to an empty string when you want to style the grid with your own
classes, for example Tailwind utilities, instead of the default Grid theme.

```tsx
<Grid
    theme=""
    className="rounded-xl border border-slate-200 bg-white p-4"
    tableClassName="w-full"
>
    <Data columns={columns} />
    <Column
        columnId="name"
        headerClassName="bg-slate-50 p-4 font-semibold"
        cellClassName="p-4"
    />
</Grid>
```

## Next steps
- [Grid](https://www.highcharts.com/docs/grid/frameworks/react/grid) for the root component, `options`, refs, and callbacks
- [Option components](https://www.highcharts.com/docs/grid/frameworks/react/components) for the component catalog
- [Columns](https://www.highcharts.com/docs/grid/frameworks/react/columns) for `Column`, `ColumnDefaults`, and `Header`
- [Data](https://www.highcharts.com/docs/grid/frameworks/react/data) for data props and updates
- [Styling](https://www.highcharts.com/docs/grid/frameworks/react/styling) for themes, class names, and Tailwind
- [Next.js](https://www.highcharts.com/docs/grid/frameworks/nextjs) for client-side rendering in Next.js
