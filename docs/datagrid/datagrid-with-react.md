DataGrid with React
===

To create a DataGrid with React please follow the steps below:

## 1. Install the Dashboards package
The Dashboards package contains the DataGrid.
```bash
npm install @highcharts/dashboards
````

## 2. Create a DataGrid React component:

```tsx
// DataGrid.tsx

import { useEffect, useRef } from 'react';
import DG from '@highcharts/dashboards/datagrid';
import '@highcharts/dashboards/css/datagrid.css';

export default function DataGrid(props: { config: DG.Options }) {
    const { config } = props;
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            DG.dataGrid(containerRef.current, config);
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

import DataGrid from "./components/DataGrid";

function App() {

    const config: DataGrid.Options = {
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
            <DataGrid config={config} />
        </div>
    );
}

export default App;
```

See the live example [here](https://stackblitz.com/edit/highcharts-datagrid-react-ts?file=src%2FApp.tsx,src%2Fcomponents%2FDataGrid.tsx).
