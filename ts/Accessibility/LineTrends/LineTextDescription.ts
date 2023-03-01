/* *
 *
 *  (c) 2023 Highsoft AS
 *  Author: Øystein Moseng
 *
 *  Build automatic text descriptions for line charts.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Accessibility from '../Accessibility';
import type Series from '../../Core/Series/Series';
import type Point from '../../Core/Series/Point';

import AST from '../../Core/Renderer/HTML/AST.js';
import U from '../../Core/Utilities.js';
const {
    defined
} = U;
import CU from '../Utils/ChartUtilities.js';
const {
    getAxisDescription,
    getAxisRangeDescription,
    getChartTitle
} = CU;
import HU from '../Utils/HTMLUtilities.js';
const {
    getHeadingTagNameForElement
} = HU;
import SL from './SimplifyLine.js';
const {
    preprocessSimplify,
    simplifyLine
} = SL;
import SD from '../Components/SeriesComponent/SeriesDescriber.js';
const {
    getPointXDescription,
    pointNumberToString
} = SD;


// Is a series a line series?
const isLineSeries = (s: Series): boolean =>
    ['line', 'spline', 'area', 'areaspline'].indexOf(s.type) > -1;

// Get Y value as string
const yFormat = (point: Point): string => {
    const numFormatted = defined(point.y) && pointNumberToString(
        point as Accessibility.PointComposition, point.y
    ) || 'unknown value';

    const series = point.series as Accessibility.SeriesComposition,
        chartOpts = series.chart.options,
        a11yPointOpts = chartOpts.accessibility.point || {},
        seriesA11yPointOpts = series.options.accessibility &&
            series.options.accessibility.point || {},
        tooltipOptions = series.tooltipOptions || {},
        valuePrefix = seriesA11yPointOpts.valuePrefix ||
            a11yPointOpts.valuePrefix ||
            tooltipOptions.valuePrefix ||
            '',
        valueSuffix = seriesA11yPointOpts.valueSuffix ||
            a11yPointOpts.valueSuffix ||
            tooltipOptions.valueSuffix ||
            '';

    return `${valuePrefix}${numFormatted}${valueSuffix}`;
};

// Get the average Y value at X from a line.
const getYAverageAtX = (line: Point[], x: number): number|null => {
    let prev = -1,
        next = -1,
        i = line.length;
    while (i--) {
        const lineX = line[i].x,
            lineY = line[i].y;
        if (defined(lineY)) {
            next = prev;
            prev = i;
            if (lineX === x) {
                return lineY;
            }
            if (lineX < x) {
                break;
            }
        }
    }
    if (prev < 0) {
        return line[0].y ?? null;
    }
    if (next < 0) {
        return line[prev].y as number;
    }
    return (
        (line[prev].y as number) + (line[next].y as number)
    ) / 2;
};


/**
 * Get chart title + subtitle description
 * @private
 */
function getTitleAndSubtitle(
    chart: Accessibility.ChartComposition, headingLevel: number
): string {
    const subtitle = chart.accessibility && chart.accessibility.components
        .infoRegions.getSubtitleText() || '';
    let html = `<h${headingLevel}>${getChartTitle(chart)}</h${headingLevel}>`;
    if (subtitle) {
        html += `<p>${subtitle}</p>`;
    }
    return html;
}


/**
 * Get chart type desc & series desc
 * @private
 */
function getTypeAndSeriesDesc(chart: Accessibility.ChartComposition): string {
    const lineSeries = chart.series.filter(isLineSeries),
        names = lineSeries.map((s): string => s.name),
        numLines = lineSeries.length,
        comboChart = chart.series.length > numLines,
        singleAxis = chart.yAxis.length + chart.xAxis.length < 3,
        xAxis = chart.xAxis[0];

    if (numLines < 1) {
        return '';
    }

    const numDataPoints = lineSeries.reduce((acc, cur): number =>
        acc + cur.points.length, 0);
    let desc = `${comboChart ? 'Combination' : 'Line'} chart with ${numLines} ${
        comboChart ? 'line series' :
            numLines > 1 ? 'lines' : 'line'
    } with ${numDataPoints} data points${numLines > 1 ? ' in total' : ''}`;

    if (singleAxis) {
        const yAxisName = getAxisDescription(chart.yAxis[0]),
            xAxisName = getAxisDescription(xAxis);
        if (numLines > 1) {
            desc += `. The chart compares ${yAxisName} ${xAxis.dateTime ? 'over' : 'for'} ${xAxisName} for `;
        } else {
            desc += `. The chart shows ${yAxisName} ${xAxis.dateTime ? 'over' : 'for'} ${xAxisName}`;
        }
    } else {
        desc += ', showing ';
    }

    if (numLines > 1) {
        desc += names[0];
    }
    if (numLines === 2) {
        desc += ` and ${names[1]}`;
    } else if (numLines === 3) {
        desc += `, ${names[1]} and ${names[2]}`;
    } else if (numLines > 3) {
        desc += `, ${names[1]}, ${names[2]}, and more`;
    }
    desc += '.';

    if (singleAxis) {
        desc += ` ${getAxisRangeDescription(xAxis)}`;
    }

    return desc;
}


/**
 * Get a short overall trend.
 * @private
 */
function getOverallTrend(simplifiedSeries: Point[][]): string {
    let maxTrendIx = -1,
        maxTrend = -Infinity,
        maxEndvalIx = -1,
        maxEndval = -Infinity;

    // Get increase/decrease in % from first point to last for each series
    const trend = simplifiedSeries.map((points, ix): number|null => {
        const first = points[0].y,
            last = points[points.length - 1].y;
        if (!defined(first) || !defined(last)) {
            return null;
        }
        const trend = (last - first) / first * 100;
        if (trend > maxTrend) {
            maxTrend = trend;
            maxTrendIx = ix;
        }
        if (last > maxEndval) {
            maxEndval = last;
            maxEndvalIx = ix;
        }
        return trend;
    });

    if (!trend.length) {
        return '';
    }

    // One series in the chart
    if (trend.length === 1) {
        if (trend[0] === null) {
            return '';
        }
        const line = simplifiedSeries[0],
            name = line[0].series.name,
            firstPoint = yFormat(line[0]),
            lastPoint = yFormat(line[line.length - 1]);
        if (trend[0] === 0) {
            return `${name} starts at ${firstPoint}, and ends at the same value.`;
        }
        const up = trend[0] > 0,
            pct = Math.round(trend[0]),
            slightThreshold = 2;
        return `${name} starts at ${firstPoint}, and ${
            up ? 'increases' : 'decreases'
        } ${
            pct < slightThreshold ? 'slightly ' : ''
        } by ${Math.abs(pct)}% overall, ending at ${lastPoint}.`;
    }

    // Multiple series
    let desc = '';
    const higher = trend.filter((t): boolean => !!t && t > 0).length,
        lower = trend.filter((t): boolean => !!t && t < 0).length;
    if ((higher < 1 || lower < 1) && higher + lower > 1) {
        desc += `All lines end ${lower < 1 ? 'higher' : 'lower'} than they started. `;
    }
    if (maxTrendIx > -1) {
        const highestPct = trend[maxTrendIx],
            steepestLine = simplifiedSeries[maxTrendIx],
            first = yFormat(steepestLine[0]),
            last = yFormat(steepestLine[steepestLine.length - 1]);
        if (highestPct !== null) {
            desc += `${steepestLine[0].series.name} had the ${
                highestPct > 0 ? 'highest increase' : 'smallest drop'
            } of ${Math.abs(Math.round(highestPct))}%, starting at ${first}, and ending at ${last}.`;
        }
    }
    if (maxEndvalIx > -1) {
        const isSameAsHighestTrend = maxEndvalIx === maxTrendIx,
            highestLine = simplifiedSeries[maxEndvalIx];
        desc += ` ${highestLine[0].series.name}${
            isSameAsHighestTrend ? ' also' : ''
        } ended the highest overall`;
        if (!isSameAsHighestTrend) {
            desc += `, at ${yFormat(highestLine[highestLine.length - 1])}`;
        }
        desc += '.';
    }
    return desc;
}


/**
 * Get min/max values for a line.
 * @private
 */
function getMinMaxValueSingle(line: Point[], min: boolean): string {
    const series = line[0].series,
        val = min ? series.dataMin : series.dataMax;
    if (!defined(val)) {
        return 'unknown value';
    }
    const points = line.filter(
        (p): boolean => defined(p.y) && p.y.toFixed(10) === val.toFixed(10)
    );
    let desc = `${yFormat(points[0])}, at `;
    if (points.length > 1) {
        desc += `${points.length} points, including `;
    }
    if (points.length > 0) {
        return `${desc}${getPointXDescription(points[0] as Accessibility.PointComposition)}`;
    }
    return 'unknown value';
}


/**
 * Get min/max values for set of line series.
 * @private
 */
function getMinMaxMultiple(
    simplifiedPoints: Point[][], min: boolean
): string {
    const val = (series: Series): number => (min ?
        series.dataMin || Infinity :
        series.dataMax || -Infinity
    );
    return `${min ? 'Minimum' : 'Maximum'} values are:<ul>${
        simplifiedPoints.slice()
            .sort((a, b): number => (min ?
                val(a[0].series) - val(b[0].series) :
                val(b[0].series) - val(a[0].series)
            ))
            .map((p): string =>
                `<li>${p[0].series.name}: ${getMinMaxValueSingle(p, min)}.</li>`
            ).join(' ')
    }</ul>`;
}


/**
 * Describe the trend of a line.
 * @private
 */
function describeTrend(
    simplifiedPoints: Point[], short: boolean, allPoints?: Point[][]
): string {
    const bridges = ['From there, it', 'It then', 'Then, it', 'Next, it'],
        len = simplifiedPoints.length,
        firstPoint = simplifiedPoints[0],
        lastPoint = simplifiedPoints[len - 1],
        name = firstPoint.series.name,
        x = (i: number): string => getPointXDescription(
            simplifiedPoints[i] as Accessibility.PointComposition),
        y = (i: number): string => yFormat(simplifiedPoints[i]);
    let desc = `${name} starts at ${y(0)}, at ${x(0)}`,
        prevY = firstPoint.y,
        dTrend = 0;

    if (!defined(prevY)) {
        return 'Unknown trend.';
    }

    // Shortened trend description
    if (short) {
        desc += '. From there it ';
        let riseAmount = 0,
            dropAmount = 0;
        for (let i = 1; i < simplifiedPoints.length; ++i) {
            const prev = simplifiedPoints[i - 1],
                cur = simplifiedPoints[i];
            if (!defined(prev.y) || !defined(cur.y)) {
                continue;
            }
            const diff = cur.y - prev.y;
            if (diff > 0) {
                riseAmount += diff;
            } else {
                dropAmount -= diff;
            }
        }
        const ratio = dropAmount === 0 ? Infinity : riseAmount / dropAmount,
            ratioLimit = (n: number): boolean =>
                (ratio > 1 ? ratio < ratio * n : ratio > ratio / n);
        if (ratio > 0.95 && ratio < 1.05) {
            desc += riseAmount > 0 ? 'fluctuates' : 'stays flat';
        } else {
            const [verb, nonverb] = ratio > 1 ?
                ['rises', 'drops'] : ['drops', 'rises'];
            desc += ratioLimit(1.5) ? `${verb} and ${nonverb}, but overall ${verb}` :
                ratioLimit(3) ? `overall ${verb}` :
                    ratioLimit(10) ? `mostly ${verb}` : verb;
        }
        desc += `. It ends at ${y(len - 1)} at ${x(len - 1)}`;

    } else {

        // Not short, describe each movement
        for (let i = 1; i < len; ++i) {
            const currentY = simplifiedPoints[i].y;
            if (!defined(currentY)) {
                continue;
            }
            const final = i === len - 1,
                bridge = final ?
                    'Finally, it' :
                    bridges[(i - 1) % bridges.length];
            dTrend = currentY - (prevY as number);
            desc += `. ${bridge} ${
                dTrend === 0 ? 'stays flat at' :
                    dTrend > 0 ? 'rises to' : 'drops to'
            } ${y(i)} ${final ? 'at' : 'around'} ${x(i)}`;
            prevY = currentY;
        }

        const overallTrend = defined(firstPoint.y) && defined(lastPoint.y) ?
            lastPoint.y - firstPoint.y : null;
        if (overallTrend !== null) {
            desc += `, which is ${
                overallTrend === 0 ? 'at the value' :
                    overallTrend > 0 ? 'higher than' : 'lower than'
            } where it started`;
        }
    }

    // Overall lower or higher?
    if (allPoints && allPoints.length > 1) {
        let i = simplifiedPoints.length,
            isHighest = true,
            isLowest = true;
        while (i-- && (isHighest || isLowest)) {
            const thisY = simplifiedPoints[i].y;
            if (!defined(thisY)) {
                continue;
            }
            let j = allPoints.length;
            while (j-- && (isHighest || isLowest)) {
                const y = getYAverageAtX(allPoints[j], simplifiedPoints[i].x);
                if (allPoints[j] !== simplifiedPoints && defined(y)) {
                    isHighest = isHighest && thisY > y;
                    isLowest = isLowest && thisY < y;
                }
            }
        }
        if (isHighest || isLowest) {
            desc += `. ${name} trends overall ${isHighest ? 'higher' : 'lower'} than the other lines`;
        }
    }

    return `${desc}.`;
}


/**
 * Get min and max description for a single line.
 * @private
 */
function getMinMaxSingle(line: Point[]): string {
    return `Overall, the maximum value is ${
        getMinMaxValueSingle(line, false)
    }. The minimum is ${
        getMinMaxValueSingle(line, true)
    }.`;
}


/**
 * Get trend description for multiple lines.
 * @private
 */
function getMultilineTrends(simplifiedPoints: Point[][]): string {
    return `Overall trends for each line:<ul>${
        simplifiedPoints.map((p): string =>
            `<li>${describeTrend(p, true, simplifiedPoints)}</li>`
        ).join(' ')
    }</ul>`;
}


/**
 * Build and add a text description for a line chart.
 * @private
 */
function addLineChartTextDescription(
    chart: Accessibility.ChartComposition
): void {
    let html = '';
    const rootHLevel = parseInt(
            getHeadingTagNameForElement(chart.renderTo)[1] || '1', 10
        ),
        h2 = 'h' + (rootHLevel + 1),
        infoRegions = chart.accessibility &&
            chart.accessibility.components.infoRegions,
        add = (content?: string, wrapTag?: string): string => (
            html += content ?
                (wrapTag ? `<${wrapTag}>` : '') + content +
                (wrapTag ? `</${wrapTag}>` : '') :
                ''
        );

    const preprocessedSeries = chart.series.filter(isLineSeries)
            .map((s): Point[] => preprocessSimplify(s.points)),
        simplifiedSeries7p = preprocessedSeries
            .map((ps): Point[] => simplifyLine(ps, 7)),
        numLineSeries = preprocessedSeries.length;

    add(getTitleAndSubtitle(chart, rootHLevel));
    add(infoRegions && infoRegions.getLongdescText(), 'p');
    add(getTypeAndSeriesDesc(chart), 'p');
    add(getOverallTrend(simplifiedSeries7p), 'p');

    if (chart.xAxis.length + chart.yAxis.length > 2) {
        add('Axes', h2);
        const axesDesc = infoRegions && infoRegions.getAxesDescription();
        add(axesDesc && axesDesc.xAxis, 'p');
        add(axesDesc && axesDesc.yAxis, 'p');
    }

    if (numLineSeries < 40 && numLineSeries) {
        if (numLineSeries === 1) {
            add('Trend', h2);
            add(describeTrend(simplifiedSeries7p[0], false), 'p');
            add(getMinMaxSingle(preprocessedSeries[0]), 'p');
        } else {
            add('Trends', h2);
            add(getMultilineTrends(simplifiedSeries7p), 'p');
        }

        // Separate min/max section for multiline
        if (numLineSeries > 1) {
            add('Min and max', h2);
            add(getMinMaxMultiple(preprocessedSeries, true), 'p');
            add(getMinMaxMultiple(preprocessedSeries, false), 'p');
        }
    }

    const el = document.createElement('div');
    el.className = 'highcharts-line-description';
    chart.renderTo.parentNode.insertBefore(el, chart.renderTo);
    AST.setElementHTML(el, html);
}


/* *
 *
 *  Default Export
 *
 * */

export default addLineChartTextDescription;
