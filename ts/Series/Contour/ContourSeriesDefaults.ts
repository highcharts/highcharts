import type { PlotOptionsOf } from '../../Core/Series/SeriesOptions';
import type ContourSeries from './ContourSeries';

const ContourSeriesDefaults: PlotOptionsOf<ContourSeries> = {
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
    }
};

export default ContourSeriesDefaults;
