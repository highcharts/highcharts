/**
 * Corner radius for column charts
 *
 * @todo
 * - Stacks, refactor math for reuse of top and bottom logic
 * - Optionally round only end or also base of the stack
 * - Columnrange, both ends rounded
 * - What next? Core inclusion, separate module or update the featured plugin?
 */

(function (H) {
    const relativeLength = H.relativeLength;

    H.wrap(H.seriesTypes.column.prototype, 'translate', function (proceed) {
        proceed.call(this);

        const yAxis = this.yAxis,
            reversed = yAxis.options.reversed;

        for (const point of this.points) {
            const { width, height, x, y } = point.shapeArgs;

            let stackY = y,
                stackHeight = height;
            if (point.stackTotal) {
                const stackEnd = yAxis.translate(
                        point.stackTotal, false, true, false, true
                    ),
                    stackThreshold = yAxis.translate(
                        this.options.threshold, false, true, false, true
                    ),
                    box = this.crispCol(
                        0,
                        Math.min(stackEnd, stackThreshold),
                        0,
                        Math.abs(stackEnd - stackThreshold)
                    );
                stackY = box.y;
                stackHeight = box.height;
            }

            // Get the radius
            const r = Math.min(
                    relativeLength(this.options.cornerRadius, width),
                    width / 2
                ) || 0,
                flip = (point.negative ? -1 : 1) * (reversed ? -1 : 1) === -1;
            let rTop = flip ? 0 : r,
                rBtm = flip ? r : 0;

            // Deep in stack, cancel rounding
            if (rTop && rTop < y - stackY) {
                rTop = 0;
            }
            if (rBtm && rBtm < (stackY + stackHeight) - (y + height)) {
                rBtm = 0;
            }


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

            // Inside stacks, cut off part of the top
            const cutTop = rTop && y - stackY;
            if (cutTop) {
                // Apply Pythagoras
                const altitude = rTop - cutTop,
                    base = Math.sqrt(
                        Math.pow(rTop, 2) - Math.pow(altitude, 2)
                    );
                a[0] -= base;
                b[0] += base;
                c[1] = h[1] = y + rTop - cutTop;
            }

            // Column is lower than the radius. Cut off bottom inside the top
            // radius.
            if (height < rTop - cutTop) {
                // Apply Pythagoras
                const altitude = rTop - cutTop - height,
                    base = Math.sqrt(
                        Math.pow(rTop, 2) - Math.pow(altitude, 2)
                    );
                c[0] = d[0] = x + width - rTop + base;
                e[0] = Math.min(c[0], e[0]);
                f[0] = Math.max(d[0], f[0]);
                g[0] = h[0] = x + rTop - base;
                c[1] = h[1] = y + height;
            }

            // Inside stacks, cut off part of the bottom
            const cutBtm = rBtm && (stackY + stackHeight) - (y + height);
            if (cutBtm) {
                // Apply Pythagoras
                const altitude = rBtm - cutBtm,
                    base = Math.sqrt(
                        Math.pow(rBtm, 2) - Math.pow(altitude, 2)
                    );
                e[0] += base;
                f[0] -= base;
                d[1] = g[1] = y + height - rBtm + cutBtm;
            }

            // Cut off top inside the bottom radius
            if (height < rBtm - cutBtm) {
                const altitude = rBtm - cutBtm - height,
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
}(Highcharts));


const chart = Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
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
            cornerRadius: '50%',
            borderWidth: 2,
            borderColor: '#666',
            dataLabels: {
                enabled: true
            },
            stacking: 'normal'
        }
    },
    series: [{
        data: [50, -50, 500, -90]
    }, {
        data: [50, 250, 260, -50]
    }, {
        data: [150, 20, 30, -120]
    }],
    colors: ["#d7bfff", "#af80ff", "#5920b9", "#48208b"]
});


document.querySelectorAll('button.corner-radius').forEach(btn => {
    btn.addEventListener(
        'click',
        () => {
            chart.update({
                plotOptions: {
                    series: {
                        cornerRadius: btn.dataset.value
                    }
                }
            });
        }
    );
});

document.querySelectorAll('button.chart-type').forEach(btn => {
    btn.addEventListener(
        'click',
        () => {
            chart.update({
                chart: {
                    type: btn.dataset.value
                }
            });
        }
    );
});
