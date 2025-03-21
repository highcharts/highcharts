// ============================================================================
// ============================================================================
// Line Descriptions study
// ============================================================================
// ============================================================================
// Line simplification (from 2023 CSUN work)

const defined = n => typeof n !== 'undefined' && n !== null;

/* eslint-disable no-underscore-dangle */

const simplifyXY = {
    virtualWidth: 1000,
    virtualHeight: 500,
    pointGroupThreshold: 2000,

    // Simplify large XY data sets before further processing, by keeping
    // the min and max Y point for each pixel only. Also normalizes the
    // projected coordinates to the virtual XY plane to avoid different
    // results depending on container size.
    normalizePlot(chart, points) {
        const heightFactor = this.virtualHeight / chart.plotHeight,
            widthFactor = this.virtualWidth / chart.plotWidth,
            normalizePoint = p => {
                p._normPlotX = p.plotX * widthFactor;
                p._normPlotY = p.plotY * heightFactor;
                return p;
            };

        if (points.length < 2000) {
            return points.map(normalizePoint);
        }

        const simplified = [],
            len = points.length,
            groupMin = [Infinity, null],
            groupMax = [-Infinity, null],
            addGroup = () => {
                const min = groupMin[1],
                    max = groupMax[1];
                if (min && max) {
                    if (min === max) {
                        simplified.push(min);
                    } else {
                        const minFirst = min.x < max.x;
                        simplified.push(
                            minFirst ? min : max, minFirst ? max : min
                        );
                    }
                }
            };

        let groupX = Infinity;
        for (let i = 0, p, y; i < len; ++i) {
            p = points[i];
            y = p.y;
            const normX = p.plotX !== void 0 ? p.plotX * widthFactor : void 0;
            if (normX !== void 0 && y !== void 0 && y !== null) {
                const x = Math.round(normX);
                if (x !== groupX) {
                    // New group
                    addGroup();
                    groupX = x;
                    groupMin[0] = groupMax[0] = y;
                    groupMin[1] = groupMax[1] = p;
                } else {
                    // Within group
                    if (y > groupMax[0]) {
                        groupMax[0] = y;
                        groupMax[1] = p;
                    }
                    if (y < groupMin[0]) {
                        groupMin[0] = y;
                        groupMin[1] = p;
                    }
                }
            }
        }
        addGroup();
        return simplified.map(normalizePoint);
    },

    // Get simplified array of points, supplying a detail threshold.
    // simplifyFactor is based on the plot area size, and defines how small of a
    // geometric impact a point must have in order to be added.
    //
    // A simplifyFactor of 0.1 removes only small variations.
    // At 0.25, only main trends remain.
    //
    // Based on a modified Visvalingam-Whyatt algorithm, where we are adding the
    // most impactful points rather than subtracting the least impactful ones.
    additiveVisvalingam(normalizedPoints, simplifyFactor) {
        const findInsertionIx = (points, candidateX) => {
                // Binary search for insertion index
                let start = 0,
                    end = points.length - 1;
                while (start <= end) {
                    const mid = Math.floor((start + end) / 2),
                        midX = points[mid].x;
                    if (midX === candidateX) {
                        return mid;
                    }
                    if (midX < candidateX) {
                        start = mid + 1;
                    } else {
                        end = mid - 1;
                    }
                }
                return start;
            },
            // Area if point was added in virtual XY plane
            getAreaForPoint = (point, prev, next) => {
                if (!prev || !next) {
                    return Infinity;
                }
                const { _normPlotX: x1, _normPlotY: y1 } = point,
                    { _normPlotX: x2, _normPlotY: y2 } = prev,
                    { _normPlotX: x3, _normPlotY: y3 } = next;

                if (![x1, x2, x3, y1, y2, y3].every(defined)) {
                    return Infinity;
                }
                return Math.abs(
                    0.5 * (
                        (x1 * (y2 - y3)) +
                        (x2 * (y3 - y1)) +
                        (x3 * (y1 - y2))
                    )
                );
            };

        const candidatePoints = normalizedPoints.filter(p => defined(p.y));

        if (candidatePoints.length < 3) {
            return candidatePoints;
        }

        // Calculate minimum area to add. Max theoretical area times
        // simplifyFactor squared. Squared in order to have more sensitive
        // range at higher detail levels. Max theoretical possible area for
        // a point should be half the virtual plot area.
        const minAreaToAdd = this.virtualWidth * this.virtualHeight / 2 *
            simplifyFactor * simplifyFactor;

        // Always include end points
        const simplified = [
            candidatePoints[0],
            candidatePoints[candidatePoints.length - 1]
        ];
        candidatePoints.shift();
        candidatePoints.pop();

        // Calculate the area for each candidate point as if it was
        // added to the simplified line
        candidatePoints.forEach(cp => {
            cp._avArea = getAreaForPoint(
                cp,
                simplified[0],
                simplified[1]
            );
        });

        // Build up the simplified line by adding points
        while (candidatePoints.length) {
            let i = candidatePoints.length,
                maxArea = 0,
                maxAreaIx = -1;
            while (i--) {
                const candidatePoint = candidatePoints[i],
                    area = candidatePoint._avArea || 0;
                if (area > maxArea && area < Infinity) {
                    maxArea = area;
                    maxAreaIx = i;
                }
            }

            if (maxAreaIx > -1 && maxArea > minAreaToAdd) {
                const addedPoint = candidatePoints[maxAreaIx],
                    insertionIx = findInsertionIx(simplified, addedPoint.x);
                candidatePoints.splice(maxAreaIx, 1);
                simplified.splice(insertionIx, 0, addedPoint);

                // Recalculate area of candidate points between the newly added
                // point’s neighbors.
                const prevSimplified = simplified[insertionIx - 1],
                    nextSimplified = simplified[insertionIx + 1],
                    startX = prevSimplified && prevSimplified.x,
                    endX = nextSimplified && nextSimplified.x;
                let candidateIx = findInsertionIx(candidatePoints, startX),
                    candidatePoint = candidatePoints[candidateIx];
                while (candidatePoint && candidatePoint.x < endX) {
                    const isBeforeInserted = candidatePoint.x < addedPoint.x;
                    candidatePoint._avArea = getAreaForPoint(
                        candidatePoint,
                        isBeforeInserted ? prevSimplified : addedPoint,
                        isBeforeInserted ? addedPoint : nextSimplified
                    );
                    candidatePoint = candidatePoints[++candidateIx];
                }
            } else {
                break;
            }
        }

        return simplified;
    },

    // Simplify points in a line/XY series.
    // Points are first preprocessed for speed, then simplified.
    simplifyLine(series, amount = 0.22) {
        const preprocessed = this.normalizePlot(series.chart, series.points);
        return this.additiveVisvalingam(preprocessed, amount);
    }

};


// ============================================================================
// Populate features

const getChartDescFeatures = chart => {
    const rawData = chart.series.map(s => {
        const preprocessed = simplifyXY.normalizePlot(s.chart, s.points),
            startP = s.points[0],
            endP = s.points[s.points.length - 1],
            // Visual variance & mean, based on plot values.
            // This allows us to judge how chaotic the line is.
            vMean = preprocessed.reduce((sum, p) => p._normPlotY + sum, 0) /
                preprocessed.length,
            vVariance = preprocessed
                .map(p => (p._normPlotY - vMean) * (p._normPlotY - vMean))
                .reduce((sum, n) => sum + n, 0) /
                (preprocessed.length * simplifyXY.virtualHeight),
            lofiData = simplifyXY.additiveVisvalingam(preprocessed, 0.22),
            growthRates = lofiData.map((p, i) => {
                const prev = lofiData[i - 1];
                if (!prev) {
                    return 0;
                }
                // Using normalized coords in the virtual plane
                // This way, we can compare between charts.
                return (prev._normPlotY - p._normPlotY) /
                    (p._normPlotX - prev._normPlotX);
            }),
            { minP, maxP } = preprocessed.reduce((acc, p) => ({
                minP: p.y < acc.minP.y ? p : acc.minP,
                maxP: p.y > acc.maxP.y ? p : acc.maxP
            }), {
                minP: { y: Infinity },
                maxP: { y: -Infinity }
            });
        return {
            name: s.name,
            complexity: lofiData.length,
            growthRates,
            meanGrowthRate: growthRates.reduce((sum, n) => sum + n, 0) /
                growthRates.length,
            maxGrowthRate: growthRates.reduce((max, n) =>
                (Math.abs(n) > Math.abs(max) ? n : max), 0
            ),
            minVal: s.dataMin,
            minX: minP.x,
            maxVal: s.dataMax,
            maxX: maxP.x,
            vVariance,
            startVal: startP.y,
            endVal: endP.y,
            totalDiff: Math.abs(endP.y - startP.y),
            totalVDiff: (startP._normPlotY - endP._normPlotY) /
                simplifyXY.virtualHeight,
            lofiData
        };
    });

    // Whole mean computations & add relative data
    const wmCompute = prop => rawData.reduce((sum, s) => s[prop] + sum, 0) /
            rawData.length,
        wmVVariance = wmCompute('vVariance'),
        wmMeanGrowthRate = wmCompute('meanGrowthRate'),
        wmTotalDiff = wmCompute('totalDiff'),
        wmTotalVDiff = wmCompute('totalVDiff'),
        wmComplexity = wmCompute('complexity');

    return rawData.map(s => ({
        ...s,
        relativeVVariance: s.vVariance / wmVVariance,
        relativeComplexity: s.complexity / wmComplexity,
        relativeMeanGrowthRate: s.meanGrowthRate / wmMeanGrowthRate,
        relativeTotalDiff: s.totalDiff / wmTotalDiff,
        relativeTotalVDiff: s.totalVDiff / wmTotalVDiff
    }));
};


// ============================================================================
// Descriptions


const getLineChartDescription = chart => {
    const features = getChartDescFeatures(chart);
    return features.map(s => {
        const li = (prop, rel) => `<li>${prop}: ${s[prop].toFixed(2)} ${
            rel && chart.series.length > 1 ? '(' +
            s[rel].toFixed(2) + ' relative)' : ''}</li>`;
        return `<p>${s.name}:</p><ul>
            ${li('totalVDiff', 'relativeTotalVDiff')}
            ${li('complexity', 'relativeComplexity')}
            ${li('vVariance', 'relativeVVariance')}
            ${li('meanGrowthRate', 'relativeMeanGrowthRate')}
            ${li('maxGrowthRate')}
            <li>Growth rates:
            ${s.growthRates.map(n => n.toFixed(3)).join(', ')}</li>
        </ul>`;
    }).join(' ');
};


// ============================================================================
// ============================================================================
// Use the functionality.
// Load descriptions & add simplify checkbox for debugging

const simplifyChart = chart => {
    const newSeries = chart.series.map(s => simplifyXY.simplifyLine(s, 0.22));
    chart.series.forEach(
        s => s.update({ visible: false, showInLegend: false }, false)
    );
    newSeries.forEach((points, ix) => {
        const origSeries = chart.series[ix],
            s = chart.addSeries({
                name: origSeries.name,
                color: origSeries.color,
                data: points.map(p => [p.x, p.y]),
                animation: false,
                type: 'line'
            }, false);
        s._isSimplifiedSeries = true;
    });
    chart.redraw();
};

const unsimplifyChart = chart => {
    let i = chart.series.length;
    while (i--) {
        const s = chart.series[i];
        if (s._isSimplifiedSeries) {
            s.remove();
        } else {
            s.update({ visible: true, showInLegend: true }, false);
        }
    }
    chart.redraw();
};

Highcharts.addEvent(Highcharts.Chart, 'load', function () {
    const chart = this;

    // Hide chart
    chart.container.setAttribute('role', 'presentation');
    chart.container.setAttribute('aria-hidden', true);
    chart.renderer.box.setAttribute('role', 'presentation');

    // Create HTML container & run desc
    const descContainer = document.createElement('div');
    descContainer.className = 'hc-a11y-desc-container';
    descContainer.innerHTML = getLineChartDescription(chart);
    chart.renderTo.appendChild(descContainer);

    // Create simplify toggle button
    const simplified = document.createElement('input');
    simplified.type = 'checkbox';
    simplified.className = 'simplified';
    chart.renderTo.insertBefore(simplified, chart.renderTo.firstChild);
    simplified.onchange = function () {
        if (this.checked) {
            simplifyChart(chart);
        } else {
            unsimplifyChart(chart);
        }
    };
});

// Avoid jsfiddle/codepen link in demo
setTimeout(() => ['jsfiddle', 'codepen'].forEach(id => {
    const el = document.getElementById(id);
    return el && (el.style.display = 'none');
}), 10);


// ============================================================================
// Data for sample charts

const data = {
    line1: [{
        name: 'Total revenue',
        data: [15709, 21005, 24563, 15632, 18932, 21356, 24567, 26898],
        pointStart: 2000
    }],
    line2: [{
        name: 'Year-end result',
        data: [90231, 89123, 88912, 89912, 79912, 55912, 35983, 31093],
        pointStart: 1990
    }],
    line3: [{
        name: 'Sensor input',
        data: [250, 90, 40, 10, -5, -1, 6, 20, 60],
        pointStart: -10
    }],
    line4: [{
        name: 'Cadence',
        data: [115, 60, 90, 120, 140, 99, 130, 127, 76, 90, 115],
        pointStart: 2000
    }],
    line5: [{
        name: 'China',
        data: [80, 90, 100, 110, 130, 170, 270, 490, 740],
        pointStart: 2000
    }, {
        name: 'India',
        data: [40, 45, 55, 60, 92, 125, 170, 370, 710],
        pointStart: 2000
    }],
    line6: [{
        name: 'Apples',
        data: [4, 6, 6, 5, 4, 5, 7, 5, 5],
        pointStart: 2000
    }, {
        name: 'Pears',
        data: [7, 6, 3, 3, 1, 2, 5, 2, 3],
        pointStart: 2000
    }, {
        name: 'Lemons',
        data: [1, 0, 0, 1, 0, 2, 0, 0, 1],
        pointStart: 2000
    }, {
        name: 'Bananas',
        data: [3, 2, 3, 5, 6, 7, 6, 5, 6],
        pointStart: 2000
    }, {
        name: 'Grapes',
        data: [2, 3, 4, 3, 4, 5, 4, 5, 3],
        pointStart: 2000
    }, {
        name: 'Oranges',
        data: [17, 18, 19, 17, 20, 15, 13, 14, 12],
        pointStart: 2000
    }],
    line7: [{
        name: 'Immediate',
        data: [105, 66, 93, 121, 151, 94, 111, 147, 76, 85, 125],
        pointStart: 2000
    }, {
        name: 'Average',
        data: [100, 95, 97, 101, 108, 104, 105, 107, 101, 96, 101],
        pointStart: 2000
    }],
    line8: [{
        name: 'Honda',
        data: [100, 95, 92, 98, 99, 101, 105, 85, 75, 91, 105, 101],
        pointStart: 2000
    }, {
        name: 'Lada',
        data: [104, 106, 102, 101, 98, 99, 34, 21, 6, 7, 4, 0],
        pointStart: 2000
    }, {
        name: 'Fiat',
        data: [102, 104, 98, 99, 103, 105, 110, 112, 115, 114, 116, 113],
        pointStart: 2000
    }],
    line9: [{
        name: 'Amazon',
        data: [10, 8, 10, 5, 8, 3, -4, -7, -5, 0, 4, 2, -3, 5],
        pointStart: 2000
    }, {
        name: 'Microsoft',
        data: [7, 9, 6, 5, 4, 3, 4, 6, 5, 10, 9, 6, 4, 7],
        pointStart: 2000
    }, {
        name: 'Apple',
        data: [-2, -4, -1, -5, -3, -2, -5, -4, -5, -3, -6, -3, -2, -7],
        pointStart: 2000
    }],
    line10: [{
        name: 'Signal',
        data: [
            1, 0.5, 0, -0.5, -1, -0.5, 0, 0.5, 1, 0.5, 0, -0.5, -1,
            -0.5, 0, 0.5, 1, 0.5, 0, -0.5, -1, -0.5, 0, 0.5, 1, 0.5, 0,
            -0.5, -1, -0.5, 0, 0.5, 1, 0.5, 0, -0.5, -1
        ]
    }],
    line11: [{
        name: 'Farming',
        data: [98, 95, 98, 99, 100, 101, 97, 99, 84, 89, 98, 101],
        pointStart: 2000
    }, {
        name: 'Steel',
        data: [97, 93, 99, 101, 99, 98, 96, 101, 86, 85, 97, 104],
        pointStart: 2000
    }, {
        name: 'Maritime',
        data: [88, 85, 89, 85, 92, 88, 87, 91, 57, 71, 86, 91],
        pointStart: 2000
    }],
    line12: [{
        name: 'Popularity',
        data: [21, 34, 44, 54, 62, 75, 88, 101, 118, 130]
    }, {
        name: 'Trust',
        data: [30, 34, 32, 34, 32, 35, 38, 30, 31, 30]
    }]
};


// ============================================================================
// ============================================================================
// Dashboard setup ------------------------------------------------------------
// This is straightforward Highcharts config.

const hasForcedColors = matchMedia('(forced-colors: active)').matches;
const hasDarkMode = matchMedia('(prefers-color-scheme: dark)').matches;
const c = (c1, c2, c3) => (hasForcedColors ? c3 : hasDarkMode ? c2 : c1);

Highcharts.setOptions({
    chart: {
        backgroundColor: c('#fff', '#222', 'Canvas')
    },
    colors: ['#3080c0', '#a01040', '#10a040', '#106090'],
    accessibility: {
        enabled: false
    },
    plotOptions: {
        series: {
            dataLabels: {
                style: {
                    color: c('#222', '#eee', 'CanvasText')
                }
            },
            borderColor: c('#fff', '#222', 'Canvas')
        }
    },
    legend: {
        itemStyle: {
            color: c('#333', '#ccc', 'CanvasText')
        },
        itemHoverStyle: {
            cursor: 'unset'
        }
    },
    tooltip: {
        backgroundColor: c('#fff', '#444', 'Canvas'),
        style: {
            color: c('#333', '#eee', 'CanvasText')
        }
    },
    title: {
        align: 'left',
        style: {
            color: c('#222', '#eee', 'CanvasText')
        }
    },
    subtitle: {
        style: {
            color: c('#222', '#eee', 'CanvasText')
        }
    },
    xAxis: {
        labels: {
            style: {
                color: c('#333', '#ccc', 'CanvasText')
            }
        },
        lineColor: c('#333', '#ccc', 'CanvasText'),
        tickColor: c('#333', '#ccc', 'CanvasText')
    },
    yAxis: {
        labels: {
            style: {
                color: c('#333', '#ccc', 'CanvasText')
            }
        },
        title: {
            enabled: false
        },
        lineColor: c('#333', '#ccc', 'CanvasText'),
        tickColor: c('#333', '#ccc', 'CanvasText'),
        gridLineColor: c('#e6e6e6', '#444', 'Canvas')
    },
    credits: {
        enabled: false
    }
});
if (hasForcedColors) {
    Highcharts.setOptions({
        plotOptions: {
            series: {
                dataLabels: {
                    backgroundColor: 'Canvas',
                    style: { textOutline: 'none' }
                }
            }
        }
    });
}

Object.entries(data).forEach(([id, series], i) => Highcharts.chart(id, {
    title: {
        text: 'Chart ' + (i + 1)
    },
    series
}));
