/* eslint-disable max-len */
const SPORT_COLORS = ['#ffa8d4', '#a8d4ff', '#ffa956', '#46f15f'];
const SPORT_LINE_COLORS = ['#ff7abf', '#7abbff', '#ff8c2b', '#22d63e'];
const MIN_MAX_COLOR = 'var(--highcharts-neutral-color-100, #000000)',
    QUANTILE_COLOR = '#4169E1',
    MEDIAN_COLOR = '#DC143C';

// 1. Grab the local data directly from the HTML block
const athleteCsv = document.getElementById('athlete-data').textContent;

function parseAthleteData(csvText) {
    return csvText.trim().split(/\r?\n/).slice(1).map(line => {
        const [sport, weight] = line.split(',');

        return {
            sport,
            weight: Number(weight)
        };
    });
}

const athleteData = parseAthleteData(athleteCsv);

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

    // Add a little breathing room so the violins do not touch the plot edges.
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

    const scale = 0.4 / (maxDensity || 1);
    const scaledResults = results.map((series, index) =>
        series.map(point => [
            (point[0] * scale) + index,
            (point[1] * scale) + index
        ])
    );

    return { xiData, results: scaledResults, stats: stats };
}

// 2. Parse the data and group it by sport
const groupedData = athleteData.reduce((acc, curr) => {
    const sport = curr.sport.charAt(0).toUpperCase() + curr.sport.slice(1);
    if (!acc[sport]) {
        acc[sport] = [];
    }
    acc[sport].push(curr.weight);
    return acc;
}, {});

const categories = Object.keys(groupedData);
const sortedDataArrays = Object.values(groupedData).map(values =>
    values.slice().sort((a, b) => a - b)
);

// 3. Process Data
const step = 1;
const data = generateViolinData(step, sortedDataArrays);
const xi = data.xiData;
const stats = data.stats;

// 4. Generate Series Arrays Dynamically
const areaSeries = categories.map((sport, i) => ({
    name: sport,
    color: SPORT_COLORS[i],
    lineColor: SPORT_LINE_COLORS[i],
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
    // The scatter markers already expose these statistics, so keep this helper line silent.
    accessibility: { enabled: false }
}));

// Transpose stats for the legend-toggled scatter points
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

// 5. Initialize Chart
Highcharts.chart('container', {
    chart: {
        type: 'areasplinerange',
        inverted: true
    },
    accessibility: {
        description:
            'A violin plot showing the weight distribution of female ' +
            'athletes at the 2012 Olympics across four sports. The plot ' +
            'features a density shape for each sport, overlaid with ' +
            'statistical markers indicating the minimum, first quartile, ' +
            'median, third quartile, and maximum weights.'
    },
    title: {
        text: 'Weight distribution of female athletes at the 2012 Olympics'
    },
    xAxis: {
        reversed: false,
        gridLineWidth: 1,
        gridLineColor: '#E6E6E6',
        gridLineDashStyle: 'Dash',
        labels: {
            format: '{value} kg',
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
        <div>
            <span
                style="font-size: 15px; font-weight: bold; color: ${this.series.color};"
            >
                ${this.series.name}
            </span>
            <table style="margin-top: 8px; border-collapse: collapse; width: 100%;">
                <tr><td style="padding-right: 15px; color: var(--highcharts-neutral-color-60, #666);">Max:</td><td style="font-family: monospace; text-align: right;">${formatValue(stat[4])} kg</td></tr>
                <tr><td style="padding-right: 15px; color: var(--highcharts-neutral-color-60, #666);">Q 3:</td><td style="font-family: monospace; text-align: right;">${formatValue(stat[3])} kg</td></tr>
                <tr><td style="padding-right: 15px; font-weight: bold;">Median:</td><td style="font-family: monospace; text-align: right; font-weight: bold;">${formatValue(stat[2])} kg</td></tr>
                <tr><td style="padding-right: 15px; color: var(--highcharts-neutral-color-60, #666);">Q 1:</td><td style="font-family: monospace; text-align: right;">${formatValue(stat[1])} kg</td></tr>
                <tr><td style="padding-right: 15px; color: var(--highcharts-neutral-color-60, #666);">Min:</td><td style="font-family: monospace; text-align: right;">${formatValue(stat[0])} kg</td></tr>
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
