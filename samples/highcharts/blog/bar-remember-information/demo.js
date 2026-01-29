Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'How much information people will remember after 3 days'
    },
    subtitle: {
        text: 'Source: <a href="http://digitalsplashmedia.com/2012/03/picture-superiority-effect-video-explanation/">digitalsplashmedia.com</a>'
    },
    xAxis: {
        categories: [
            'Oral information',
            'Visual information'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Percentafge of information retention'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><br>',
        pointFormat: '<span style="color:{series.color};padding:0">' +
            '{series.name}: </span>' +
            '<b>{point.y:.1f} %</b>'
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    legend: {
        enabled: false
    },
    series: [{
        name: 'Percentange of retained information',
        data: [10, 65]

    }]
});
