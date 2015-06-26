$(function () {

    // Create the chart
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Highcharts multi-series drilldown'
        },
        subtitle: {
            text: 'The <em>allowPointDrilldown</em> option makes point clicks drill to the whole category'
        },
        xAxis: {
            type: 'category'
        },

        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true
                }
            }
        },

        series: [{
            name: '2010',
            data: [{
                name: 'Republican',
                y: 5,
                drilldown: 'republican-2010'
            }, {
                name: 'Democrats',
                y: 2,
                drilldown: 'democrats-2010'
            }, {
                name: 'Other',
                y: 4,
                drilldown: 'other-2010'
            }]
        }, {
            name: '2014',
            data: [{
                name: 'Republican',
                y: 4,
                drilldown: 'republican-2014'
            }, {
                name: 'Democrats',
                y: 4,
                drilldown: 'democrats-2014'
            }, {
                name: 'Other',
                y: 4,
                drilldown: 'other-2014'
            }]
        }],
        drilldown: {
            allowPointDrilldown: false,
            series: [{
                id: 'republican-2010',
                data: [
                    ['East', 4],
                    ['West', 2],
                    ['North', 1],
                    ['South', 4]
                ]
            }, {
                id: 'democrats-2010',
                data: [
                    ['East', 6],
                    ['West', 2],
                    ['North', 2],
                    ['South', 4]
                ]
            }, {
                id: 'other-2010',
                data: [
                    ['East', 2],
                    ['West', 7],
                    ['North', 3],
                    ['South', 2]
                ]
            }, {
                id: 'republican-2014',
                data: [
                    ['East', 2],
                    ['West', 4],
                    ['North', 1],
                    ['South', 7]
                ]
            }, {
                id: 'democrats-2014',
                data: [
                    ['East', 4],
                    ['West', 2],
                    ['North', 5],
                    ['South', 3]
                ]
            }, {
                id: 'other-2014',
                data: [
                    ['East', 7],
                    ['West', 8],
                    ['North', 2],
                    ['South', 2]
                ]
            }]
        }
    });
});

