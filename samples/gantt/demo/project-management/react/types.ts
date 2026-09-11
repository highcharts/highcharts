import type Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';
import type { GanttSeriesProps } from '@highcharts/react/series/Gantt';

export type GanttTaskPoint = NonNullable<GanttSeriesProps['data']>[number] & {
    owner?: string;
    pointWidth?: number;
    dataLabels?: {
        align?: string;
        format?: string;
        style?: {
            color?: string;
            fontWeight?: string;
            textOutline?: string;
            opacity?: number;
        };
        x?: number;
    };
};

export type GanttPoint = Highcharts.Point & {
    completed?: { amount?: number } | number;
    dependency?: string;
    milestone?: boolean;
    owner?: string;
    yCategory?: string;
    x2?: number;
};
