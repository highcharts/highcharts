$(function () {
    $('#container').highcharts({

	    chart: {
	        type: 'bubble',
	        //plotBorderWidth: 1,
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
	        data: [[97,36,79],[94,74,60],[68,76,58],[64,87,56],[68,27,73],[74,99,42],[7,93,87],[51,69,40],[38,23,33],[57,86,31]],
	        color: {
	             radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
	             stops: [
	                 [0, 'rgba(255, 255, 255, 0.5)'],
	                 [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
	             ]
	        }
	    }, {
	        data: [[25,10,87],[2,75,59],[11,54,8],[86,55,93],[5,3,58],[90,63,44],[91,33,17],[97,3,56],[15,67,48],[54,25,81]],
	        color: {
	             radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
	             stops: [
	                 [0, 'rgba(255, 255, 255, 0.5)'],
	                 [1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.5).get('rgba')]
	             ]
	        }
	    }, {
	        data: [[47,47,21],[20,12,4],[6,76,91],[38,30,60],[57,98,64],[61,17,80],[83,60,13],[67,78,75],[64,12,10],[30,77,82]],
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