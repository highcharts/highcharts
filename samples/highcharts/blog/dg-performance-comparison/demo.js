Highcharts.chart('container', {
    colors: [
        '#544fc5',
        '#fe6a35'
    ],
    chart: {
        type: 'spline',
        zooming: {
            type: 'xy'
        }
    },
    title: {
        text: 'Chart initial rendering time (lower is better)',
        align: 'left'
    },
    subtitle: {
        text: 'Run on MacBook Pro M1 2021 16GM RAM',
        align: 'left'
    },
    accessibility: {
        point: {
            valueDescriptionFormat:
                '{index}. {xDescription} points, {value} milliseconds.'
        }
    },
    series: [
        {
            name: 'Data Grouping disabled',
            data: [66, 82, 137, 199, 726, 1348]
        },
        {
            name: 'Data Grouping enabled',
            data: [59, 66, 68, 81, 96, 116]
        }
    ],
    xAxis: {
        title: {
            text: 'Sample size'
        },
        labels: {
            format: '{(divide value 1000)}k'
        },
        categories: [10, 1000, 5000, 10000, 50000, 100000]
    },
    tooltip: {
        shared: true,
        headerFormat: `<span style="font-size:11px">
                        Chart loading time for {category:,.0f} points: 
                        </span><br/>`
    },
    yAxis: {
        title: {
            text: 'Time (s)'
        },
        labels: {
            format: '{(divide value 1000)}'
        },
        min: 0
    }
});
