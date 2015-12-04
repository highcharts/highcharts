$(function () {

    (function (H) {
        var addEvent = H.addEvent,
            Chart = H.Chart,
            each = H.each,
            seriesTypes = H.seriesTypes,
            SVGElement = H.SVGElement;

        if (!SVGElement.prototype.remvoeClass) {
            SVGElement.prototype.removeClass = function (className) {
                this.element.setAttribute('class', this.element.getAttribute('class').replace(className, ''));
                return this;
            };
        }

        Chart.prototype.callbacks.push(function (chart) {
            var total = 0;
            each(chart.series, function (series) {
                if (series.initPuzzle) {
                    total += series.initPuzzle();
                }
            });
            chart.puzzle = {
                total: total,
                remaining: total
            };
            chart.puzzleCount = chart.renderer.label('', 10, 5)
                .css({
                    fontSize: '20pt'
                })
                .add();

            function updateCount(diff) {
                chart.puzzle.remaining += diff;
                chart.puzzleCount.attr({
                    text: (chart.puzzle.total - chart.puzzle.remaining) + ' / ' + chart.puzzle.total
                });
            }
            updateCount(0);

            function stopDrag(point) {
                point.dragStart = null;
                chart.dragPoint = null;
            }

            function drop(point) {
                point.graphic.attr({
                    translateX: 0,
                    translateY: 0,
                    scaleX: 1,
                    scaleY: 1
                })
                .removeClass('highcharts-puzzle-dragging')
                .addClass('highcharts-puzzle-dropped');

                point.inPuzzle = false;
                stopDrag(point);
                updateCount(-1);

            }

            function pointerDown(e) {
                var point = e.target.point,
                    graphic;

                if (point) {
                    graphic = point.graphic;

                    graphic.toFront();

                    e = chart.pointer.normalize(e);
                    point.dragStart = {
                        chartX: e.chartX,
                        chartY: e.chartY,
                        scale: graphic.scaleX,
                        translateX: graphic.translateX,
                        translateY: graphic.translateY
                    };
                    chart.dragPoint = point;
                }
            }

            function pointerMove(e) {
                var point = chart.dragPoint,
                    dragStart = point && point.inPuzzle && point.dragStart,
                    scale,
                    transCorr,
                    startTranslateX,
                    startTranslateY,
                    translateX,
                    translateY,
                    dist,
                    startDist,
                    pos;

                e = chart.pointer.normalize(e);
                e.preventDefault();
                if (dragStart) {
                    // Un-scale to find the true pixel translation
                    startTranslateX = dragStart.translateX / dragStart.scale;
                    startTranslateY = dragStart.translateY / dragStart.scale;

                    // Get the movement
                    translateX = startTranslateX + e.chartX - dragStart.chartX;
                    translateY = startTranslateY + e.chartY - dragStart.chartY;


                    // Pixel distance to target
                    dist = Math.sqrt(
                        Math.pow(translateX, 2) +
                        Math.pow(translateY, 2)
                    );


                    // Proximity snap to the true position
                    if (dist < 20) {
                        drop(point);

                    // Else, move it along
                    } else {
                        point.graphic.attr({
                            scaleX: 1,
                            scaleY: 1,
                            translateX: translateX,
                            translateY: translateY
                        })
                        .addClass('highcharts-puzzle-dragging');
                    }
                }
            }

            function pointerUp(e) {
                if (chart.dragPoint) {
                    stopDrag(chart.dragPoint);
                }
            }


            // Set events on the container
            addEvent(this.container, 'mousedown', pointerDown);
            addEvent(this.container, 'touchstart', pointerDown);
            addEvent(this.container, 'mousemove', pointerMove);
            addEvent(this.container, 'touchmove', pointerMove);
            addEvent(this.container, 'mouseup', pointerUp);
            addEvent(this.container, 'touchend', pointerUp);
        });

        seriesTypes.map.prototype.initPuzzle = function () {
            var chart = this.chart,
                total = 0;

            if (this.options.puzzle) {

                each(this.points, function (point) {
                    var bBox = point.graphic.getBBox(),
                        scale = Math.min(100 / bBox.width, 100 / bBox.height);

                    // Small items are hard to place
                    if (bBox.width > 5 && bBox.height > 5) {

                        // Put it in the dock
                        point.graphic.attr({
                            scaleX: scale,
                            scaleY: scale,
                            translateX: -bBox.x * scale,
                            translateY: -bBox.y * scale
                        });

                        point.inPuzzle = true;
                        total++;
                    }

                });
            }
            return total;
        };

    }(Highcharts));

    // Initiate the chart
    var n, mapData, data = [], maps = Highcharts.maps;
    for (n in maps) {
        if (maps.hasOwnProperty(n)) {
            mapData = maps[n];
            break;
        }
    }
    Highcharts.each(mapData.features, function (feature) {
        data.push({
            'hc-key': feature.properties['hc-key'],
            'value': 1
        });
    });


    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps puzzle',
            style: {
                fontSize: '20pt'
            }
        },

        legend: {
            enabled: false
        },

        tooltip: {
            headerFormat: '',
            pointFormat: '{point.name}',
            style: {
                fontSize: '14pt'
            }
        },

        series : [{
            borderColor: '#e8e8e8',
            mapData: mapData,
            nullColor: 'transparent'
        }, {
            mapData: mapData,
            colorByPoint: true,
            data: data,
            borderColor: '#000000',
            joinBy: 'hc-key',
            puzzle: true,
            states: {
                hover: {
                    color: Highcharts.getOptions().colors[2]
                }
            }
        }]
    });
});
