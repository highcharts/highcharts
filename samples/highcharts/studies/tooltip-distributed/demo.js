$(function() {
    /**
     * Highcharts plugin to display tooltip labels next to each point in a shared tooltip.
     * TODO:
     * - tooltip.hide()
     * - at the left side of the chart, show the labels to the right
     */
    (function (H) {
        var each = H.each,
            pick = H.pick,
            splat = H.splat;
        H.wrap(H.Tooltip.prototype, 'refresh', function (proceed, point, mouseEvent) {
            var points,
                pointConfig = [],
                boxes = [],
                labels,
                ren = this.chart.renderer,
                chart = this.chart,
                options = chart.options.tooltip,
                hoverPoints = chart.hoverPoints;
                
            if (options.shared && options.distributed) {
                points = splat(point);
                points.sort(function (a, b) {
                    return a.plotY - b.plotY;
                });
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
                labels = this.bodyFormatter(pointConfig);
                
                // Create the individual labels
                each(labels, function (str, i) {
                    var point = points[i],
                        series = point.series;
                    if (!series.tt) {
                        series.tt = ren.label(str)
                            .attr({
                                'fill': options.backgroundColor,
                                'r': options.borderRadius,
                                'stroke': point.color || series.color || 'silver',
                                'stroke-width': options.borderWidth,
                                'zIndex': 8
                            })
                            .add();
                            
                        // Add a connector back to the point
                        series.tt.connector = ren.path()
                            .attr({
                                'stroke-width': 1,
                                'stroke': point.color || series.color || 'silver'
                            })
                            .add();
                    }
                    // Prepare for distribution
                    boxes.push({
                        target: point.plotY,
                        size: series.tt.getBBox().height
                    });
                    
                });
                
                // Distribute and put in place
                H.distribute(boxes, chart.plotHeight);
                each(points, function (point, i) {
                    var tt = point.series.tt;
                    tt.attr({
                        x: point.plotX + chart.plotLeft - pick(options.distance, 16) - 
                            tt.getBBox().width,
                        y: boxes[i].pos + chart.plotTop
                    });
                    tt.connector.attr({
                        d: [
                            'M',
                            point.plotX + chart.plotLeft,
                            point.plotY + chart.plotTop, 
                            'L',
                            point.plotX + chart.plotLeft - pick(options.distance, 16),
                            boxes[i].pos + chart.plotTop + tt.getBBox().height / 2
                        ]
                    });
                });
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
            distributed: true
        },
        
        xAxis: {
            crosshair: {
                enabled: true,
                label: {
                    enabled: true
                }
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
