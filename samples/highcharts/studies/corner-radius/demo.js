(function (H) {
    const relativeLength = H.relativeLength;

    H.wrap(H.seriesTypes.column.prototype, 'translate', function (proceed) {
        proceed.call(this);

        const reversed = this.yAxis.options.reversed;

        this.points.forEach(point => {
            const { width, height, x, y } = point.shapeArgs;

            // Get the radius
            const r = Math.min(
                    relativeLength(this.options.cornerRadius, width),
                    width / 2
                ),
                flip = (point.negative ? -1 : 1) * (reversed ? -1 : 1) === -1,
                rTop = flip ? 0 : r,
                rBtm = flip ? r : 0;

            if (r) {

                /*

                The naming of control points:

                  / a -------- b \
                 /                \
                h                  c
                |                  |
                |                  |
                |                  |
                g                  d
                 \                /
                  \ f -------- e /

                */

                const a = [x + rTop, y],
                    b = [x + width - rTop, y],
                    c = [x + width, y + rTop],
                    d = [x + width, y + height - rBtm],
                    e = [x + width - rBtm, y + height],
                    f = [x + rBtm, y + height],
                    g = [x, y + height - rBtm],
                    h = [x, y + rTop];

                // Column is lower than the radius
                if (height < rTop) {
                    // Apply Pythagoras
                    const altitude = rTop - height,
                        base = Math.sqrt(
                            Math.pow(rTop, 2) - Math.pow(altitude, 2)
                        );
                    c[0] = d[0] = x + width - rTop + base;
                    e[0] = Math.min(c[0], e[0]);
                    f[0] = Math.max(d[0], f[0]);
                    g[0] = h[0] = x + rTop - base;
                    c[1] = h[1] = y + height;
                }

                if (height < rBtm) {
                    const altitude = rBtm - height,
                        base = Math.sqrt(
                            Math.pow(rBtm, 2) - Math.pow(altitude, 2)
                        );
                    c[0] = d[0] = x + width - rBtm + base;
                    b[0] = Math.min(c[0], b[0]);
                    a[0] = Math.max(d[0], a[0]);
                    g[0] = h[0] = x + rBtm - base;
                    d[1] = g[1] = y;

                }

                // Preserve the box for data labels
                point.dlBox = point.shapeArgs;

                point.shapeType = 'path';
                point.shapeArgs = {
                    d: [
                        ['M', ...a],
                        // top side
                        ['L', ...b],
                        // top right corner
                        ['A', rTop, rTop, 0, 0, 1, ...c],
                        // right side
                        ['L', ...d],
                        // bottom right corner
                        ['A', rBtm, rBtm, 0, 0, 1, ...e],
                        // bottom side
                        ['L', ...f],
                        // bottom left corner
                        ['A', rBtm, rBtm, 0, 0, 1, ...g],
                        // left side
                        ['L', ...h],
                        // top left corner
                        ['A', rTop, rTop, 0, 0, 1, ...a],
                        ['Z']
                    ]
                };
            }

        });
    });
}(Highcharts));


Highcharts.chart('container', {
    xAxis: {
        categories: ['Apples', 'Pears', 'Bananas', 'Oranges']
    },
    accessibility: {
        enabled: false
    },
    title: {
        text: 'Highcharts with rounded corners'
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            colorByPoint: true,
            cornerRadius: '50%',
            borderWidth: 2,
            borderColor: '#333',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [{
        data: [50, -50, 500, -300],
        type: 'column'
    }],
    colors: ["#d7bfff", "#af80ff", "#5920b9", "#48208b"]
});
