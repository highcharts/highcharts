var seatChart1, seatChart2;

function getSeatsCharts(container1, container2) {

	var commonOptions = {
		chart: {
			//renderTo: '',
			margin: [10, 10, -100, 10],
			type: 'pie',

            options3d: {
                alpha: Math.PI / 4,
                depth: 25
            },
		},
        tooltip: {
            formatter: function() {
            	if (this.point.isEmpty) {
            		return false;
            	} else {
	                return '<b>' + this.point.name + '</b>: ' + this.point.y + '%<br/>';
    	        }
        	}
        },
        title: {
        	align: 'left'
        },
        subtitle: {
        	align: 'left'
        },
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 90,
                innerSize: 100,
                slicedOffset: 0,
                size: '95%',
                dataLabels: {
                    enabled: false
                }
            }
        }
	}

	// SEATS BY CONSTITUENCY
	seatChart1 = new Highcharts.Chart(Highcharts.merge(commonOptions,{
        chart: {
            renderTo: container1,
        },
        title: {
            text: 'Preliminary Seat Distribution',
        },
        subtitle: {
            text: 'By Constituency',
        },
        series: [{
        	data: [
        		{ 
        			name: 'unassigned seats', 
        			y: 159,
        			color: '#C0C0C0',
        			isEmpty: true // Prevent tooltip from showing
        		}
        	]
        }]
    }));
	setSeatsNumber(seatChart1, 299);

    // SEATS BY NATIONAL VOTE
    seatChart2 = new Highcharts.Chart(Highcharts.merge(commonOptions,{
        chart: {
            renderTo: container2,
        },
        title: {
            text: ' ',
        },
        subtitle: {
            text: 'National Votes',
            y: 28
        },
        series: [{
        	data: [
        		{ 
        			name: 'unassigned seats', 
        			y: 332,
        			color: '#C0C0C0',
        			isEmpty: true // Prevent tooltip from showing
        		}
        	]
        }]
    }));
	setSeatsNumber(seatChart2, 332);

    return [seatChart1, seatChart2];
}

function setSeatsNumber(chart, seats) {
    var x = chart.series[0].center[0] - 15,
        y = chart.series[0].center[1] + 30,
    	seatLabel = chart.seatLabel;

    if (!seatLabel) {
	    	seatLabel = chart.seatLabel = chart.renderer.text(seats, x, y)
	        .css({
	        fontWeight: 'bold',
	        fontSize: 25,
	        align: 'center'
	    }).add();
    } else {
    	seatLabel.attr({
    		text: seats
    	});
    }
}


////// QUICK CORRECTION TO MAKE PIE CHARTS WORK WITH THE LATEST HIGHCHARTS.JS
Highcharts.seriesTypes.pie.prototype.drawPoints = function () {
	var series = this,
		chart = series.chart,
		renderer = chart.renderer,
		groupTranslation,
		//center,
		graphic,
		//group,
		shadow = series.options.shadow,
		shadowGroup,
		shapeArgs;
		if (shadow && !series.shadowGroup) {
		series.shadowGroup = renderer.g('shadow')
			.add(series.group);
	}
	// draw the slices
	Highcharts.each(series.points, function (point) {
		graphic = point.graphic;
		shapeArgs = point.shapeArgs;
		shadowGroup = point.shadowGroup;
			// put the shadow behind all points
		if (shadow && !shadowGroup) {
			shadowGroup = point.shadowGroup = renderer.g('shadow')
				.add(series.shadowGroup);
		}

		// if the point is sliced, use special translation, else use plot area traslation
		groupTranslation = point.sliced ? point.slicedTranslation : {
			translateX: 0,
			translateY: 0
		};

		//group.translate(groupTranslation[0], groupTranslation[1]);
		if (shadowGroup) {
			shadowGroup.attr(groupTranslation);
		}

		// draw the slice
		if (graphic) {
			graphic.animate(extend(shapeArgs, groupTranslation));
		} else {
			point.graphic = graphic = renderer[point.shapeType](shapeArgs)
				.setRadialReference(series.center)
				.attr(
					point.pointAttr[point.selected ? 'select' : '']
				)
				.attr({ 'stroke-linejoin': 'round' })
				.attr(groupTranslation)
				.add(series.group)
				.shadow(shadow, shadowGroup);	
		}

		// detect point specific visibility (#2430)
		if (point.visible !== undefined) {
			point.setVisible(point.visible);
		}
	});
};