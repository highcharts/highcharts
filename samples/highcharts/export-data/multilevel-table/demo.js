var ranges = [
        [1246406400000, 14.3, 27.7],
        [1246492800000, 14.5, 27.8],
        [1246579200000, 15.5, 29.6],
        [1246665600000, 16.7, 30.7],
        [1246752000000, 16.5, 25.0],
        [1246838400000, 17.8, 25.7]
    ],
    averages = [
        [1246406400000, 21.5],
        [1246492800000, 22.1],
        [1246579200000, 23],
        [1246665600000, 23.8],
        [1246752000000, 21.4],
        [1246838400000, 21.3]
    ];

Highcharts.chart('container', {
    exporting: {
        showTable: true,
        tableCaption: 'Data table',
        csv: {
            /* // Uncomment for custom column header formatter.
            // This function is called for each column header.
            columnHeaderFormatter: function (item, key) {
                if (!item || item instanceof Highcharts.Axis) {
                    return item.options.title.text;
                }
                // Item is not axis, now we are working with series.
                // Key is the property on the series we show in this column.
                return {
                    topLevelColumnTitle: 'Temperature',
                    columnTitle: key === 'y' ? 'avg' : key
                };
            },
            // */
            dateFormat: '%Y-%m-%d'
        }
    },

    title: {
        text: 'Temperature forecast'
    },

    tooltip: {
        shared: true,
        valueSuffix: '°C'
    },

    legend: {
        enabled: false
    },

    xAxis: {
        type: 'datetime',
        title: {
            text: 'Day'
        }
    },

    yAxis: {
        title: {
            text: 'Temperature'
        },
        labels: {
            format: '{value}°C'
        }
    },

    series: [{
        name: 'Temperature',
        data: averages
    }, {
        name: 'Range',
        data: ranges,
        color: Highcharts.getOptions().colors[0],
        type: 'arearange',
        linkedTo: ':previous',
        fillOpacity: 0.3
    }]
});
