---
sidebar_label: "Next.js"
---

# Highcharts Grid with Next.js
The official React packages work with Next.js but require client-side rendering
since Grid uses browser APIs. This guide shows how to set it up.

## 1. Install the Grid React package
```bash
npm install @highcharts/grid-lite-react
# or
npm install @highcharts/grid-pro-react
```

## 2. Use dynamic import with SSR disabled
The Grid component must be loaded dynamically with `ssr: false` to avoid
"window is not defined" errors during server-side rendering.

```tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { type GridOptions } from '@highcharts/grid-lite-react';

const Grid = dynamic(
    () => import('@highcharts/grid-lite-react').then((mod) => mod.Grid),
    { ssr: false }
);

export default function Page() {
    const [options] = useState<GridOptions>({
        dataTable: {
            columns: {
                name: ['Alice', 'Bob', 'Charlie', 'David'],
                age: [23, 34, 45, 56],
                city: ['New York', 'Oslo', 'Paris', 'Tokyo']
            }
        }
    });

    return <Grid options={options} />;
}
```

For Grid Pro, swap the imports to `@highcharts/grid-pro-react`.

## 3. Access the Grid instance (optional)
Use a ref or callback to access the underlying Grid instance:

```tsx
'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
    type GridInstance,
    type GridOptions,
    type GridRefHandle
} from '@highcharts/grid-lite-react';

const Grid = dynamic(
    () => import('@highcharts/grid-lite-react').then((mod) => mod.Grid),
    { ssr: false }
);

export default function Page() {
    const [options] = useState<GridOptions>({
        dataTable: {
            columns: {
                name: ['Alice', 'Bob', 'Charlie', 'David'],
                age: [23, 34, 45, 56]
            }
        },
        pagination: {
            enabled: true,
            pageSize: 3
        }
    });

    const gridRef = useRef<GridRefHandle<GridOptions> | null>(null);

    const onButtonClick = () => {
        console.log('Grid instance:', gridRef.current?.grid);
    };

    const onGridCallback = (grid: GridInstance<GridOptions>) => {
        console.log('Grid initialized:', grid);
    };

    return (
        <>
            <Grid options={options} ref={gridRef} callback={onGridCallback} />
            <button onClick={onButtonClick}>Access Grid</button>
        </>
    );
}
```

## Important notes

- **`'use client'` directive** - Required on any component that uses Grid
- **Dynamic import** - Always use `next/dynamic` with `{ ssr: false }`
- **CSS auto-loaded** - The React package imports the Grid CSS automatically
- **State for options** - Use `useState` to prevent unnecessary re-renders
