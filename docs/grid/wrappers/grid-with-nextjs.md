---
sidebar_label: "Next.js"
---

# Highcharts Grid with Next.js

Highcharts Grid provides official React integrations for both **Grid Lite** and **Grid Pro** that work seamlessly with Next.js applications. These packages provide ready-to-use React components that handle the integration with Highcharts Grid, making it easy to add data grids to your Next.js applications.

Two React packages are available:
- **`@highcharts/grid-lite-react`** - React integration for Highcharts Grid Lite
- **`@highcharts/grid-pro-react`** - React integration for Highcharts Grid Pro

To create a Grid with Next.js, please follow the steps below:

## 1. Install the Grid React package

Install the Grid React package of your choice along with the base Grid package:

For Grid Lite:
```bash
npm install @highcharts/grid-lite-react
```

For Grid Pro:
```bash
npm install @highcharts/grid-pro-react
```

## 2. API Reference

### Component Props

Both `GridLite` and `GridPro` components accept the following props:

- **`options`** (required): Configuration options for the grid. Type: `GridOptions`
- **`gridRef`** (optional): A ref object to access the Grid instance. Type: `ForwardedRef<GridRefHandle<GridOptions>>`
- **`callback`** (optional): A callback function that is called when the grid is initialized. Type: `(grid: GridInstance<GridOptions>) => void`

### TypeScript Support

Both packages export TypeScript types:

```tsx
import type { GridOptions, GridInstance, GridRefHandle } from '@highcharts/grid-lite-react';
// or
import type { GridOptions, GridInstance, GridRefHandle } from '@highcharts/grid-pro-react';
```

## 3. Use the component in your Next.js application

Since Grid components require browser APIs, they need to be rendered on the client side only. Use Next.js dynamic imports with SSR disabled.

### Using Grid Lite:

```tsx
// app/page.tsx

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  type GridOptions
} from '@highcharts/grid-lite-react';

// Dynamically import Grid with SSR disabled
const GridLite = dynamic(
  () => import('@highcharts/grid-lite-react').then((mod) => mod.GridLite),
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

  return <GridLite options={options} />;
}
```

### Using Grid Pro:

```tsx
// app/page.tsx

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  type GridOptions
} from '@highcharts/grid-pro-react';

// Dynamically import Grid with SSR disabled
const GridPro = dynamic(
  () => import('@highcharts/grid-pro-react').then((mod) => mod.GridPro),
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

  return <GridPro options={options} />;
}
```

## 4. Accessing the Grid instance with refs

You can access the Grid instance using a ref to programmatically interact with the grid:

```tsx
// app/page.tsx

'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  type GridOptions,
  type GridInstance,
  type GridRefHandle
} from '@highcharts/grid-pro-react';

// Dynamically import Grid with SSR disabled
const GridPro = dynamic(
  () => import('@highcharts/grid-pro-react').then((mod) => mod.GridPro),
  { ssr: false }
);

export default function Page() {
  
  const grid = useRef<GridRefHandle<GridOptions> | null>(null);

  const onButtonClick = () => {
    console.log('Grid instance:', grid.current?.grid);
  };

  const onGridCallback = (gridInstance: GridInstance<GridOptions>) => {
    console.log('Grid initialized:', gridInstance);
  };

  return (
    <>
      <GridPro options={options} gridRef={grid} callback={onGridCallback} />
      <button onClick={onButtonClick}>Access Grid Instance</button>
    </>
  );
}
```

The same pattern works with `GridLite` as well. The `gridRef` and `callback` props are optional and allow you to access the underlying Grid instance for advanced use cases.

## 5. Important Notes

### Server-Side Rendering (SSR)

- **SSR is disabled**: The Grid components require browser APIs and cannot be rendered on the server. They are dynamically imported with `ssr: false` to ensure client-side only rendering.
- **Client Component**: The page or component using the Grid must be marked with the `'use client'` directive.

### Dynamic Import

Always use Next.js `dynamic` import with `ssr: false` since Grid components require browser APIs that are not available during server-side rendering:

```tsx
const GridLite = dynamic(
  () => import('@highcharts/grid-lite-react').then((mod) => mod.GridLite),
  { ssr: false }
);
```

