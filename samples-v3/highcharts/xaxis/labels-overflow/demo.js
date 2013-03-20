$(function () {
    $('#container').highcharts({
        chart: {
            plotBorderWidth: 1
        },
        
        title: {
        	text: null
        },
        
        xAxis: [{
            type: 'datetime',
            labels: {
            	overflow: 'justify'
            },
            title: {
            	text: 'Justified labels'
            }
        }, {
        	type: 'datetime',
        	linkedTo: 0,
        	opposite: true,
        	title: {
        		text: 'Non-justified labels'
        	}
        }],
        
        
        
        yAxis: {
        	title: {
        		text: null
        	},
        	labels: {
        		enabled: false
        	}
        },
        
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6],
            pointStart: (new Date()).setUTCHours(0),
            pointInterval: 24 * 3600 * 1000,
            showInLegend: false   
        }]
    });
});