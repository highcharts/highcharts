import type { default as Chart } from '../code/esm/highcharts.src.js';

import type GridType from '../ts/Grid/Core/Grid.ts';
import type DashboardsType from '../ts/Dashboards/Board.ts';

type HighchartsType = typeof Chart;

declare global {
    const Highcharts: HighchartsType;
    const Grid: typeof GridType;
    const Dashboards: typeof DashboardsType;

    interface Window {
        Highcharts: HighchartsType;
        Grid: typeof GridType;
    }
}
