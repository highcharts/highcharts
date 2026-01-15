---
sidebar_label: "React"
---

# Highcharts Grid with React
Use the official React package for Grid Lite or Grid Pro. It is a self-contained
component package that handles grid setup/cleanup and loads the Grid CSS for you.
Requires React 18 or higher.

## 1. Install the Grid React package
```bash
npm install @highcharts/grid-lite-react
# or
npm install @highcharts/grid-pro-react
```

Feature updates land in the core Grid package (`@highcharts/grid-lite` or
`@highcharts/grid-pro`). The React package is the integration layer, so update
the core Grid package to get the latest features.

## 2. Render the Grid component
Grid Lite example:

```tsx
import { GridLite, type GridOptions } from '@highcharts/grid-lite-react';

export default function App() {
    const options: GridOptions = {
        dataTable: {
            columns: {
                name: ['Alice', 'Bob', 'Charlie', 'David'],
                age: [23, 34, 45, 56],
                city: ['New York', 'Oslo', 'Paris', 'Tokyo'],
            }
        }
    };

    return <GridLite options={options} />;
}
```

For Grid Pro, swap the imports to `@highcharts/grid-pro-react` and render
`<GridPro options={options} />`.

## 3. Access the Grid instance (optional)
You can access the underlying Grid instance via a ref or callback:

```tsx
import { useRef } from 'react';
import {
    GridLite,
    type GridOptions,
    type GridRefHandle,
    type GridInstance
} from '@highcharts/grid-lite-react';

export default function App() {
    const gridRef = useRef<GridRefHandle<GridOptions> | null>(null);
    const options: GridOptions = {
        dataTable: {
            columns: {
                name: ['Alice', 'Bob', 'Charlie'],
                age: [23, 34, 45]
            }
        }
    };

    const onGridReady = (grid: GridInstance<GridOptions>) => {
        console.log('Grid instance:', grid);
    };

    return <GridLite options={options} gridRef={gridRef} callback={onGridReady} />;
}
```

## 4. Next.js (client-side only)
Grid uses browser APIs, so disable SSR:

```tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { type GridOptions } from '@highcharts/grid-lite-react';

const GridLite = dynamic(
    () => import('@highcharts/grid-lite-react').then((mod) => mod.GridLite),
    { ssr: false }
);

export default function Page() {
    const [options] = useState<GridOptions>({
        dataTable: {
            columns: {
                name: ['Alice', 'Bob', 'Charlie'],
                age: [23, 34, 45]
            }
        }
    });

    return <GridLite options={options} />;
}
```
