/**
 * Highcharts Drilldown plugin
 * 
 * Author: Torstein Honsi
 * Last revision: 2013-02-18
 * License: MIT License
 * 
 * TODO:
 * - Make unlinked axis labels revert to default CSS without having to explicitly define it
 * - Automatically mark drillable points with cursor: pointer
 * - Animation for each series type to visualize how a point explodes into sub-points and collapses back
 * - Default options that are merged in. 
 * - Options for the button, similar to resetZoomButton options.
 */

(function (H) {

	"use strict";

    var noop = function () {},
        defaultOptions = H.getOptions();

    // Utilities
    function tweenColors(startColor, endColor, pos) {
        var rgba = [
                Math.round(startColor[0] + (endColor[0] - startColor[0]) * pos),
                Math.round(startColor[1] + (endColor[1] - startColor[1]) * pos),
                Math.round(startColor[2] + (endColor[2] - startColor[2]) * pos),
                startColor[3] + (endColor[3] - startColor[3]) * pos
            ];
        return 'rgba(' + rgba.join(',') + ')';
    }

    // Add language
    H.extend(defaultOptions.lang, {
        drillUpText: '◁ Back to {series.name}'
    });

    /**
     * A general fadeIn method
     */
    H.SVGRenderer.prototype.Element.prototype.fadeIn = function () {
        this
        .attr({
            opacity: 0
        })
        .show()
        .animate({
            opacity: 1
        }, {
            duration: 250
        });
    };

    // Extend the Chart prototype
	H.Chart.prototype.drilldownLevels = [];

    H.Chart.prototype.getDrilldownBackText = function () {
        var lastLevel = this.drilldownLevels[this.drilldownLevels.length - 1];

        return this.options.lang.drillUpText.replace('{series.name}', lastLevel.seriesOptions.name);

    };

	H.Chart.prototype.showResetDrilldown = function () {
		var chart = this,
            backText = this.getDrilldownBackText();
            

		if (!this.resetDrilldownButton) {
			this.resetDrilldownButton = this.renderer.button(
				backText,
				null,
				null,
				function () {
					chart.drillUp(); 
				}
            )
			.attr({
				align: 'right',
                zIndex: 20
			})
			.add()
			.align({ 
				align: 'right',
				x: -10,
				y: 10
			}, false, 'plotBox');
		} else {
            this.resetDrilldownButton.attr({
                text: backText
            })
            .align();
        }
	};

    H.Chart.prototype.drillUp = function () {
		var chart = this,
            level = chart.drilldownLevels.pop(),
			oldSeries = chart.series[0],
			newSeries = chart.addSeries(level.seriesOptions, false);

        HighchartsAdapter.fireEvent(chart, 'drillup', { seriesOptions: level.seriesOptions });

        if (newSeries.type === oldSeries.type) {
            newSeries.drilldownLevel = level;
		    newSeries.animate = newSeries.animateDrillupTo || noop;

            if (oldSeries.animateDrillupFrom) {
			    oldSeries.animateDrillupFrom(newSeries, level);
            }
		}

		oldSeries.remove(false);


		this.redraw();

		if (this.drilldownLevels.length === 0) {
			this.resetDrilldownButton = this.resetDrilldownButton.destroy();
		} else {
            this.resetDrilldownButton.attr({
                text: this.getDrilldownBackText()
            })
            .align();
        }
	};

    H.seriesTypes.pie.prototype.animateDrilldown = function (init) {
        var level = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1],
            animationOptions = this.chart.options.drilldown.animation,
            animateFrom = level.shapeArgs,
            start = animateFrom.start,
            angle = animateFrom.end - start,
            startAngle = angle / this.points.length,
            startColor = H.Color(level.color).rgba;

        if (!init) {
            H.each(this.points, function (point, i) {
                var endColor = H.Color(point.color).rgba;

                point.graphic
                    .attr(H.merge(animateFrom, {
                        start: start + i * startAngle,
                        end: start + (i + 1) * startAngle
                    }))
                    .animate(point.shapeArgs, H.merge(animationOptions, {
                        step: function (val, fx) {
                            if (fx.prop === 'start') {
                                this.attr({
                                    fill: tweenColors(startColor, endColor, fx.pos)
                                });
                            }
                        }
                    }));
            });
        }
    };



    /**
     * When drilling up, pull out the individual point graphics from the lower series
     * and animate them into the origin point in the upper series.
     */
    H.seriesTypes.pie.prototype.animateDrillupFrom = function (newSeries, level) {
        var animateTo = this.animateTo,
            animationOptions = this.chart.options.drilldown.animation;

        H.each(this.points, function (point) {
            var graphic = point.graphic,
                group = point.group,
                startColor = H.Color(point.color).rgba;

            delete point.graphic;
            delete point.group;
            if (graphic.r === undefined) {
                console.log("TODO: fix animation bug. May be related to #1517");
            }
            graphic.animate(level.shapeArgs, H.merge(animationOptions, {
                step: function (val, fx) {
                    if (fx.prop === 'start') {
                        this.attr({
                            fill: tweenColors(startColor, H.Color(level.color).rgba, fx.pos)
                        });
                    }
                },
                complete: function () {
                    graphic.destroy();
                    group.destroy();
                }
            }));
        });
    };


    /**
     * When drilling up, keep the upper series invisible until the lower series has
     * moved into place
     */
    H.seriesTypes.pie.prototype.animateDrillupTo = 
            H.seriesTypes.column.prototype.animateDrillupTo = function (init) {
        if (!init) {
            var newSeries = this,
                pointIndex = newSeries.drilldownLevel.pointIndex;

            H.each(this.points, function (point, i) {
                point.graphic.hide();
                if (point.dataLabel) {
                    point.dataLabel.hide();
                }
                if (point.connector) {
                    point.connector.hide();
                }
            });


            // Do dummy animation on first point to get to complete
            setTimeout(function () {
                H.each(newSeries.points, function (point, i) {  
                    // Fade in other points              
                    var verb = i === pointIndex ? 'show' : 'fadeIn';
                    point.graphic[verb]();
                    if (point.dataLabel) {
                        point.dataLabel[verb]();
                    }
                    if (point.connector) {
                        point.connector[verb]();
                    }
                });
            }, Math.max(this.chart.options.drilldown.animation.duration - 50, 0));

            // Reset
            console.log(234)
            this.animate = noop;
        }

    };
	
	H.seriesTypes.column.prototype.animateDrilldown = function (init) {
		var animateFrom = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1].shapeArgs,
            animationOptions = this.chart.options.drilldown.animation;
            
		if (!init) {

			animateFrom.x += (this.xAxis.oldPos - this.xAxis.pos);
	
			H.each(this.points, function (point, i) {
				point.graphic
					.attr(animateFrom)
					.animate(point.shapeArgs, animationOptions);
			});
		}
		
	};

    /**
     * When drilling up, pull out the individual point graphics from the lower series
     * and animate them into the origin point in the upper series.
     */
    H.seriesTypes.column.prototype.animateDrillupFrom = function (newSeries, level) {
        var animateTo = this.animateTo,
            animationOptions = this.chart.options.drilldown.animation,
            group = this.group;

        delete this.group;
        H.each(this.points, function (point) {
            var graphic = point.graphic;

            delete point.graphic;
            graphic.animate(level.shapeArgs, H.merge(animationOptions, {
                complete: function () {
                    graphic.destroy();
                    if (group) {
                        group = group.destroy();
                    }
                }
            }));
        });
    };

    /**
     * When drilling up, keep the upper series invisible until the lower series has
     * moved into place
     */
    /*H.seriesTypes.column.prototype.animateDrillupTo = function (init) {
        if (!init) {
            var animationOptions = this.chart.options.drilldown.animation,
                newSeries = this,
                group = this.group;

            group
                .attr({
                    opacity: 0
                })
                .animate({
                    width: 0 // dummy
                }, H.merge(animationOptions, {
                    complete: function () {
                        group.animate({
                            opacity: 1
                        }, {
                            duration: 250
                        });
                    }
                }));
        }

    };*/
	
	H.Point.prototype.doDrilldown = function () {
		var series = this.series,
			chart = series.chart,
			drilldown = chart.options.drilldown,
			i = drilldown.series.length,
			ddOptions,
			xAxis = series.xAxis,
            color = this.color || series.color,
			newSeries,
            pointIndex,
            level;
		
		while (i-- && !ddOptions) {
			if (drilldown.series[i].id === this.drilldown) {
				ddOptions = drilldown.series[i];
			}
		}
		
		if (ddOptions) {

            HighchartsAdapter.inArray(this, series.points);
            
            
			ddOptions = H.extend({
				color: color
			}, ddOptions);
            pointIndex = HighchartsAdapter.inArray(this, series.points);
            level = {
                seriesOptions: series.userOptions,
                shapeArgs: this.shapeArgs,
                color: color,
                newSeries: ddOptions,
                pointOptions: series.options.data[pointIndex],
                pointIndex: pointIndex
            };

            HighchartsAdapter.fireEvent(chart, 'drilldown', { 
                drilldown: level 
            });
            
            chart.drilldownLevels.push(level);

			newSeries = chart.addSeries(ddOptions, false);
			if (xAxis) {
				xAxis.oldPos = xAxis.pos;
			}

            // Run fancy cross-animation on supported and equal types
            if (series.type === newSeries.type) {
                newSeries.animate = newSeries.animateDrilldown || noop;
            }
			
			series.remove(false);
			
			chart.redraw();
			chart.showResetDrilldown();
		}
	};
	
	H.wrap(H.Point.prototype, 'init', function (proceed, series, options, x) {
		var point = proceed.call(this, series, options, x),
			series = point.series,
			chart = series.chart;
		
		if (point.drilldown) {
			
			// Add the click event to the point label
			H.addEvent(point, 'click', function (e) {
				point.doDrilldown();
			});
			
			// Make axis labels clickable
			if (series.xAxis && series.xAxis.ticks[x]) {
				series.xAxis.ticks[x].label.attr({
					'class': 'highcharts-drilldown-axis-label'
				})
				.css(chart.options.drilldown.activeAxisLabelStyle)
				.on('click', function () {
					if (point.doDrilldown) {
						point.doDrilldown();
					}
				});
					
			}
		}
		
		return point;
	});

	H.wrap(H.Series.prototype, 'drawDataLabels', function (proceed) {
		var css = this.chart.options.drilldown.activeDataLabelStyle;

		proceed.call(this);

		H.each(this.points, function (point) {
			if (point.drilldown && point.dataLabel) {
				point.dataLabel
					.attr({
						'class': 'highcharts-drilldown-data-label'
					})
					.css(css)
					.on('click', function () {
						point.doDrilldown();
					});
			}
		});
	});

    // Mark the trackers with a pointer cursor
    H.each([H.seriesTypes.column.prototype, H.seriesTypes.pie.prototype], function (proto) {
    	H.wrap(proto, 'drawTracker', function (proceed) {
    		proceed.call(this);
    		H.each(this.points, function (point) {
    			if (point.drilldown && point.graphic) {
    				point.graphic
    					.css({ cursor: 'pointer' });
    			}
    		});
    	});
    });
    	
}(Highcharts));