$(function () {
	$('#container').highcharts({
        chart: {
            type: 'area'
        },
        
        title: {
        	text: 'Percent stack with negative values'
        },

        plotOptions: {
            series: {
                stacking: 'percent'
            }
        },
        series: [{
            data: [1, -1, 1],
            zIndex: 4
        }, {
            data: [2, 2, 2],
            zIndex: 3
        }, {
            data: [1, -1, 1],
            zIndex: 2,
            type: 'column'
        }, {
            data: [2, 2, 2],
            zIndex: 1,
            type: 'column'
        }]
    });
});