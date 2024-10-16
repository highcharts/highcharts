DataGrid with React
===

To create a DataGrid with Angular please follow the steps below: <br>

1. Install the Dashboards package, that contains DataGrid

    ```bash
    npm install @highcharts/dashboards
    ````

3. Create a DataGrid React component:

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

4. Use the component in your application:

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
