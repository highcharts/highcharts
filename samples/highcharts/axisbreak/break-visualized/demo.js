/**
 * Extend the Axis.getLinePath method in order to visualize breaks with two parallel
 * slanted lines. For each break, the slanted lines are inserted into the line path.
 */
Highcharts.wrap(Highcharts.Axis.prototype, 'getLinePath', function (proceed, lineWidth) {
    const axis = this,
        brokenAxis = axis.brokenAxis,
        path = proceed.call(this, lineWidth),
        start = path[0];

    let x = start[1],
        y = start[2];

    (brokenAxis.breakArray || []).forEach(function (brk) {
        if (axis.horiz) {
            x = axis.toPixels(brk.from);
            path.splice(1, 0,
                ['L', x - 4, y], // stop
                ['M', x - 9, y + 5],
                ['L', x + 1, y - 5], // left slanted line
                ['M', x - 1, y + 5],
                ['L', x + 9, y - 5], // higher slanted line
                ['M', x + 4, y]
            );
        } else {
            y = axis.toPixels(brk.from);
            path.splice(1, 0,
                ['L', x, y - 4], // stop
                ['M', x + 5, y - 9],
                ['L', x - 5, y + 1], // lower slanted line
                ['M', x + 5, y - 1],
                ['L', x - 5, y + 9], // higher slanted line
                ['M', x, y + 4]
            );
        }
    });
    return path;
});

/**
 * On top of each column, draw a zigzag line where the axis break is.
 */
function pointBreakColumn(e) {
    const point = e.point,
        brk = e.brk,
        shapeArgs = point.shapeArgs,
        x = shapeArgs.x,
        y = this.translate(brk.from, 0, 1, 0, 1),
        w = shapeArgs.width,
        key = ['brk', brk.from, brk.to],
        path = ['M', x, y, 'L', x + w * 0.25, y + 4, 'L', x + w * 0.75, y - 4, 'L', x + w, y];

    if (!point[key]) {
        point[key] = this.chart.renderer.path(path)
            .attr({
                'stroke-width': 2,
                stroke: point.series.options.borderColor
            })
            .add(point.graphic.parentGroup);
    } else {
        point[key].attr({
            d: path
        });
    }
}

/**
 * Remove the zigzag line after the column is no longer on the break.
 */
function pointOutsideOfBreak(e) {
    const point = e.point,
        brk = e.brk,
        key = ['brk', brk.from, brk.to];

    if (point[key]) {
        point[key].destroy();
        delete point[key];
    }
}

Highcharts.chart('container', {
    chart: {
        type: 'column',
        zooming: {
            type: 'xy'
        }
    },
    title: {
        text: 'Visualized axis break'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        lineColor: 'black',
        lineWidth: 2,
        title: false,
        tickInterval: 100,
        breaks: [{
            from: 500,
            to: 3000
        }],
        events: {
            pointBreak: pointBreakColumn,
            pointOutsideOfBreak: pointOutsideOfBreak
        }
    },
    series: [{
        name: 'Attraction 1',
        data: [44, 128, 180, 345, 3050, 3590, 3840, 3630, 3120, 420, 240, 80]
    }, {
        name: 'Attraction 2',
        data: [64, 138, 164, 408, 3120, 3540, 3875, 3420, 720, 320, 160, 20]
    }]

});