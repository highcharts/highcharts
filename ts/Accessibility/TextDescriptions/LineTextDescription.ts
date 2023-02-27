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
    defined,
    pick
} = U;
import CU from '../Utils/ChartUtilities.js';
const {
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
    getPointXDescription
} = SD;


// Is a series a line series?
const isLineSeries = (s: Series): boolean =>
    ['line', 'spline', 'area', 'areaspline'].indexOf(s.type) > -1;


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
        comboChart = chart.series.length > numLines;

    if (numLines < 1) {
        return '';
    }

    let desc = `${comboChart ? 'Combination' : 'Line'} chart with ${numLines} ${
        comboChart ? 'line series' :
            numLines > 1 ? 'lines' : `line with ${lineSeries[0].points.length} data points`
    }, showing `;

    if (numLines > 0) {
        desc += names[0];
    }
    if (numLines === 2) {
        desc += ` and ${names[1]}`;
    } else if (numLines === 3) {
        desc += `, ${names[1]} and ${names[2]}`;
    } else if (numLines > 3) {
        desc += `, ${names[1]}, ${names[2]}, and more`;
    }

    return desc + '.';
}


/**
 * Get a short overall trend.
 * @private
 */
function getOverallTrend(simplifiedSeries: Point[][]): string {
    let maxIx = -1,
        maxTrend = -Infinity;
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
            maxIx = ix;
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
        if (trend[0] === 0) {
            return 'The chart ends at the same value as it started on.';
        }
        const up = trend[0] > 0,
            pct = Math.round(trend[0]),
            slightThreshold = 2;
        return `The chart ends ${
            pct < slightThreshold ? 'slightly ' : ''
        }${
            up ? 'higher' : 'lower'
        }, at around ${pct + 100}% of where it started.`;
    }

    // Multiple series
    let desc = '';
    const higher = trend.filter((t): boolean => !!t && t > 0).length,
        lower = trend.filter((t): boolean => !!t && t < 0).length;
    if ((higher < 1 || lower < 1) && higher + lower > 1) {
        desc += `All lines end ${lower < 1 ? 'higher' : 'lower'} than they started. `;
    }
    if (maxIx > -1) {
        const highestPct = trend[maxIx],
            highestSeries = simplifiedSeries[maxIx][0].series.name;
        if (highestPct !== null) {
            desc += `${highestSeries} had the ${
                highestPct > 0 ? 'highest increase' : 'smallest drop'
            }, ending at around ${
                Math.round(highestPct + 100)
            }% of where it started.`;
        }
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
    let desc = `${val}, at `;
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
    return `${min ? 'Minimum' : 'Maximum'} values are:<ul>${
        simplifiedPoints.map((p): string =>
            `<li>${p[0].series.name}: ${getMinMaxValueSingle(p, min)}.</li>`
        ).join(' ')
    }</ul>`;
}


/**
 * Describe the trend of a line.
 * @private
 */
function describeTrend(simplifiedPoints: Point[], short: boolean): string {
    const bridges = ['From there, it', 'It then', 'Then, it', 'Next, it'],
        len = simplifiedPoints.length,
        firstPoint = simplifiedPoints[0],
        lastPoint = simplifiedPoints[len - 1],
        name = firstPoint.series.name,
        x = (i: number): string => getPointXDescription(
            simplifiedPoints[i] as Accessibility.PointComposition),
        y = (i: number): string =>
            '' + pick(simplifiedPoints[i].y, 'unknown value');
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
            const verb = ratio > 1 ? 'rises' : 'drops';
            desc += ratioLimit(1.5) ? `has dips and rises, but overall ${verb}` :
                ratioLimit(3) ? `overall ${verb}` :
                    ratioLimit(10) ? `mostly ${verb}` : verb;
        }
        return `${desc}. It ends at ${y(len - 1)} at ${x(len - 1)}.`;
    }

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
            `<li>${describeTrend(p, true)}</li>`
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
            getHeadingTagNameForElement(chart.container)[1] || '1', 10
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

    add('Axes', h2);
    const axesDesc = infoRegions && infoRegions.getAxesDescription();
    add(axesDesc && axesDesc.xAxis, 'p');
    add(axesDesc && axesDesc.yAxis, 'p');

    if (numLineSeries < 40 && numLineSeries) {
        add('Trends', h2);
        if (numLineSeries === 1) {
            add(describeTrend(simplifiedSeries7p[0], false), 'p');
            add(getMinMaxSingle(preprocessedSeries[0]), 'p');
        } else {
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
