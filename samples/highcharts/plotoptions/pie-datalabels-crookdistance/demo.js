Highcharts.chart('container', {
    chart: {
        borderWidth: 1,
        borderColor: '#eee',
        plotBackgroundColor: null,
        plotBorderWidth: 1,
        plotShadow: false,
        type: 'pie',
        width: 650,
        height: 400,
        spacingLeft: 10 // plotLeft
    },
    title: {
        text: 'Most World Cup Wins By Country (after 2018 tournament)'
    },
    tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b> of all {series.total} cups'
    },
    plotOptions: {
        pie: {
            size: 200,
            center: [300, 150],
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                connectorShape: 'crookedLine',
                crookDistance: '90%',
                alignTo: 'plotEdges',
                format: '<b>{point.name}</b>: {point.y}'
            }
        }
    },
    series: [{
        name: 'Teams',
        colorByPoint: true,
        data: [{
            name: 'Brazil',
            y: 5
        }, {
            name: 'Germany',
            y: 4
        }, {
            name: 'Italy',
            y: 4
        }, {
            name: 'Uruguay',
            y: 2
        }, {
            name: 'Argentina',
            y: 2
        }, {
            name: 'France',
            y: 2
        }, {
            name: 'England',
            y: 1
        }, {
            name: 'Spain',
            y: 1
        }]
    }]
});
