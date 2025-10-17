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
            const point = (tt.chart.hoverPoint as ContourPoint),
                { series, value } = point,
                stops = series.colorAxis?.stops as any,
                extent = (value ?? 0) / ((series.dataMax || 1));

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

            let finalColor;

            if (stops) {
                const lenCap = stops.length - 1;

                finalColor = stops[lenCap].color.rgba;

                for (let i = 1; i < lenCap; i++) {
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

            const [r, g, b] = finalColor ?? lerpVectors(
                [
                    0, 0, 0
                ], [
                    255, 255, 255
                ],
                extent
            );

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
