import type { PlotOptionsOf } from '../../Core/Series/SeriesOptions';
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
        formatter: function (tt): string {
            const point = (tt.chart.hoverPoint as ContourPoint);
            const series = (point.series as ContourSeries);
            const value = point.value || 1;
            const stops = series.colorAxis?.stops as any;
            const extent = value / ((series.dataMax || 1));

            function lerpVectors(
                [v1A, v1B, v1C]: number[],
                [v2A, v2B, v2C]: number[],
                t: number
            ): number[] {
                const lerpColorDec = (
                    a: number,
                    b: number,
                    t: number
                ): number => (a * (1 - t) + b * t);

                return [
                    lerpColorDec(v1A, v2A, t),
                    lerpColorDec(v1B, v2B, t),
                    lerpColorDec(v1C, v2C, t)
                ];
            }

            let finalColor = lerpVectors(
                [
                    0, 0, 0
                ], [
                    255, 255, 255
                ],
                extent
            );

            if (stops) {

                finalColor = stops[stops.length - 1].color.rgba;

                for (let i = 1; i < (stops as any).length; i++) {
                    if (extent < stops[i][0]) {
                        finalColor = lerpVectors(
                            stops[i - 1].color.rgba,
                            stops[i].color.rgba,
                            extent
                        );
                        break;
                    }
                }
            }

            const [r, g, b] = finalColor;

            return `<span style="color: rgba(${
                r
            },${
                g
            },${
                b
            }, 1);">################</span>`;
        }
    }
};

export default ContourSeriesDefaults;
