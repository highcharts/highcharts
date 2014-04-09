$(function () {
	
    var gaugeOptions = {
	
	    chart: {
	        type: 'solidgauge'
	    },
	    
	    title: {
	        text: null
	    },
	    
	    pane: {
	        startAngle: -90,
	        endAngle: 90,
            background: null
	    },
	       
	    // the value axis
	    yAxis: {
	        min: 0,
	        max: 200,
			stops: [
				[0.1, '#55BF3B'], // green
	        	[0.5, '#DDDF0D'], // yellow
	        	[0.9, '#DF5353'] // red
			],
			lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
	        title: {
                y: -70
	        },
            labels: {
                y: 16
            },
	        plotBands: [{
                from: 0,
                to: 200,
                color: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%'
	        }]        
	    },
        
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: -30,
                    borderWidth: 0,
                    format: '<div style="text-align:center"><span style="font-size:25px;color:' + 
                    	((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' + 
                    	'<span style="font-size:12px;color:silver">km/h</span></div>',
                    useHTML: true
                }
            }
        }
    };
    
    $('#container').highcharts(Highcharts.merge(gaugeOptions, {
        pane: {
	        center: ['50%', '60%']
	    },
	       
	    yAxis: {
	        title: {
	            text: 'Speed'
	        }       
	    },
	
	    series: [{
	        name: 'Speed',
	        data: [80],
	        tooltip: {
	            valueSuffix: ' km/h'
	        }            
	    }]
	
	}));
                               
    
    setInterval(function () {
        var chart = $('#container').highcharts();
        if (chart) {
            var point = chart.series[0].points[0],
                newVal,
                inc = Math.round((Math.random() - 0.5) * 100);
            
            newVal = point.y + inc;
            if (newVal < 0 || newVal > 200) {
                newVal = point.y - inc;
            }
            
            point.update(newVal);
        }
    }, 2000);  
    
	
});