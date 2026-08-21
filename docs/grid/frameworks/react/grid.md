---
sidebar_label: "Grid"
---

# Grid

`Grid` creates the instance, applies the configuration, and destroys it on
unmount. Import it from `@highcharts/grid-lite-react` or
`@highcharts/grid-pro-react`. Configure it with components, the `options`
object, or both. First examples are in
[Getting started](https://www.highcharts.com/docs/grid/frameworks/react/getting-started).

## Options

The `options` prop takes the same Grid
[configuration object](https://api.highcharts.com/grid/) as Core. A first
example is in
[Getting started](https://www.highcharts.com/docs/grid/frameworks/react/getting-started).

Type the object as `GridOptions` and store it in `useState` (not a plain
object or `useMemo`) so the grid updates only when that state changes.

```tsx
const [options] = useState<GridOptions>({ /* ... */ });

return <Grid options={options} />;
```

<!-- Sample placeholder: grid/react/grid-options
<iframe src="" allow="fullscreen"></iframe>
-->

## Combining components and options

`Grid` accepts components and `options` at the same time. They are merged, and
`options` overrides the same key.

```tsx
const [options] = useState<GridOptions>({
    rendering: {
        rows: {
            virtualization: true
        }
    }
});

return (
    <Grid options={options}>
        <Data columns={columns} />
        <Column columnId="name" headerFormat="Name" />
    </Grid>
);
```

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `options` | `GridOptions` | Grid configuration object. See the [Grid API](https://api.highcharts.com/grid/). |
| `className` | `string` | Class names on the React mount container (parent of `.hcg-container`). Not passed into Grid options. |
| `tableClassName` | `string` | Class names on `.hcg-table`. Maps to `rendering.table.className`. |
| `theme` | `string` | Theme class passed as `rendering.theme`. Omitted uses the default theme (`hcg-theme-default`). An empty string (`""`) skips that default. |
| `gridRef` | `Ref<GridRefHandle>` | Ref to the underlying Grid instance. |
| `callback` | `(grid: GridInstance) => void` | Called once when the grid has been initialized. |
| `gridKey` | `string` | Grid Pro license key. Required for `@highcharts/grid-pro-react`. |

Grid Pro also accepts event props such as `onAfterLoad`. See
[events](https://www.highcharts.com/docs/grid/events). Class names and themes
are in [Styling](https://www.highcharts.com/docs/grid/frameworks/react/styling).

## Grid instance

The `gridRef` and `callback` expose the instance. Update through React props and
state instead of `grid.update()`. For data changes, see
[Data](https://www.highcharts.com/docs/grid/frameworks/react/data).

```tsx
import { useRef, useState } from 'react';
import {
    Grid,
    type GridRefHandle,
    type GridOptions,
    type GridInstance
} from '@highcharts/grid-lite-react';

export default function App() {
    const gridRef = useRef<GridRefHandle<GridOptions> | null>(null);
    const [options] = useState<GridOptions>({
        data: {
            columns: {
                name: ['Alice', 'Bob'],
                age: [23, 34]
            }
        }
    });

    return (
        <Grid
            options={options}
            gridRef={gridRef}
            callback={(grid: GridInstance<GridOptions>) => {
                console.log('Grid instance:', grid);
            }}
        />
    );
}
```

## Grid Pro

Import `Grid` from `@highcharts/grid-pro-react`. The `gridKey` prop is
required by the license. Components and `options` work the same as in Grid
Lite.

```tsx
import { Grid, Data } from '@highcharts/grid-pro-react';

export default function App() {
    return (
        <Grid gridKey="your-license-key">
            <Data columns={{ name: ['Alice', 'Bob'], age: [23, 34] }} />
        </Grid>
    );
}
```
