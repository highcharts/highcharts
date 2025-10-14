import { GradientColorStop } from '../../Core/Color/GradientColor';
import type { PlotOptionsOf } from '../../Core/Series/SeriesOptions';
import Tooltip from '../../Core/Tooltip';
import ContourPoint from './ContourPoint';
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
    },
    tooltip: {
        formatter: function (tt: Tooltip): string {
            const point = (tt.chart.hoverPoint as ContourPoint);
            const series = (point.series as ContourSeries);
            const value = point.value || 0;
            // Should be refactored to class prop, updated with data
            const MAXVAL = ((): number => {
                let maxVal = 0;
                for (const p of series.points) {

                    if ((p.value || 0) > maxVal) {
                        maxVal = p.value || 0;
                    }
                }
                return maxVal;
            })();
            const normVal = value / MAXVAL;
            const stops = series.colorAxis?.stops ?
                series.colorAxis.stops.map(
                    (
                        stop: GradientColorStop
                    ): number[] => series.colorToArray(stop[1])
                ) : [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1]
                ];
            function lerpVectors(
                v1: number[],
                v2: number[],
                t: number
            ): number[] {
                const [v1A, v1B, v1C] = v1;
                const [v2A, v2B, v2C] = v2;
                const lerpColorDec = (
                    a: number,
                    b: number,
                    t: number
                ): number => 255 * (a * (1 - t) + b * t);

                return [
                    lerpColorDec(v1A, v2A, t),
                    lerpColorDec(v1B, v2B, t),
                    lerpColorDec(v1C, v2C, t)
                ];
            }

            let color = [1, 0, 1];
            for (let i = 0; i < 1; i++) {
                if (normVal < stops[i + 1][0]) {
                    const t = (
                        (normVal - stops[i][0]) /
                        (stops[i + 1][0] - stops[i][0])
                    );
                    color = lerpVectors(
                        stops[i].slice(1),
                        stops[i + 1].slice(1),
                        t
                    );
                }
            }

            return `<span style="color: rgb(${
                color[0]
            }, ${
                color[1]
            }, ${
                color[2]
            });"> ● </span> Val: ${value}`;
        }
    }
};

export default ContourSeriesDefaults;
