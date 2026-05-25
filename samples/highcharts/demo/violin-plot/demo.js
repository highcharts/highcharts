/* eslint-disable max-len */
// A vibrant, modern palette supporting 7+ disciplines.
const SPORT_COLORS = [
    '#4CAFFE',
    '#544FC5',
    '#00E272',
    '#FE6A35',
    '#6B8ABC',
    '#D568FB',
    '#2EE0CA'
];

// Native Math Helpers
const mathUtils = {
    quantile: (sortedValues, q) => {
        const pos = (sortedValues.length - 1) * q;
        const base = Math.floor(pos);
        const rest = pos - base;
        return sortedValues[base + 1] !== undefined ? sortedValues[base] +
        rest * (sortedValues[base + 1] - sortedValues[base]) : sortedValues[base];
    },
    stdDev: arr => {
        const mean = arr.reduce((a, b) => a + b) / arr.length;
        return Math.sqrt(
            arr.map(x => Math.pow(x - mean, 2))
                .reduce((a, b) => a + b) / arr.length
        );
    },
    gaussian: u => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * u * u)
};

// Generate Violin Data
function generateViolinData(step, sortedDataArrays) {
    let globalMin = Infinity,
        globalMax = -Infinity;

    const stats = [];

    sortedDataArrays.forEach(sortedValues => {
        if (!sortedValues.length) {
            return;
        }
        const min = sortedValues[0],
            max = sortedValues[sortedValues.length - 1];
        if (min < globalMin) {
            globalMin = min;
        }
        if (max > globalMax) {
            globalMax = max;
        }
        stats.push(
            [
                min,
                mathUtils.quantile(sortedValues, 0.25),
                mathUtils.quantile(sortedValues, 0.50),
                mathUtils.quantile(sortedValues, 0.75),
                max
            ]
        );
    });

    // Add a little breathing room so the violins narrow out to 0.
    globalMin = Math.floor(globalMin) - 10;
    globalMax = Math.ceil(globalMax) + 10;

    const xiData = [];
    for (let i = globalMin; i <= globalMax; i += step) {
        xiData.push(i);
    }

    const results = [];
    let maxDensity = 0;

    sortedDataArrays.forEach(sortedValues => {
        if (!sortedValues.length) {
            results.push([]);
            return;
        }
        const bandwidth = Math.max(
            1.06 * mathUtils.stdDev(sortedValues) * Math.pow(sortedValues.length, -0.2),
            step * 2
        );

        const seriesData = [];
        xiData.forEach(x => {
            let sum = 0;
            for (let i = 0; i < sortedValues.length; i++) {
                sum += mathUtils.gaussian((x - sortedValues[i]) / bandwidth);
            }
            const y = (1 / (sortedValues.length * bandwidth)) * sum;
            if (y > maxDensity) {
                maxDensity = y;
            }
            seriesData.push([-y, y]);
        });
        results.push(seriesData);
    });

    // Normalize the density values.
    // 0.4 represents the maximum width extending from the center line.
    // This ensures violins from adjacent categories (spaced by 1) don't overlap,
    // leaving a 0.2 gap between them.
    const scale = 0.4 / (maxDensity || 1);
    const scaledResults = results.map((series, index) =>
        series.map(point => [
            (point[0] * scale) + index,
            (point[1] * scale) + index
        ])
    );

    return { xiData, results: scaledResults, stats: stats };
}

// Grab the local CSV data from the HTML block and parse it with the Data module.
const athleteCsv = document.getElementById('athlete-data').textContent,
    athleteData = new Highcharts.Data({ csv: athleteCsv }),
    sports = athleteData.columns[0],
    heights = athleteData.columns[1],
    groupedData = {};

for (let i = 1; i < sports.length; i++) {
    const sport = sports[i];
    const height = Number(heights[i]);

    if (sport && height) {
        const cleanSport = sport.charAt(0).toUpperCase() + sport.slice(1);
        if (!groupedData[cleanSport]) {
            groupedData[cleanSport] = [];
        }
        groupedData[cleanSport].push(height);
    }
}

const categories = Object.keys(groupedData);
const sortedDataArrays = Object.values(groupedData).map(values =>
    values.slice().sort((a, b) => a - b)
);

const step = 1;
const data = generateViolinData(step, sortedDataArrays);
const xi = data.xiData;
const stats = data.stats;

// Rounded rectangle SVG path for boxplot boxes.
function roundedBoxPath(x, right, q1Plot, q3Plot, r) {
    const minR = Math.min(r, Math.abs(q1Plot - q3Plot) / 2, (right - x) / 2);
    return [
        ['M', x, q3Plot + minR],
        ['L', x, q1Plot - minR],
        ['A', minR, minR, 0, 0, 0, x + minR, q1Plot],
        ['L', right - minR, q1Plot],
        ['A', minR, minR, 0, 0, 0, right, q1Plot - minR],
        ['L', right, q3Plot + minR],
        ['A', minR, minR, 0, 0, 0, right - minR, q3Plot],
        ['L', x + minR, q3Plot],
        ['A', minR, minR, 0, 0, 0, x, q3Plot + minR],
        ['Z']
    ];
}

function setLinkedOpacity(chart, activeIndex) {
    let polygonIndex = -1;
    const bp = chart.series.find(s => s.type === 'boxplot');

    chart.series.forEach(s => {
        if (s.type === 'polygon') {
            polygonIndex++;
            s.group?.attr({ opacity: polygonIndex === activeIndex ? 1 : 0.2 });
        }
    });

    if (bp) {
        bp.points.forEach((p, i) => {
            p.graphic?.attr({ opacity: i === activeIndex ? 1 : 0.2 });
        });
    }
}

function resetLinkedOpacity(chart) {
    chart.series.forEach(s => {
        if (s.type === 'polygon') {
            s.group?.attr({ opacity: 1 });
        }
    });

    const bp = chart.series.find(s => s.type === 'boxplot');
    if (bp) {
        bp.points.forEach(p => p.graphic?.attr({ opacity: 1 }));
    }
}

// Build polygon series: one per sport, tracing right side up then left side down.
const polygonSeries = categories.map((sport, i) => {
    const rightSide = xi.map((y, j) => [data.results[i][j][1], y]);
    const leftSide = xi.map((y, j) => [data.results[i][j][0], y]).reverse();
    return {
        type: 'polygon',
        name: sport,
        data: [...rightSide, ...leftSide],
        custom: { stat: stats[i] },
        events: {
            mouseOver() {
                setLinkedOpacity(this.chart, i);
            },
            mouseOut() {
                resetLinkedOpacity(this.chart);
            }
        }
    };
});

// Build boxplot series: one point per sport.
const boxplotSeries = {
    type: 'boxplot',
    name: 'Statistics',
    showInLegend: false,
    enableMouseTracking: true,
    data: categories.map((sport, i) => ({
        x: i,
        low: stats[i][0],
        q1: stats[i][1],
        median: stats[i][2],
        q3: stats[i][3],
        high: stats[i][4],
        name: sport
    }))
};

Highcharts.chart('container', {
    chart: {
        type: 'polygon',
        events: {
            render() {
                this.series.forEach(s => {
                    if (s.type === 'polygon' && s.area) {
                        s.area.attr({ 'fill-opacity': 0.5 });
                    }
                });

                const bp = this.series.find(s => s.type === 'boxplot');
                if (bp) {
                    bp.points.forEach(point => {
                        if (point.box) {
                            const sa = point.shapeArgs;
                            point.box.attr({
                                d: roundedBoxPath(
                                    sa.x, sa.x + sa.width,
                                    point.q1Plot, point.q3Plot,
                                    4
                                )
                            });
                        }
                    });
                }
            }
        }
    },
    colors: SPORT_COLORS,
    accessibility: {
        description:
            'A violin plot showing the height distribution of female ' +
            'athletes at the 2024 Olympics across multiple sports. The plot ' +
            'features a density shape for each sport, overlaid with ' +
            'statistical markers indicating the minimum, first quartile, ' +
            'median, third quartile, and maximum heights.'
    },
    title: {
        text: 'Height distribution of female athletes at the 2024 Olympics'
    },
    xAxis: {
        categories: categories,
        lineWidth: 0
    },
    yAxis: {
        title: { text: null },
        gridLineWidth: 1,
        gridLineColor: '#E6E6E6',
        gridLineDashStyle: 'Dash',
        labels: {
            format: '{value} cm',
            style: { fontSize: '10px' }
        },
        startOnTick: false,
        endOnTick: false
    },
    legend: {
        enabled: false
    },
    tooltip: {
        useHTML: true,
        padding: 12,
        formatter: function () {
            const custom = this.series.options.custom || {};
            const stat = custom.stat;

            if (!stat) {
                return false;
            }

            const formatValue = value => Highcharts.numberFormat(value, 2);
            return `
                    <div class="violin-tooltip">
                        <span class="violin-tooltip-header" style="color: ${this.series.color};">
                            ${this.series.name}
                        </span>
                        <table class="violin-tooltip-table">
                            <tr><td class="violin-tooltip-label">Max:</td><td class="violin-tooltip-value">${formatValue(stat[4])} cm</td></tr>
                            <tr><td class="violin-tooltip-label">Q 3:</td><td class="violin-tooltip-value">${formatValue(stat[3])} cm</td></tr>
                            <tr><td class="violin-tooltip-label median-row">Median:</td><td class="violin-tooltip-value median-row">${formatValue(stat[2])} cm</td></tr>
                            <tr><td class="violin-tooltip-label">Q 1:</td><td class="violin-tooltip-value">${formatValue(stat[1])} cm</td></tr>
                            <tr><td class="violin-tooltip-label">Min:</td><td class="violin-tooltip-value">${formatValue(stat[0])} cm</td></tr>
                        </table>
                    </div>
                `;
        }
    },
    plotOptions: {
        series: {
            states: {
                hover: { enabled: false }
            }
        },
        polygon: {
            marker: { enabled: false },
            lineWidth: 1
        },
        boxplot: {
            pointWidth: 8,
            whiskerLength: '50%',
            color: '#333',
            fillColor: '#333',
            medianColor: '#fff',
            enableMouseTracking: true,
            point: {
                events: {
                    mouseOver() {
                        setLinkedOpacity(this.series.chart, this.x);
                    },
                    mouseOut() {
                        resetLinkedOpacity(this.series.chart);
                    }
                }
            },
            states: {
                inactive: { enabled: false }
            }
        }
    },

    series: [...polygonSeries, boxplotSeries]
});
