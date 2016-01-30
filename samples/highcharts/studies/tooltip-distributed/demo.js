$(function() {
    /**
     * Highcharts plugin to display tooltip labels next to each point in a shared tooltip.
     */
    (function (H) {
        var each = H.each,
            pick = H.pick,
            splat = H.splat,
            Tooltip = H.Tooltip,
            wrap = H.wrap;

        wrap(Tooltip.prototype, 'init', function (proceed) {
            proceed.apply(this, [].slice.call(arguments, 1));

            this.label = this.chart.renderer.g('tooltip')
                .attr({
                    zIndex: 8
                })
                .add();
        });

        wrap(Tooltip.prototype, 'refresh', function (proceed, point, mouseEvent) {
            var tooltip = this,
                points,
                pointConfig = [],
                boxes = [],
                labels,
                ren = this.chart.renderer,
                chart = this.chart,
                options = chart.options.tooltip,
                hoverPoints = chart.hoverPoints,
                rightAligned = true;
                
            if (options.shared && options.distributed && !chart.inverted) {
                points = splat(point);
                
                // hide previous hoverPoints and set new
                chart.hoverPoints = points;
                if (hoverPoints) {
                    each(hoverPoints, function (point) {
                        point.setState();
                    });
                }
                each(points, function (item) {
                    item.setState('hover');

                    pointConfig.push(item.getLabelConfig());
                });

                // Do excactly like Tooltip.prototype.defaultFormatter,
                // except we use the array without joining.
                labels = [this.tooltipFooterHeaderFormatter(pointConfig[0])]
                    .concat(this.bodyFormatter(pointConfig));

                // Create the individual labels
                each(labels, function (str, i) {
                    var point = points[i - 1] ||
                             // Item 0 is the header. Instead of this, we could also use the crosshair label
                            { isHeader: true, plotX: points[0].plotX },
                        owner = point.series || tooltip,
                        tt = owner.tt,
                        series = point.series || {},
                        x;
                    
                    // Store the tooltip referance on the series
                    if (!tt) {
                        owner.tt = tt = ren.label()
                            .attr({
                                'fill': options.backgroundColor,
                                'r': options.borderRadius,
                                'stroke': point.color || series.color || 'transparent',
                                'stroke-width': options.borderWidth
                            })
                            .add(tooltip.label);
                            
                        // Add a connector back to the point
                        if (point.series) {
                            tt.connector = ren.path()
                                .attr({
                                    'stroke-width': series.options.lineWidth || 2,
                                    'stroke': point.color || series.color || 'silver'
                                })
                                .add(tooltip.label);
                        }
                    }
                    tt.attr({
                        text: str
                    });

                    // Get X position now, so we can move all to the other side in case of overflow
                    x = point.plotX + chart.plotLeft - pick(options.distance, 16) - 
                        tt.getBBox().width;

                    // If overflow left, we don't use this x in the next loop
                    if (x < 0) {
                        rightAligned = false;
                    }
                    

                    // Prepare for distribution
                    boxes.push({
                        target: point.plotY || 0,
                        rank: point.isHeader ? 1 : 0,
                        size: owner.tt.getBBox().height + 1,
                        point: point,
                        x: x,
                        tt: tt
                    });


                    
                });
                
                // Distribute and put in place
                H.distribute(boxes, chart.plotHeight);
                each(boxes, function (box, i) {
                    var point = box.point,
                        tt = box.tt;

                    // Put the label in place
                    tt.attr({
                        x: rightAligned ? box.x : point.plotX + chart.plotLeft + pick(options.distance, 16),
                        y: box.pos + chart.plotTop
                    });

                    // Draw the connector to the point
                    if (!point.isHeader) {
                        tt.connector.attr({
                            d: [
                                'M',
                                point.plotX + chart.plotLeft,
                                point.plotY + chart.plotTop, 
                                'L',
                                rightAligned ? 
                                    point.plotX + chart.plotLeft - pick(options.distance, 16) :
                                    point.plotX + chart.plotLeft + pick(options.distance, 16),
                                box.pos + chart.plotTop + tt.getBBox().height / 2
                            ]
                        });
                    }
                });
                // show it
                if (tooltip.isHidden) {
                    stop(tooltip.label);
                    tooltip.label.attr('opacity', 1).show();
                }
                tooltip.isHidden = false;
            } else {
                return proceed.call(this, point, mouseEvent);
            }
        });
    }(Highcharts));

    // Create the chart
    $('#container').highcharts({

        chart: {
            type: 'spline'
        },

        title: {
            text: 'Periodisk kontroll Hytta'
        },

        tooltip: {
            valueSuffix: '°C',
            shared: true,
            distributed: true,
            distance: 30
        },
        
        xAxis: {
            crosshair: {
                enabled: true
            }
        },

        yAxis: {
            title: {
                text: 'Temperatur'
            }
        },

        plotOptions: {
            series: {
                lineWidth: 1.5,
                marker: {
                    radius: 2
                }
            }
        },

        data: {
            columns: [["Tid",1451616120000,1451865660000,1451952060000,1452038400000,1452124800000,1452211200000,1452297600000,1452384000000,1452470400000,1452556800000,1452643200000,1452729600000,1452816000000,1452902400000,1452988800000,1453075200000,1453161600000,1453248000000,1453334400000,1453420800000,1453507200000,1453593600000,1453680000000,1453766400000,1453852800000,1453939200000,1454025600000],["Kjøken og Sofa",5,4,5,9,6,15,19,14,6,5,6,6,15,18,15,6,6,6,6,6,6,6,16,10,6,6,6],["Stovebord",9,10,16,13,6,20,24,16,7,7,6,6,20,23,18,9,7,6,6,7,6,21,20,16,6,6,6],["Gangen",7,7,13,12,5,17,22,14,4,5,5,6,18,21,17,9,5,6,5,6,6,18,20,14,5,5,5],["Badet",7,7,13,12,5,17,22,14,4,5,5,6,18,21,17,9,5,6,5,6,6,18,20,14,5,5,5],["Storarommet",6,19,19,10,5,15,21,14,6,6,5,5,17,21,16,6,5,5,5,5,5,17,18,13,5,5,5],["Vetlarommet",7,19,19,9,5,11,19,15,6,5,6,6,16,19,17,8,9,6,5,6,5,17,19,14,6,6,6],["Bui",6,6,5,5,6,6,6,5,5,6,6,5,6,6,6,6,6,6,null,null,6,6,6,6,6,6,6]]
        }

    });
});
