---
sidebar_label: "React"
---

# Highcharts Grid with React

Highcharts Grid provides official React integrations for both **Grid Lite** and **Grid Pro**. These packages provide ready-to-use React components that handle the integration with Highcharts Grid, making it easy to add data grids to your React applications.

Two React packages are available:
- **`@highcharts/grid-lite-react`** - React integration for Highcharts Grid Lite
- **`@highcharts/grid-pro-react`** - React integration for Highcharts Grid Pro

To create a Grid with React, please follow the steps below:

## 1. Install the Grid React package
Install the Grid React package of your choice:

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

## 3. Use the component in your application:

### Using Grid Lite:
```tsx
// App.tsx

import { useState } from 'react';
import {
  GridLite,
  type GridOptions
} from '@highcharts/grid-lite-react';

function App() {
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

export default App;
```

### Using Grid Pro:
```tsx
// App.tsx

import { useState } from 'react';
import {
  GridPro,
  type GridOptions
} from '@highcharts/grid-pro-react';

function App() {
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

export default App;
```

## 4. Accessing the Grid instance with refs

You can access the Grid instance programmatically by passing a ref through the `gridRef` prop.

```tsx
// App.tsx

import { useState, useRef } from 'react';
import {
  GridPro,
  type GridOptions,
  type GridInstance,
  type GridRefHandle
} from '@highcharts/grid-pro-react';

function App() {
  const [options] = useState<GridOptions>({
    dataTable: {
      columns: {
        name: ['Alice', 'Bob', 'Charlie', 'David'],
        age: [23, 34, 45, 56],
        city: ['New York', 'Oslo', 'Paris', 'Tokyo']
      }
    }
  });

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

export default App;
```

## 5. Next.js Integration

For Next.js applications, see the dedicated [Next.js integration guide](https://www.highcharts.com/docs/grid/wrappers/grid-with-nextjs.md).
## 6. View the Result

See the live example [here](https://stackblitz.com/edit/highcharts-grid-react-ts-mbvpgi2q).