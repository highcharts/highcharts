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
