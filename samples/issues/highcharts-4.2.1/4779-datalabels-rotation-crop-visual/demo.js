
$(function () {
    function getData() {
        var x, y, data = [];

        for (x = 0; x < 10; x++) {
            for (y = 0; y < 10; y++) {
                data.push([x, y]);
            }
        }
        return data;
    }

    $('#container').highcharts({
        chart: {
            type: 'scatter',
            margin: 100,
            plotBorderColor: 'red',
            plotBorderWidth: 2
        },

        title: {
            text: 'No data label should spill outside the plot area'
        },

        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    allowOverlap: true,
                    format: 'DataLabel'
                }
            }
        },
        series: [{
            data: getData(),
            dataLabels: {
                align: 'left'
            }
        }, {
            data: getData(),
            dataLabels: {
                align: 'center'
            }
        }, {
            data: getData(),
            dataLabels: {
                align: 'right'
            }
        },

        // -90
        {
            data: getData(),
            dataLabels: {
                align: 'left',
                rotation: -90
            }
        }, {
            data: getData(),
            dataLabels: {
                align: 'center',
                rotation: -90
            }
        }, {
            data: getData(),
            dataLabels: {
                align: 'right',
                rotation: -90
            }
        },


        // -45 
        {
            data: getData(),
            dataLabels: {
                align: 'left',
                rotation: -45
            }
        }, {
            data: getData(),
            dataLabels: {
                align: 'center',
                rotation: -45
            }
        }, {
            data: getData(),
            dataLabels: {
                align: 'right',
                rotation: -45
            }
        },

        // 45
        {
            data: getData(),
            dataLabels: {
                align: 'left',
                rotation: 45
            }
        }, {
            data: getData(),
            dataLabels: {
                align: 'center',
                rotation: 45
            }
        }, {
            data: getData(),
            dataLabels: {
                align: 'right',
                rotation: 45
            }
        },

        // 90
        {
            data: getData(),
            dataLabels: {
                align: 'left',
                rotation: 90
            }
        }, {
            data: getData(),
            dataLabels: {
                align: 'center',
                rotation: 90
            }
        }, {
            data: getData(),
            dataLabels: {
                align: 'right',
                rotation: 90
            }
        }]

    });

});