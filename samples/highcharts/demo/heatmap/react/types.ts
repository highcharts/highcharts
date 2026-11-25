import type { Highcharts } from '@highcharts/react';

export type HighchartsWithTemplating = typeof Highcharts & {
    Templating: {
        helpers: Record<
            string,
            (s: string, from: number, length: number) => string
        >;
    };
};
