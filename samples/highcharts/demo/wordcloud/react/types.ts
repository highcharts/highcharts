import type { WordcloudSeriesProps } from '@highcharts/react/series/Wordcloud';

export type WordcloudPoint = Exclude<
    NonNullable<WordcloudSeriesProps['data']>[number],
    unknown[]
> & { weight: number };
