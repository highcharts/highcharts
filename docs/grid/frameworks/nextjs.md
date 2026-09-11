---
sidebar_label: "Next.js"
---

# Highcharts Grid with Next.js
The official React packages work with Next.js but require client-side rendering
since Grid uses browser APIs. This guide covers that setup. Configure the grid
with `options` or with components, the same as in
[Getting started](https://www.highcharts.com/docs/grid/frameworks/react/getting-started).

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
"window is not defined" errors during server-side rendering. A type-only
`GridOptions` import is safe in this file; `Grid` is loaded on the client:

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

`Data`, `Column`, and the other components are value imports, so they cannot
sit in a Server Component. Put that grid in a client module and load the
module with `ssr: false`. The markup inside the client file is the same as in
[Getting started](https://www.highcharts.com/docs/grid/frameworks/react/getting-started).

```tsx
import dynamic from 'next/dynamic';

const TeamGrid = dynamic(() => import('./team-grid'), { ssr: false });

export default function Page() {
    return <TeamGrid />;
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
            <Grid options={options} gridRef={gridRef} callback={onGridCallback} />
            <button onClick={onButtonClick}>Access Grid</button>
        </>
    );
}
```

The same `gridRef` and `callback` props work when the grid is configured with
components. See
[Grid](https://www.highcharts.com/docs/grid/frameworks/react/grid#grid-instance).

## 4. Updating the Grid
When `options` change, the Grid component updates. Store that object in
`useState` so the grid updates only when you change the state:

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
            columns: {
                name: ['Alice', 'Bob'],
                age: [23, 34]
            }
        }
    });

    const loadNewData = () => {
        setOptions({
            data: {
                columns: {
                    name: ['Charlie', 'Diana', 'Eve'],
                    age: [45, 56, 67]
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

With components, keep the row data in state and pass it to `Data`. See
[Data](https://www.highcharts.com/docs/grid/frameworks/react/data).

See the [live Grid Lite example](https://stackblitz.com/edit/highcharts-grid-lite-integration-demo-nextjs).
See the [live Grid Pro example](https://stackblitz.com/edit/highcharts-grid-pro-integration-demo-nextjs).

## Important notes

- **`'use client'` directive** - Required on any component that uses Grid
- **Dynamic import** - Always use `next/dynamic` with `{ ssr: false }`
- **CSS auto-loaded** - The React package imports the Grid CSS automatically
- **State** - Store `options` in `useState`. For components, keep changing
  data in state too. See
  [Grid](https://www.highcharts.com/docs/grid/frameworks/react/grid) and
  [Data](https://www.highcharts.com/docs/grid/frameworks/react/data).
