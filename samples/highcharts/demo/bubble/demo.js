$(function () {
    var chart = new Highcharts.Chart({

	    chart: {
	        renderTo: 'container',
	        type: 'bubble',
	        plotBorderWidth: 1,
	        zoomType: 'xy'
	    },
	    
	    xAxis: {
	        minPadding: 0,
	        maxPadding: 0,
	        startOnTick: false,
	        endOnTick: false
	    },    
	    yAxis: {
	    	minPadding: 0,
	        maxPadding: 0,
	        startOnTick: false,
	        endOnTick: false
	    },
	
	    series: [{
	        _data: [
	            [0, 0, 1],
	            [100, 100, 0]
	        ],
	        data: (function() {
	            var arr = [];
	            for (var i = 0; i < 20; i++) {
	                arr.push([
	                    Math.round(Math.random() * 100),
	                    Math.round(Math.random() * 100),
	                    Math.round(Math.random() * 100)
	                ]);
	            }
	            console.log('data: ' + JSON.stringify(arr));
	            return arr;
	        }()),
	        dataLabels: {
	            //enabled: true
	        },
	        color: {
	             radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
	             stops: [
	                 [0, 'rgba(255, 255, 255, 0.5)'],
	                 [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
	             ]
	        }
	    }, {
	        data: (function() {
	            var arr = [];
	            for (var i = 0; i < 10; i++) {
	                arr.push([
	                    Math.round(Math.random() * 100),
	                    Math.round(Math.random() * 100),
	                    Math.round(Math.random() * 100)
	                ]);
	            }
	            console.log('data: ' + JSON.stringify(arr));
	            return arr;
	        }()),
	        dataLabels: {
	            //enabled: true
	        },
	        color: {
	             radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
	             stops: [
	                 [0, 'rgba(255, 255, 255, 0.5)'],
	                 [1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.5).get('rgba')]
	             ]
	        }
	    }, {
	        data: (function() {
	            var arr = [];
	            for (var i = 0; i < 10; i++) {
	                arr.push([
	                    Math.round(Math.random() * 100),
	                    Math.round(Math.random() * 100),
	                    Math.round(Math.random() * 100)
	                ]);
	            }
	            console.log('data: ' + JSON.stringify(arr));
	            return arr;
	        }()),
	        dataLabels: {
	            //enabled: true
	        },
	        color: {
	             radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
	             stops: [
	                 [0, 'rgba(255, 255, 255, 0.5)'],
	                 [1, Highcharts.Color(Highcharts.getOptions().colors[2]).setOpacity(0.5).get('rgba')]
	             ]
	        }
	    }]
	
	});
    
});