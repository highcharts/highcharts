var setDragStatus = function (status) {
    document.getElementById('dragstatus').innerHTML = status;
};

Highcharts.chart('container', {
    chart: {
        animation: false,
        type: 'xrange',
        zoomType: 'x'
    },

    title: {
        text: 'Highcharts draggable xrange demo'
    },

    tooltip: {
        headerFormat: '<span style="font-size: 10px">{point.yCategory}</span><br/>',
        pointFormat: '{point.name}'
    },

    plotOptions: {
        series: {
            minPointLength: 5, // Always show points, even when resized down
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            },
            dragDrop: {
                draggableX: true,
                draggableY: true,
                dragMinY: 0,
                dragMaxY: 2,
                dragMinX: Date.UTC(2014, 10, 15),
                dragMaxX: Date.UTC(2015, 0, 10),
                liveRedraw: false,
                groupBy: 'groupId' // Group data points with the same groupId
            },
            point: {
                events: {
                    dragStart: function (e) {
                        setDragStatus('Drag started at page coordinates ' +
                                e.chartX + '/' + e.chartY + (
                            e.updateProp ?
                                '. Updating ' + e.updateProp :
                                ''
                        ) + '. ');
                    },
                    drag: function (e) {
                        // Returning false stops the drag and drops. Example:
                        /*
                        if (e.newPoint && e.newPoint.x < 300) {
                            return false;
                        }
                        */
                        var status = 'Dragging "' +
                            (this.name || this.id) + '". ' + e.numNewPoints +
                            ' point(s) selected.';

                        // If more than one point is being updated, see
                        // e.newPoints for a hashmap of these. Here we just add
                        // info if there is a single point.
                        if (e.newPoint) {
                            status += ' New x/x2/y: ' + e.newPoint.x +
                                '/' + e.newPoint.x2 + '/' + e.newPoint.y;
                        }

                        setDragStatus(status);
                    },
                    drop: function (e) {
                        // The default action here runs point.update on the
                        // new points. Return false to stop this. Here we stop
                        // the "Group A" points from being moved to the
                        // "Prototyping" row.
                        if (
                            this.groupId === 'Group A' &&
                            e.newPoints[this.id].newValues.y === 0
                        ) {
                            setDragStatus('Drop was blocked by event handler.');
                            return false;
                        }

                        setDragStatus(
                            'Dropped ' + e.numNewPoints + ' point(s)'
                        );
                    }
                }
            }
        }
    },

    xAxis: {
        type: 'datetime',
        min: Date.UTC(2014, 10, 15),
        max: Date.UTC(2015, 0, 10)
    },

    yAxis: {
        title: '',
        min: 0,
        max: 2,
        categories: ['Prototyping', 'Development', 'Testing']
    },

    series: [{
        name: 'Project 1',
        cursor: 'move',
        data: [{
            x: Date.UTC(2014, 11, 1),
            x2: Date.UTC(2014, 11, 4),
            y: 0,
            name: 'Task 1'
        }, {
            x: Date.UTC(2014, 11, 2),
            x2: Date.UTC(2014, 11, 5),
            y: 1,
            name: 'Task 2'
        }, {
            x: Date.UTC(2014, 11, 9),
            x2: Date.UTC(2014, 11, 19),
            y: 1,
            name: 'No drag Y',
            // Disable draggable Y for this point
            dragDrop: {
                draggableY: false
            }
        }, {
            x: Date.UTC(2014, 11, 8),
            x2: Date.UTC(2014, 11, 9),
            y: 2,
            groupId: 'Group A',
            dragDrop: {
                draggableX1: false,
                draggableX2: false
            }
        }, {
            x: Date.UTC(2014, 11, 10),
            x2: Date.UTC(2014, 11, 23),
            y: 2,
            name: 'Grouped, no prototyping',
            groupId: 'Group A',
            dragDrop: {
                draggableX1: false,
                draggableX2: false
            }
        }, {
            x: Date.UTC(2014, 11, 25),
            x2: Date.UTC(2014, 11, 26),
            y: 2,
            groupId: 'Group A',
            dragDrop: {
                draggableX1: false,
                draggableX2: false
            }
        }, {
            x: Date.UTC(2014, 11, 24),
            x2: Date.UTC(2014, 11, 26),
            y: 1,
            groupId: 'Group B',
            dragDrop: {
                draggableX1: false,
                draggableX2: false
            }
        }, {
            x: Date.UTC(2014, 11, 26),
            x2: Date.UTC(2014, 11, 28),
            y: 1,
            name: 'Grouped',
            groupId: 'Group B',
            dragDrop: {
                draggableX1: false,
                draggableX2: false
            }
        }, {
            x: Date.UTC(2014, 11, 28),
            x2: Date.UTC(2014, 11, 30),
            y: 1,
            groupId: 'Group B',
            dragDrop: {
                draggableX1: false,
                draggableX2: false
            }
        }]
    }]
});
