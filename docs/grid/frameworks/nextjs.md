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

The core Grid library is included as a dependency and will be installed
automatically.

### Updating to newer versions
- **Minor and patch updates:** Run `npm update` to get the latest compatible version
- **Major updates:** Install the latest React package which will include the new major version:
  ```bash
  npm install @highcharts/grid-lite-react@latest
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
        data: {
            dataTable: {
                columns: {
                    name: ['Alice', 'Bob', 'Charlie', 'David'],
                    age: [23, 34, 45, 56],
                    city: ['New York', 'Oslo', 'Paris', 'Tokyo']
                }
            }
        }
    });

    return <Grid options={options} />;
}
```

For Grid Pro, swap the imports to `@highcharts/grid-pro-react`.

## 3. Access the Grid instance (optional)
Use the `gridRef` prop or a callback to access the underlying Grid instance:

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
        data: {
            dataTable: {
                columns: {
                    name: ['Alice', 'Bob', 'Charlie', 'David'],
                    age: [23, 34, 45, 56]
                }
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
            <Grid options={options} gridRef={gridRef} callback={onGridCallback} />
            <button onClick={onButtonClick}>Access Grid</button>
        </>
    );
}
```

## 4. Updating the Grid
When the options object changes, the Grid component automatically updates. Use
state to manage your options:

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
    const [options, setOptions] = useState<GridOptions>({
        data: {
            dataTable: {
                columns: {
                    name: ['Alice', 'Bob'],
                    age: [23, 34]
                }
            }
        }
    });

    const loadNewData = () => {
        setOptions({
            data: {
                dataTable: {
                    columns: {
                        name: ['Charlie', 'Diana', 'Eve'],
                        age: [45, 56, 67]
                    }
                }
            }
        });
    };

    return (
        <>
            <Grid options={options} />
            <button onClick={loadNewData}>Load new data</button>
        </>
    );
}
```

## Important notes

- **`'use client'` directive** - Required on any component that uses Grid
- **Dynamic import** - Always use `next/dynamic` with `{ ssr: false }`
- **CSS auto-loaded** - The React package imports the Grid CSS automatically
- **State for options** - Always store options in `useState` to ensure the Grid only updates when you explicitly change the state
