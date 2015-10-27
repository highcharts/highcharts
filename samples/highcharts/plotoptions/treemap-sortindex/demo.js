$(function () {
    $('#container').highcharts({
        series: [{
            type: 'treemap',
            layoutAlgorithm: 'stripes',
            alternateStartingDirection: true,
            levels: [{
                level: 1,
                borderWidth: '3px',
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    verticalAlign: 'top',
                    style: {
                        fontWeight: 'bold'
                    }
                }
            }],
            data: [{
                id: '2012',
                sortIndex: 0,
                color: Highcharts.getOptions().colors[0]
            }, {
                name: 'Development',
                value: 2,
                parent: '2012'
            }, {
                name: 'Maintenance',
                value: 2,
                parent: '2012'
            }, {
                name: 'Sales',
                value: 2,
                parent: '2012'
            }, {
                id: '2013',
                sortIndex: 1,
                color: Highcharts.getOptions().colors[1]
            }, {
                name: 'Development',
                value: 3,
                parent: '2013'
            }, {
                name: 'Maintenance',
                value: 2,
                parent: '2013'
            }, {
                name: 'Sales',
                value: 5,
                parent: '2013'
            }, {
                id: '2014',
                sortIndex: 2,
                color: Highcharts.getOptions().colors[2]
            }, {
                name: 'Development',
                value: 1,
                parent: '2014'
            }, {
                name: 'Maintenance',
                value: 2,
                parent: '2014'
            }, {
                name: 'Sales',
                value: 1,
                parent: '2014'
            }, {
                id: '2015',
                sortIndex: 2,
                color: Highcharts.getOptions().colors[3]
            }, {
                name: 'Development',
                value: 1,
                parent: '2015'
            }, {
                name: 'Maintenance',
                value: 3,
                parent: '2015'
            }, {
                name: 'Sales',
                value: 3,
                parent: '2015'
            }]
        }],
        title: {
            text: 'Yearly Expenses'
        }
    });
});