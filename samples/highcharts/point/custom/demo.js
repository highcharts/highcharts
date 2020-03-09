Highcharts.chart('container', {

    title: {
        text: 'Newborn Names 2018'
    },

    chart: {
        type: 'column'
    },

    colors: ['#28E', '#4A0'],

    xAxis: [{
        labels: {
            autoRotation: 0
        },
        opposite: true,
        reversed: true,
        type: 'category'
    }, {
        labels: {
            autoRotation: 0
        },
        reversed: true,
        type: 'category'
    }],

    yAxis: [{
        min: -23,
        max: 0,
        visible: false
    }, {
        min: 0,
        max: 23,
        visible: false
    }],

    accessibility: {
        point: {
            descriptionFormatter: function (point) {
                return (
                    point.options.custom.value + ' ' + point.series.options.custom.gender + 's have been named ' + point.name + '. ' +
                    'This ranks on place #' + point.options.custom.rank + '.'
                );
            }
        }
    },

    tooltip: {
        headerFormat: '',
        pointFormat: (
            '{point.name}<br />' +
            '{point.options.custom.value} {series.options.custom.gender}s (rank #{point.options.custom.rank})'
        )
    },

    plotOptions: {
        series: {
            dataSorting: {
                enabled: true,
                sortKey: 'custom.rank'
            },
            keys: ['name', 'custom.value', 'y', 'custom.rank'], // 4th data position as custom property
            stacking: 'normal'
        }
    },

    series: [{
        name: 'Female names',
        xAxis: 0,
        yAxis: 0,
        custom: {
            gender: 'Girl'
        },
        data: [
            ['Ada', 7, -7, 7],
            ['Alma', 6, -6, 13],
            ['Amalie', 6, -6, 13],
            ['Ella', 9, -9, 2],
            ['Frida', 8, -8, 5],
            ['Hannah', 7, -7, 7],
            ['Helene', 7, -7, 7],
            ['Ingrid', 7, -7, 7],
            ['Maja', 8, -8, 5],
            ['Maria', 6, -6, 13],
            ['Nora', 9, -9, 2],
            ['Sara', 9, -9, 2],
            ['Sofia', 7, -7, 7],
            ['Sofie', 7, -7, 7],
            ['Tiril', 6, -6, 13],
            ['Vilde', 10, -10, 1]
        ]
    }, {
        name: 'Male names',
        xAxis: 1,
        yAxis: 1,
        custom: {
            gender: 'Boy'
        },
        data: [
            ['Alexander', 8, 8, 7],
            ['Brage', 8, 8, 7],
            ['Emil', 11, 11, 3],
            ['Henrik', 12, 12, 2],
            ['Isak', 9, 9, 4],
            ['Johannes', 9, 9, 4],
            ['Lucas', 7, 7, 10],
            ['Magnus', 8, 8, 7],
            ['Odin', 6, 6, 12],
            ['Ola', 6, 6, 12],
            ['Olav', 6, 6, 12],
            ['Oliver', 7, 7, 10],
            ['Oskar', 9, 9, 4],
            ['Sverre', 6, 6, 12],
            ['Tobias', 6, 6, 12],
            ['William', 13, 13, 1]
        ]
    }]

});
