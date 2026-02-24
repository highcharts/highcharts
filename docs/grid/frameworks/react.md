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

The core Grid library is included as a dependency and will be installed
automatically.

### Updating to newer versions
- **Minor and patch updates:** Run `npm update` to get the latest compatible version
- **Major updates:** Install the latest React package which will include the new major version:
  ```bash
  npm install @highcharts/grid-lite-react@latest
  ```

## 2. Render the Grid component
Grid Lite example:

```tsx
import { useState } from 'react';
import { Grid, type GridOptions } from '@highcharts/grid-lite-react';

export default function App() {
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

For Grid Pro, swap the imports to `@highcharts/grid-pro-react` and render
`<Grid options={options} />`.

## 3. Access the Grid instance (optional)
You can access the underlying Grid instance via the `gridRef` prop or a callback:

```tsx
import { useState, useRef } from 'react';
import {
    Grid,
    type GridOptions,
    type GridRefHandle,
    type GridInstance
} from '@highcharts/grid-lite-react';

export default function App() {
    const [options] = useState<GridOptions>({
        data: {
            dataTable: {
                columns: {
                    name: ['Alice', 'Bob', 'Charlie'],
                    age: [23, 34, 45]
                }
            }
        }
    });
    const gridRef = useRef<GridRefHandle<GridOptions> | null>(null);

    const onGridReady = (grid: GridInstance<GridOptions>) => {
        console.log('Grid instance:', grid);
    };

    return <Grid options={options} gridRef={gridRef} callback={onGridReady} />;
}
```

## 4. Updating the Grid
When the options object changes, the Grid component automatically updates. Use
state to manage your options:

```tsx
import { useState } from 'react';
import { Grid, type GridOptions } from '@highcharts/grid-lite-react';

export default function App() {
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

> **Important:** Always store options in `useState` (not a plain object or `useMemo`).
> This ensures the Grid only updates when you explicitly change the state, avoiding
> unnecessary re-renders.

## 5. Next.js
For Next.js applications, see the dedicated [Next.js integration guide](https://www.highcharts.com/docs/grid/frameworks/nextjs).
