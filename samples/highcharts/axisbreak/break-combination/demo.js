$(function () {

    function breakEffect(axis, point, path, color) {
        var renderer = axis.chart.renderer,
            brkLine = point.brkLine;

        if (!brkLine) {
            point.brkLine = brkLine = renderer.path(path)
                .attr({
                    'stroke-width': 1,
                    stroke: color,
                    fill: color
                }).add(point.graphic.parentGroup);
        } else {
            brkLine.attr({
                d: path
            });
        }
    }
    function pointBreak(item) {
        var point = item.point,
            brk = item.brk,
            axis = this,
            sA = point.shapeArgs,
            x = sA.x,
            y = axis.toPixels(brk.to) - axis.top + 1,
            h = axis.toPixels(brk.from) - axis.toPixels(brk.to) - 2,
            w = sA.width,
            path = ['M', x, y, 'L', x + w, y + h, x + w, y, 'L', x, y + h, 'Z'];

        breakEffect(this, point, path, '#F0F0F0');
    }

    function pointInBreak(item) {
        var point = item.point,
            brk = item.brk,
            axis = this,
            sA = point.shapeArgs,
            x = sA.x + 0.5,
            y = axis.toPixels(brk.to) - axis.top + 1,
            h = axis.toPixels(brk.from) - axis.toPixels(brk.to),
            w = sA.width - 1,
            path = ['M', x, y + h, 'L', x + (w / 2), y + (h / 2), 'L', x + w, y + h, 'Z'];

        breakEffect(this, point, path, point.color || point.series.color);
    }

    $('#container').highcharts({
        chart: {
            animation: false,
            type: 'column'
        },
        title: {
            text: 'Chart with a more elaborate break effect'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: false,
            tickInterval: 100,
            breaks: [{
                from: 500,
                to: 3000,
                breakSize: 100
            }],
            plotBands: [{
                from: 500,
                to: 3000,
                color: '#F0F0F0'
            }],
            events: {
                pointBreak: pointBreak,
                pointInBreak: pointInBreak
            }
        },
        plotOptions: {
            series: {
                animation: false
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
});