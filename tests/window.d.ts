import type { default as Chart } from '../code/esm/highcharts.src.js';
import type { default as StockChart } from '../code/esm/highstock.src.js';
import type { default as GanttChart } from '../code/esm/highcharts-gantt.src.js';
import type { default as MapsChart } from '../code/esm/highmaps.src.js';

import type GridType from '../ts/Grid/Core/Grid.ts';
import type DashboardsType from '../ts/Dashboards/Board.ts';

type HighchartsType =
    typeof Chart |
    typeof StockChart |
    typeof GanttChart |
    typeof MapsChart;

declare global {
    const Highcharts: HighchartsType;
    const Grid: typeof GridType;
    const Dashboards: typeof DashboardsType;

    interface Window {
        Highcharts: HighchartsType;
        Grid: typeof GridType;
    }
}
