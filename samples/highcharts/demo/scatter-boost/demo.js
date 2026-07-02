// Prepare the data

function getDataTableOptions(n) {
    const xColumn = new Float64Array(n),
        yColumn = new Float64Array(n);

    // Generate and position the datapoints in a tangent wave pattern
    for (let i = 0; i < n; i += 1) {
        const theta = Math.random() * 2 * Math.PI;
        const radius = Math.pow(Math.random(), 2) * 100;

        const waveDeviation = (Math.random() - 0.5) * 70;
        const waveValue = Math.tan(theta) * waveDeviation;

        xColumn[i] = 50 + (radius + waveValue) * Math.cos(theta);
        yColumn[i] = 50 + (radius + waveValue) * Math.sin(theta);
    }

    return {
        columns: {
            x: xColumn,
            y: yColumn
        }
    };
}

const dataTable = getDataTableOptions(1000000);

if (!Highcharts.Series.prototype.renderCanvas) {
    throw 'Module not loaded';
}

console.time('scatter');
Highcharts.chart('container', {

    dataTable,

    chart: {
        zooming: {
            type: 'xy'
        },
        height: '100%'
    },

    boost: {
        useGPUTranslations: true,
        usePreAllocated: true
    },

    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '<{headingTagName}>' +
                '{chartTitle}</{headingTagName}><div>{chartLongdesc}</div>' +
                '<div>{xAxisDescription}</div><div>{yAxisDescription}</div>'
        }
    },

    xAxis: {
        min: 0,
        max: 100,
        gridLineWidth: 1,
        tickWidth: 0
    },

    yAxis: {
        lineWidth: 1,
        // Renders faster when we don't have to compute min and max
        min: 0,
        max: 100,
        minPadding: 0,
        maxPadding: 0,
        title: {
            text: null
        }
    },

    title: {
        text: 'Scatter chart with 1 million points',
        align: 'left'
    },

    legend: {
        enabled: false
    },

    series: [{
        type: 'scatter',
        color: 'rgba(222, 73, 138, 0.1)',
        marker: {
            radius: 0.5
        },
        tooltip: {
            followPointer: false,
            pointFormat: '[{point.x:.1f}, {point.y:.1f}]'
        }
    }]

});
console.timeEnd('scatter');
