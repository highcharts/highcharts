/**
 * Highcharts Drilldown plugin
 * 
 * Author: Torstein Hønsi
 * Last revision: 2013-02-16
 * License: MIT License
 * 
 * TODO:
 * - Make unlinked axis labels revert to default CSS without having to explicitly define it
 * - Automatically mark drillable points with cursor: pointer
 * - Animation for each series type to visualize how a point explodes into sub-points and collapses back
 * - Default options that are merged in. 
 * - Options for the button, similar to resetZoomButton options.
 * - Clickable data labels, at least for pies
 */

(function(H) {
    H.Chart.prototype.drilldownLevels = [];
    H.Chart.prototype.showResetDrilldown = function () {
        var chart = this;
        if (!this.resetDrilldownButton) {
            this.resetDrilldownButton = this.renderer.button(
                '◁ Back', 
                null, 
                null, 
                function () { chart.resetDrilldown(); })
                .attr({
                    align: 'right'
                })
                .add()
                .align({ 
                    align: 'right',
                    x: -10,
                    y: 10
                }, false, 'plotBox');
        }
    };
    H.Chart.prototype.resetDrilldown = function () {
        var chart = this,
            callback = function () {
                chart.series[0].remove(false);
                chart.addSeries(H.extend(chart.drilldownLevels.pop(), {
                    animation: false 
                }));  
                        
        
                if (chart.drilldownLevels.length === 0) {
                    chart.resetDrilldownButton = chart.resetDrilldownButton.destroy();
                }
            };
        
        if (this.series[0].animateDrillup) {
            this.series[0].animateDrillup(callback);
        } else {
            callback();
        }
    };
    
    H.seriesTypes.column.prototype.animateDrilldown = function (init) {
        var animateFrom = this.animateFrom;
        if (!init) {

            animateFrom.x += (this.xAxis.oldPos - this.xAxis.pos);
    
            H.each(this.points, function (point, i) {
                point.graphic
                    .attr(animateFrom)
                    .animate(point.shapeArgs);
            });
        }
        
        // Add a method to get back to this state
        this.animateDrillup = function (callback) {
            H.each(this.points, function (point) {
                point.graphic.animate(animateFrom, {
                    complete: callback
                });
            });
        };
    };
    
    H.Point.prototype.doDrilldown = function () {
        var series = this.series,
            chart = series.chart,
            drilldown = chart.options.drilldown,
            i = drilldown.series.length,
            ddOptions,
            newSeries;
        
        while (i-- && !ddOptions) {
            if (drilldown.series[i].id === this.drilldown) {
                ddOptions = drilldown.series[i];
            }
        }
        
        if (ddOptions) {
            
            ddOptions = H.extend({
                color: this.color || series.color
            }, ddOptions);
            
            chart.drilldownLevels.push(series.userOptions);
            
            newSeries = chart.addSeries(ddOptions, false);
            newSeries.animateFrom = this.shapeArgs;
            newSeries.xAxis.oldPos = newSeries.xAxis.pos;

            newSeries.animate = newSeries.animateDrilldown || function () {};
            
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
                    'class': 'highcharts-drilldown-label'
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
    
    
}(Highcharts));