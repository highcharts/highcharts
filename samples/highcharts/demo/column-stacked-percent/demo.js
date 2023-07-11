// // Data retrieved from: https://www.ssb.no/transport-og-reiseliv/landtransport/statistikk/innenlandsk-transport
Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Domestic passenger transport, by mode of transport, in Norway 2019-2021'
    },
    xAxis: {
        categories: ['2019', '2020', '2021']
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Percent'
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
    },
    plotOptions: {
        column: {
            stacking: 'percent'
        }
    },
    series: [{
        name: 'Road',
        data: [434, 290, 307]
    }, {
        name: 'Rail',
        data: [272, 153, 156]
    }, {
        name: 'Air',
        data: [13, 7, 8]
    }, {
        name: 'Sea',
        data: [55, 35, 41]
    }]
});
