const dataURL =
    'https://www.highcharts.com/samples/data/' +
    'olympic-female-heights-2024.csv';

// Render the violin plot. The chart configuration is kept at the top so that
// readers meet the actual options first; the data crunching that feeds it
// lives in the helpers below.
function createChart(categories, series) {
    Highcharts.chart('container', {
        chart: {
            type: 'polygon',
            spacingBottom: 30
        },
        accessibility: {
            description:
                'A violin plot showing the height distribution of female ' +
                'athletes at the 2024 Olympics across multiple sports. The ' +
                'plot features a density shape for each sport, overlaid ' +
                'with statistical markers indicating the minimum, first ' +
                'quartile, median, third quartile, and maximum heights.'
        },
        title: {
            text: 'Height distribution of female athletes at the 2024 Olympics'
        },
        xAxis: {
            categories: categories,
            lineWidth: 0,
            // Highlight the hovered category instead of dimming the others
            crosshair: {
                enabled: true
            }
        },
        yAxis: {
            title: {
                text: null
            },
            gridLineDashStyle: 'Dash',
            labels: {
                format: '{value} cm',
                style: {
                    fontSize: '10px'
                }
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
            // Since the polygon series have disabled mouse tracking, the
            // tooltip is only triggered by the boxplot points.
            format: `
                <div class="violin-tooltip">
                    <span class="violin-tooltip-header"
                        style="color: var(--highcharts-color-{point.index})">
                        {point.name}
                    </span>
                    <table class="violin-tooltip-table">
                        <tr>
                            <th>Max:</th>
                            <td>{high:.2f} cm</td>
                        </tr>
                        <tr>
                            <th>Q3:</th>
                            <td>{q3:.2f} cm</td>
                        </tr>
                        <tr class="median-row">
                            <th>Median:</th>
                            <td>{median:.2f} cm</td>
                        </tr>
                        <tr>
                            <th>Q1:</th>
                            <td>{q1:.2f} cm</td>
                        </tr>
                        <tr>
                            <th>Min:</th>
                            <td>{low:.2f} cm</td>
                        </tr>
                    </table>
                </div>
            `,
            shared: true
        },
        plotOptions: {
            series: {
                states: {
                    inactive: {
                        enabled: false
                    }
                }
            },
            polygon: {
                enableMouseTracking: false,
                fillOpacity: 0.5,
                marker: {
                    enabled: false
                },
                lineWidth: 1
            },
            boxplot: {
                pointWidth: 8,
                color: '#333',
                fillColor: '#333',
                medianColor: '#fff',
                borderRadius: 4,
                showInLegend: false
            }
        },
        series
    });
}

// Native math helpers
const mathUtils = {
    quantile: (sortedValues, q) => {
        const pos = (sortedValues.length - 1) * q,
            base = Math.floor(pos),
            rest = pos - base;
        if (sortedValues[base + 1] === undefined) {
            return sortedValues[base];
        }
        return sortedValues[base] +
            rest * (sortedValues[base + 1] - sortedValues[base]);
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

// Generate the kernel density estimate (the violin shape) and the
// five-number summary for each category.
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
        stats.push([
            min,
            mathUtils.quantile(sortedValues, 0.25),
            mathUtils.quantile(sortedValues, 0.50),
            mathUtils.quantile(sortedValues, 0.75),
            max
        ]);
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
            1.06 * mathUtils.stdDev(sortedValues) *
                Math.pow(sortedValues.length, -0.2),
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

    // Normalize the density values. 0.4 is the maximum half-width extending
    // from the center line, so violins in adjacent categories (spaced by 1)
    // keep a 0.2 gap between them.
    const scale = 0.4 / (maxDensity || 1);
    const scaledResults = results.map((series, index) =>
        series.map(point => [
            (point[0] * scale) + index,
            (point[1] * scale) + index
        ])
    );

    return { xiData, results: scaledResults, stats };
}

// Group the parsed CSV by sport, build the series, and render the chart.
function buildChart(columns) {
    const sports = columns[0],
        heights = columns[1],
        groupedData = {};

    for (let i = 1; i < sports.length; i++) {
        const sport = sports[i],
            height = Number(heights[i]);

        if (sport && height) {
            const cleanSport = sport.charAt(0).toUpperCase() + sport.slice(1);
            if (!groupedData[cleanSport]) {
                groupedData[cleanSport] = [];
            }
            groupedData[cleanSport].push(height);
        }
    }

    const categories = Object.keys(groupedData),
        sortedDataArrays = Object.values(groupedData).map(values =>
            values.slice().sort((a, b) => a - b)
        ),
        data = generateViolinData(1, sortedDataArrays),
        xi = data.xiData,
        stats = data.stats;

    // One polygon per sport, tracing the right side up then the left side down
    const polygonSeries = categories.map((sport, i) => {
        const rightSide = xi.map((y, j) => [data.results[i][j][1], y]),
            leftSide = xi.map((y, j) => [data.results[i][j][0], y]).reverse();
        return {
            type: 'polygon',
            name: sport,
            data: [...rightSide, ...leftSide],
            custom: { stat: stats[i] }
        };
    });

    // One boxplot point per sport
    const boxplotSeries = {
        type: 'boxplot',
        name: 'Statistics',
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

    createChart(categories, [...polygonSeries, boxplotSeries]);
}

// Load the local CSV data and parse it with the Data module.
fetch(dataURL)
    .then(response => response.text())
    .then(csv => {
        const parsed = new Highcharts.Data({ csv });
        buildChart(parsed.columns);
    });
