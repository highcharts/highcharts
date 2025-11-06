import type { PlotOptionsOf } from '../../Core/Series/SeriesOptions';
import ContourPoint from './ContourPoint';
import type ContourSeries from './ContourSeries';

const ContourSeriesDefaults: PlotOptionsOf<ContourSeries> = {
    colorKey: 'value',
    marker: {
        symbol: 'cross',
        states: {
            hover: {
                lineColor: 'black',
                fillColor: 'transparent'
            }
        }
    },
    states: {
        hover: {
            halo: void 0
        }
    },
    tooltip: {
        pointFormatter: function (): string {
            const point = (this as ContourPoint),
                { series, value } = point;

            return `<span style="color: ${
                series.colorAxis?.toColor(value ?? 0, point.value as any) ||
                'black'
            };">●●●●●●●●●●●●●●●●●●●●●●●●●●●</span>`;
        }
    }
};

export default ContourSeriesDefaults;
