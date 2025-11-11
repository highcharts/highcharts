import type ContourSeriesOptions from './ContourSeriesOptions';
import ContourPoint from './ContourPoint';

/**
 * A contour plot is a graphical representation of three-dimensional data
 * in two dimensions using contour lines or color-coded regions.
 *
 * @productdesc {highcharts}
 * Requires `modules/contour`.
 *
 * @sample highcharts/demo/contour/
 *         Simple contour
 *
 * @extends      plotOptions.scatter
 * @excluding    animationLimit, cluster, connectEnds, connectNulls,
 *               cropThreshold, dashStyle, dragDrop, findNearestPointBy,
 *               getExtremesFromAll, jitter, legendSymbolColor, linecap,
 *               lineWidth, pointInterval, pointIntervalUnit, pointRange,
 *               pointStart, shadow, softThreshold, stacking, step, threshold,
 *               boostBlending, boostThreshold, crisp, clip, colorIndex,
 *               inactiveOtherPoints, negativeColor, color, turboThreshold,
 *
 *
 * @product      highcharts highmaps
 * @optionparent plotOptions.contour
 */

const ContourSeriesDefaults: ContourSeriesOptions = {
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
''; // Keeps doclets above separate

export default ContourSeriesDefaults;
