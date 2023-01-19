var data = [{
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
}];

Highcharts.chart('container', {
    chart: {
        borderWidth: 1,
        borderColor: '#eee',
        plotBackgroundColor: null,
        plotBorderWidth: 1,
        plotShadow: false,
        type: 'pie',
        width: 400,
        height: 700
    },
    title: {
        text: 'World Cup Wins By Country (after 2018 tournament)'
    },
    tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b> of all {series.total} cups'
    },
    series: [{
        center: [180, 80],
        data: data.slice(), // clone the data
        dataLabels: {
            connectorShape: 'crookedLine',
            crookDistance: '70%'
        }
    }, {
        center: [180, 280],
        data: data.slice(), // clone the data
        dataLabels: {
            connectorShape: 'straight'
        }
    }, {
        center: [180, 480],
        data: data.slice(), // clone the data
        dataLabels: {
            // connectorShape: 'fixedOffset' // default
        }
    }],
    plotOptions: {
        pie: {
            size: '20%',
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.y}',
                alignTo: 'plotEdges'
            }
        }
    }
});
