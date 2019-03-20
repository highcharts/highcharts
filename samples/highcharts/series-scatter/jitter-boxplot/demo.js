// Generate test data with continuous Y values.
function getExperimentData() {
    var data = [],
        off = 0.3 + 0.2 * Math.random(),
        i;
    for (i = 0; i < 200; i++) {
        data.push(
            Math.round(1000 * (off + (Math.random() - 0.5) * (Math.random() - 0.5)))
        );
    }
    return data;
}

function getBoxPlotData(values) {
    var sorted = values.sort(function (a, b) {
        return a - b;
    });

    return {
        low: sorted[0],
        q1: sorted[Math.round(values.length * 0.25)],
        median: sorted[Math.round(values.length * 0.5)],
        q3: sorted[Math.round(values.length * 0.75)],
        high: sorted[sorted.length - 1]
    };
}

var experiments = [
    getExperimentData(),
    getExperimentData(),
    getExperimentData(),
    getExperimentData(),
    getExperimentData()
];

var scatterData = experiments
    .reduce(function (acc, data, x) {
        return acc.concat(data.map(function (value) {
            return [x, value];
        }));
    }, []);

var boxplotData = experiments
    .map(getBoxPlotData);

Highcharts.chart('container', {

    title: {
        text: 'Highcharts Box Plot and Jittered Scatter Plot'
    },

    legend: {
        enabled: false
    },

    xAxis: {
        categories: ['1', '2', '3', '4', '5'],
        title: {
            text: 'Experiment No.'
        }
    },

    yAxis: {
        title: {
            text: 'Observations'
        }
    },

    series: [{
        type: 'boxplot',
        name: 'Summary',
        data: boxplotData,
        tooltip: {
            headerFormat: '<em>Experiment No {point.key}</em><br/>'
        }
    }, {
        name: 'Observation',
        type: 'scatter',
        data: scatterData,
        jitter: {
            x: 0.24 // Exact fit for box plot's groupPadding and pointPadding
        },
        marker: {
            radius: 1
        },
        color: 'rgba(100, 100, 100, 0.5)',
        tooltip: {
            pointFormat: 'Value: {point.y}'
        }
    }]
});