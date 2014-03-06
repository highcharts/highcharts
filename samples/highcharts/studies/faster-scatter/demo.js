$(function () {
    /**
     * Faster scatter charts mod for Highcharts
     *
     * Author: Torstein Honsi, Stephane Vanraes
     * Last updated: 2014-03-05
     */
    (function (H) {

        function KDTree (points, depth) {
            var axis, median, length = points && points.length;

            if (length) {

                // alternate between the axis
                axis = depth % 2;
            
                // sort point array
                points.sort(function(a, b) {
                    return a[axis] - b[axis];
                });
               
                median = Math.floor(length / 2);
                
                // build and return node
                return {
                    point: points[median],
                    left: KDTree(points.slice(0, median), depth + 1),
                    right: KDTree(points.slice(median + 1), depth + 1)
                };
            
            }
        };


function nearest(search, tree, depth) {
    var point = tree.point,
        axis = depth % 2,
        tdist,
        sideA,
        sideB;
    
    // get REAL distance
    point.dist = (search[0] - point[0]) * (search[0] - point[0]) + (search[1] - point[1]) * (search[1] - point[1]) ;
    // pick side based on distance to splitting point
    tdist = (search[axis] - point[axis]);
    sideA = tdist < 0 ? 'left' : 'right';
    sideB = tdist < 0 ? 'right' : 'left';

    // end of tree
    if (!tree[sideA]) {
        return point;
    } else {
        var result = point,
            nPoint1 = nearest(search, tree[sideA], depth+1),
            nPoint2;

        result = (nPoint1.dist < result.dist ? nPoint1 : result);

        if (!tree[sideB]) {
            return result;
        } else {
            // compare distance to current best to splitting point to decide wether to check side B or not
            if (Math.abs(tdist) < result.dist) {
                nPoint2 = nearest(search, tree[sideB], depth+1);
                result = (nPoint2.dist < result.dist ? nPoint2 : result);
            }
        return result;
        }
    }
}


        // Skip advanced options testing, assume all points are given as [x, y]
        H.seriesTypes.scatter.prototype.pointClass = H.extendClass(H.Point, {
            init: function (series, options) {
                this.series = series;
                this.x = options[0];
                this.y = options[1];
                return this;
            }
        });
        // Draw points as composite shapes
        H.seriesTypes.scatter.prototype.drawPoints = function () {
            var data = this.points,
                renderer = this.chart.renderer,
                radius = this.options.marker.radius,
                stripes = [],
                group, 
                i = data.length,
                point,
                layers = this.layers;
            
            if (!layers) {
                layers = this.layers = [];
            }
        
            // Divide the points into stripes. Points within the same group won't overlap in the y
            // dimension
            while (i--) {
                point = data[i];
                group = Math.round(point.plotY / radius);
                if (!stripes[group]) {
                    stripes[group] = [];
                }
                stripes[group].push(point);
            }
        
            // Sort the members of each stripe by x value
            i = stripes.length;
            while (i--) {
                if (stripes[i]) {
                    stripes[i].sort(function(a, b) {
                        return a.plotX - b.plotX;
                    });
                }
            }
        
            // Loop over the members of each stripe and add them to a group if they don't overlap
            // in the x dimension.
            var groups = [],
                oddOrEven = 0,
                group, 
                stripe, 
                remaining = data.length,
                x,
                lastX,
                j;
        
            // first do even stripes, where points are guaranteed not to overlap with points in even stripes
            while (remaining) {
                group = [];
        
                for (i = oddOrEven; i < stripes.length; i += 2) {
                    stripe = stripes[i];
                    if (stripe) {
                        j = stripe.length;
                        lastX = null;
                        while (j--) {
                            x = stripe[j].plotX;
                            if (lastX === null || lastX - x >= radius * 2) {
                                group.push(stripe[j]); // push it to the group
                                stripe.splice(j, 1); // remove it from the stripe
                                remaining--;
                                lastX = x;
                            }
                        }
                    }
                }
                
                if (group.length) {
                    groups.push(group);
                }
        
                if (!group.length && !oddOrEven) { // finished adding points to even stripes
                    oddOrEven = 1;
                }
            }
        
            i = groups.length;
            var paths = [];
            while (i--) {
                var group = groups[i],
                    path = [],
                    size = radius * 2,
                    j,
                    x, y;
        
                for (j = 0; j < group.length; j++) {
                    // Math.round reduces rendering times by 20% in a 50,000 points chart
                    x = Math.round(group[j].plotX);
                    y = Math.round(group[j].plotY);
                    path.push('M', x - radius, y - radius, 'L', x + radius, y - radius, x + radius, y + radius, x - radius, y + radius);
                    
                    /* Note: using the symbol prototype gives  higher
                    processing times. The rendering time is slightly higher for
                    complex paths like circles, and lower for simple paths like
                    triangles. Tested in Chrome. Probably the best solution is to 
                    use a simplified shape calculation inline. */
                    /*
                    symbolPath = Highcharts.Renderer.prototype.symbols.circle(
                    x - radius,
                    y - radius,
                    size,
                    size);

                    // faster than concat:
                    for (var m = 0, len = symbolPath.length; m < len; m++)
                    path.push(symbolPath[m]);
                    */
                }
                
                paths.push(path);
        
                
            }
            
            // render
            for (i = 0; i < paths.length; i++) {
                if (!layers[i]) {
                    layers[i] = renderer.path(paths[i]).attr({
                        fill: this.pointAttr[''].fill
                    }).add(this.markerGroup);
                } else {
                    layers[i].attr({
                        d: paths[i]
                    });
                }
            }
            layers.length = i;
        };
        H.seriesTypes.scatter.prototype.setTooltipPoints = function () {
            var series = this,
                i = this.points.length,
                point,
                treePoints = [];

            this.tree = null;
            setTimeout(function () {
                var treePoint;
                while (i--) {
                    point = series.points[i];
                    treePoint = [point.plotX, point.plotY];
                    treePoint.index = i;
                    treePoints.push(treePoint);
                }
                series.tree = KDTree(treePoints, 0);
            });
        };
        H.seriesTypes.scatter.prototype.getNearest = function (search) {
            if (this.tree) {
                return this.points[
                    nearest(search, this.tree, 0).index
                ];
            }
        };

        H.wrap(H.Pointer.prototype, 'runPointActions', function (proceed, e) {
            var chart = this.chart;
            proceed.call(this, e);


            // Draw independent tooltips
            H.each(chart.series, function (series) {
                var point;
                if (series.getNearest) {
                    point = series.getNearest([e.chartX - chart.plotLeft, e.chartY - chart.plotTop]);
                    if (point) {
                        point.onMouseOver(e);
                    }
                }
            })
        });
    }(Highcharts));
    // End faster scatter mod

    // Prepare the data
    var data = [];
    for (var i = 0; i < 50000; i++) {
        data.push([
            Math.pow(Math.random(), 2) * 100,
            Math.pow(Math.random(), 2) * 100
        ]);
    }

    var start = +new Date();
    //console.profile('scatter');
    $('#container').highcharts({
        
        xAxis: {
            gridLineWidth: 1
        },
        yAxis: {
            min: 0,
            max: 100
        },

        title: {
            text: 'Scatter chart with ' + data.length + ' points'
        },
        subtitle: {
            text: 'Rendered in ...'
        },
        legend: {
            enabled: false
        },
        series: [{
            type: 'scatter',
            animation: false,
            data: data,
            color: 'rgba(152,0,67,0.2)',
            marker: {
                radius: 1,
                states: {
                    hover: {
                        radius: 2,
                        lineWidth: 1,
                        lineColor: 'black'
                    }
                }
            },
            tooltip: {
                followPointer: false,
                pointFormat: '[{point.x:.1f}, {point.y:.1f}]'
            }
        }]

    }, function (chart) {
        //console.profileEnd('scatter');
        chart.setTitle(null, {
            text: 'Rendered in ' + (new Date() - start) + ' ms by Highcharts'
        });
    });
});