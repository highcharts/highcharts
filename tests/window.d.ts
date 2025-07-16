import type HCType from '../ts/Dashboards/highcharts.d.ts';
import type Options from '../ts/Core/Options.d.ts';

import type GridType from '../ts/Grid/Core/Grid.ts';
import type DashboardsType from '../ts/Dashboards/Board.ts';

type HighchartsType = typeof HCType.Chart & Options;

declare global {
    const Highcharts: HighchartsType;
    const Grid: typeof GridType;
    const Dashboards: typeof DashboardsType;

    interface Window {
        Highcharts: HighchartsType;
        Grid: typeof GridType;
    }
}
