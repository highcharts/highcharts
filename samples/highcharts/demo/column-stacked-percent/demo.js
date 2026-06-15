Highcharts.chart('container', {
    dataTable: {
        columns: {
            Year: ['2019', '2020', '2021'],
            Road: [434, 290, 307],
            Rail: [272, 153, 156],
            Air: [13, 7, 8],
            Sea: [55, 35, 41]
        }
    },
    chart: {
        type: 'column'
    },
    title: {
        text: 'Domestic passenger transport by mode of transport, Norway'
    },
    subtitle: {
        text: 'Source: <a href="https://www.ssb.no/transport-og-reiseliv/landtransport/statistikk/innenlandsk-transport">SSB</a>'
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Percent'
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>' +
            ': <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
    },
    plotOptions: {
        column: {
            stacking: 'percent',
            dataLabels: {
                enabled: true,
                format: '{point.percentage:.0f}%'
            },
            dataMapping: {
                name: 'Year'
            }
        }
    },
    series: [{
        dataMapping: {
            y: 'Road'
        }
    }, {
        dataMapping: {
            y: 'Rail'
        }
    }, {
        dataMapping: {
            y: 'Air'
        }
    }, {
        dataMapping: {
            y: 'Sea'
        }
    }]
});
