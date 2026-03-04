---
sidebar_label: "React"
---

# Highcharts Grid with React
To create a Grid with React, please follow the steps below:

## 1. Install the Grid package
Install Grid Lite package with:
```bash
npm install @highcharts/grid-lite
````

## 2. Create a Grid React component:

```tsx
// GridComponent.tsx

import { useEffect, useRef } from 'react';
import Grid from '@highcharts/grid-lite/es-modules/masters/grid-lite.src.js';
import '@highcharts/grid-lite/css/grid-lite.css';

export default function GridComponent(props: { config: Grid.Options }) {
    const { config } = props;
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            Grid.grid(containerRef.current, config);
        }
    }, [config]);

    return (
        <div ref={containerRef} />
    );
}
```

## 3. Use the component in your application:
```tsx
// App.tsx

import GridComponent from "./components/GridComponent";

function App() {
    const config: Grid.Options = {
        dataTable: {
            columns: {
                name: ['Alice', 'Bob', 'Charlie', 'David'],
                age: [23, 34, 45, 56],
                city: ['New York', 'Oslo', 'Paris', 'Tokyo'],
            }
        }
    }

    return (
        <div className="App">
            <GridComponent config={config} />
        </div>
    );
}

export default App;
```

See the live example [here](https://stackblitz.com/edit/highcharts-grid-react-ts-mbvpgi2q).
