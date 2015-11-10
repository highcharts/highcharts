$(function () {
    var seriesOptions = [],
        names = ['Serie 1', 'Serie 2'];

    $.each(names, function (i, name) {
        seriesOptions[i] = {
            name: name,
            data: [
                    /* Jan 2011 */
                    [1294012800000,1],
                    [1294099200000,1],
                    [1294185600000,1],
                    [1294272000000,1],
                    [1294358400000,1],
                    [1294617600000,1],
                    [1294704000000,1],
                    [1294790400000,1],
                    [1294876800000,1],
                    [1294963200000,1],
                    [1295308800000,1],
                    [1295395200000,1],
                    [1295481600000,1],
                    [1295568000000,1],
                    [1295827200000,1],
                    [1295913600000,1],
                    [1296000000000,1],
                    [1296086400000,1],
                    [1296172800000,1],
                    [1296432000000,1]
            ]
        };
    });

    $('#container').highcharts('StockChart', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'In Highstock 1.3.6-1.3.9, stacking percent failed with data grouping'
        },
        rangeSelector: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        plotOptions: {
            series: {
                stacking: 'percent',
                dataGrouping: {
                    forced: true,
                    units: [[
                        'week',
                            [1]
                    ]]
                }
            }
        },
        series: seriesOptions
    });

});