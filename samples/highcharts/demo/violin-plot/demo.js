/* eslint-disable max-len */
const MIN_MAX_COLOR = 'var(--highcharts-neutral-color-100, #000000)',
    QUANTILE_COLOR = '#4169E1',
    MEDIAN_COLOR = '#DC143C';

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

const areaSeries = categories.map((sport, i) => ({
    name: sport,
    data: data.results[i],
    custom: { stat: stats[i] }
}));

const whiskerSeries = categories.map((sport, i) => ({
    type: 'line',
    data: [
        { x: stats[i][0], y: i },
        { x: stats[i][1], y: i },
        { x: stats[i][2], y: i },
        { x: stats[i][3], y: i },
        { x: stats[i][4], y: i }
    ],
    accessibility: { enabled: false }
}));

// Transpose stats for the legend-toggled scatter points.
const scatterData = [[], [], [], [], []];
for (let col = 0; col < 5; col++) {
    for (let line = 0; line < categories.length; line++) {
        scatterData[col].push([stats[line][col], line]);
    }
}

const scatterSeries = [
    { type: 'scatter', name: 'Min', color: MIN_MAX_COLOR, data: scatterData[0] },
    { type: 'scatter', name: 'Q 1', color: QUANTILE_COLOR, data: scatterData[1] },
    {
        type: 'scatter',
        name: 'Median',
        color: MEDIAN_COLOR,
        data: scatterData[2],
        marker: { radius: 5 }
    },
    { type: 'scatter', name: 'Q 3', color: QUANTILE_COLOR, data: scatterData[3] },
    { type: 'scatter', name: 'Max', color: MIN_MAX_COLOR, data: scatterData[4] }
];

Highcharts.chart('container', {
    chart: {
        type: 'areasplinerange',
        inverted: true
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
        reversed: false,
        gridLineWidth: 1,
        gridLineColor: '#E6E6E6',
        gridLineDashStyle: 'Dash',
        labels: {
            format: '{value} cm',
            style: { fontSize: '10px' }
        }
    },
    yAxis: {
        title: { text: null },
        categories: categories,
        min: 0,
        max: categories.length - 1,
        gridLineWidth: 0
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
            states: { hover: { enabled: false } }
        },
        areasplinerange: {
            marker: { enabled: false },
            pointStart: xi[0],
            fillOpacity: 0.5,
            lineWidth: 1,
            showInLegend: false,
            pointInterval: step
        },
        line: {
            marker: { enabled: false },
            showInLegend: false,
            enableMouseTracking: false,
            color: 'var(--highcharts-neutral-color-80, #333333)',
            lineWidth: 1,
            dashStyle: 'shortdot'
        },
        scatter: {
            marker: {
                enabled: true,
                symbol: 'diamond'
            },
            enableMouseTracking: false
        }
    },

    series: [...areaSeries, ...whiskerSeries, ...scatterSeries]
});
