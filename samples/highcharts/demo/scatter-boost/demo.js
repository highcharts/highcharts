// Prepare the data

const data = [],
    n = 1000000;

// Generate and position the datapoints in a tangent wave pattern
for (let i = 0; i < n; i += 1) {
    const theta = Math.random() * 2 * Math.PI;
    const radius = Math.pow(Math.random(), 2) * 100;

    const waveDeviation = (Math.random() - 0.5) * 70;
    const waveValue = Math.tan(theta) * waveDeviation;

    data.push([
        50 + (radius + waveValue) * Math.cos(theta),
        50 + (radius + waveValue) * Math.sin(theta)
    ]);
}

if (!Highcharts.Series.prototype.renderCanvas) {
    throw 'Module not loaded';
}

console.time('scatter');
Highcharts.chart('container', {

    chart: {
        zoomType: 'xy',
        height: '100%'
    },

    boost: {
        useGPUTranslations: true,
        usePreAllocated: true
    },

    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '<{headingTagName}>{chartTitle}</{headingTagName}><div>{chartLongdesc}</div><div>{xAxisDescription}</div><div>{yAxisDescription}</div>'
        }
    },

    xAxis: {
        min: 0,
        max: 100,
        gridLineWidth: 1
    },

    yAxis: {
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
        text: 'Scatter chart with 1 million points'
    },

    legend: {
        enabled: false
    },

    series: [{
        type: 'scatter',
        color: 'rgba(152,0,67,0.1)',
        data: data,
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
