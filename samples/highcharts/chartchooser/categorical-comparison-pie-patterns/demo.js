const color = [{
    pattern: {
        ...Highcharts.patterns[1],
        color: "#1493ff"
    }
}, {
    pattern: {
        ...Highcharts.patterns[5],
        color: "#71BF45"
    }
},
'#FFA500'];
Highcharts.chart('container', {
    chart: {
        type: 'pie'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    title: {
        text: 'Earth&#39;s Water Supply'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true
            },
            showInLegend: true
        }
    },
    series: [{
        name: null,
        colorByPoint: true,
        data: [{
            name: 'Salt water',
            y: 97,
            color: color[0]
        }, {
            name: 'Ice',
            y: 2,
            color: color[1]
        }, {
            name: 'Fresh water',
            sliced: true,
            selected: true,
            y: 1,
            color: color[2]
        }]
    }]
});