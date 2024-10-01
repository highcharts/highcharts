(function (H) {

    const {
        addEvent,
        animObject,
        Chart,
        extend,
        Series,
        seriesTypes,
        SVGElement,
        wrap
    } = H;

    class Morpher extends Highcharts.SVGElement {}

    // Morph an SVG element into a different type of element
    Highcharts.SVGElement.prototype.morph = function () {
        // Return the point that is closest to an imaginary point directly
        // above the
        // shape. To avoid rotation when morphing.
        const alignToTopPoint = (points, bBox) => {
            // Find the point that is closest to an imaginary point directly
            // above
            // the bBox.
            const topPoint = {
                x: bBox.x + bBox.width / 2,
                y: bBox.y - 100
            };
            let closestIdx;
            let closestDist = Infinity;
            for (let i = 0; i < points.length; i++) {
                const dist = Math.pow(points[i].x - topPoint.x, 2) +
                    Math.pow(points[i].y - topPoint.y, 2);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestIdx = i;
                }
            }
            // Remove the points before the top point
            const head = points.splice(0, closestIdx);
            // And apply them at the end
            points.push(...head);
        };

        const getPath = element => {
            const totalLength = element.getTotalLength(),
                count = 100,
                points = [];
            for (let i = 0; i < count; i++) {
                points.push(
                    element.getPointAtLength(i * totalLength / count)
                );
            }
            alignToTopPoint(points, element.getBBox());
            const path = points.map((point, i) => ([
                i === 0 ? 'M' : 'L',
                point.x,
                point.y
            ]));
            path.push(['Z']);
            return path;
        };

        // The element is not yet given a layout, skip it for now
        try {
            if (!this.element || this.element.getTotalLength() === 0) {
                return false;
            }
        } catch {
            return false;
        }

        // Unset
        const morphFrom = this.morphFrom;
        delete this.morphFrom;

        this.element.style.opacity = 0;

        // Add a temporary morpher path element next to this element
        setTimeout(() => {
            const morpher = new Morpher(this.renderer, 'path');
            morpher
                .attr({
                    d: getPath(morphFrom),
                    fill: this.element.getAttribute('fill'),
                    stroke: this.element.getAttribute('stroke'),
                    'stroke-width': this.element.getAttribute('stroke-width')
                })
                .add(this.parentGroup);

            morpher.animate({
                d: getPath(this.element)
            }, extend(
                animObject(this.renderer.globalAnimation),
                {
                    complete: () => {
                        this.element.style.opacity = 1;
                        morpher.destroy();
                        morphFrom.remove();
                    }
                }
            ));


            morphFrom.style.opacity = 0;
        }, 0);
    };

    SVGElement.prototype.sleep = function (key) {
        this.renderer.sleeping[key] = this.element;
    };

    const getSleepKey = point => [
        'point',
        point.series.name || point.series.index,
        point.x
    ].join(',');

    addEvent(Chart, 'afterGetContainer', e => {
        e.target.renderer.sleeping = {};
        e.target.renderer.sleepKeyQueue = [];
    });

    addEvent(SVGElement, 'afterInit', function () {
        if (!(this instanceof Morpher) && this.renderer.sleepKeyQueue) {
            const sleepKey = this.renderer.sleepKeyQueue.shift();

            // Wake up existing element with the same key
            if (sleepKey) {
                this.morphFrom = this.renderer.sleeping[sleepKey];
            }
        }
    });

    wrap(SVGElement.prototype, 'afterSetters', function (proceed) {
        proceed.call(this);
        if (this.element && this.morphFrom && this.morph) {
            this.morph();
        }
    });

    // Points
    const wrapDrawPoints = function (proceed) {
        this.points.forEach(point => {
            this.chart.renderer.sleepKeyQueue.push(getSleepKey(point));
        });

        proceed.call(this);

        this.points.forEach(point => {
            const { graphic } = point;
            if (graphic) {
                graphic.destroy = () => {
                    graphic.sleep(getSleepKey(point));
                    delete graphic.element;
                    SVGElement.prototype.destroy.call(graphic);
                };
            }
        });
    };
    wrap(seriesTypes.column.prototype, 'drawPoints', wrapDrawPoints);
    wrap(seriesTypes.pie.prototype, 'drawPoints', wrapDrawPoints);
    wrap(Series.prototype, 'drawPoints', wrapDrawPoints);

    // Ticks
    /*
    wrap(Tick.prototype, 'renderGridLine', function (proceed) {
        const axis = this.axis,
            chart = axis.chart,
            index = chart[axis.coll].indexOf(axis),
            sleepKey = `gridline-${this.axis.coll}-${index}-${this.pos}`;

        this.axis.chart.renderer.sleepKeyQueue.push(sleepKey);

        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        const svgElement = this.gridLine;
        if (svgElement) {
            svgElement.destroy = () => {
                svgElement.sleep(sleepKey);
                delete svgElement.element;
                SVGElement.prototype.destroy.call(svgElement);
            };
        }
    });
    wrap(Tick.prototype, 'renderMark', function (proceed) {
        const axis = this.axis,
            chart = axis.chart,
            index = chart[axis.coll].indexOf(axis),
            sleepKey = `tickmark-${this.axis.coll}-${index}-${this.pos}`;

        this.axis.chart.renderer.sleepKeyQueue.push(sleepKey);

        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        const svgElement = this.mark;
        if (svgElement) {
            svgElement.destroy = () => {
                svgElement.sleep(sleepKey);
                delete svgElement.element;
                SVGElement.prototype.destroy.call(svgElement);
            };
        }
    });
    */

    addEvent(Chart, 'redraw', e => {
        const sleeping = e.target.renderer.sleeping;
        Object.keys(sleeping).forEach(key => {
            delete sleeping[key];
        });
        e.target.renderer.sleepKeyQueue.length = 0;

    });
}(Highcharts));

// /////////////////////////////////////////////////////////////////////////////

const chart = Highcharts.chart('container', {
    chart: {
        animation: {
            duration: 1000
        }
    },
    title: {
        text: 'Morphed chart'
    },
    accessibility: {
        enabled: false
    },
    colors: ['#cad2c5', '#84a98c', '#52796f', '#354f52'],
    xAxis: {
        showEmpty: false
    },
    yAxis: {
        showEmpty: false
    },
    series: [{
        type: 'column',
        data: [1, 3, 2, 4],
        colorByPoint: true
    }]
});

document
    .querySelector('#button-group-types')
    .querySelectorAll('button')
    .forEach(button => {
        button.addEventListener('click', () => {
            chart.series[0].update({ type: button.dataset.type }, false);
            chart.redraw();
        });
    });

document.getElementById('non-inverted')
    .addEventListener('click', () => {
        chart.update({
            chart: {
                inverted: false
            }
        });
    });


document.getElementById('inverted')
    .addEventListener('click', () => {
        chart.update({
            chart: {
                inverted: true
            }
        });
    });

document.getElementById('non-polar')
    .addEventListener('click', () => {
        chart.update({
            chart: {
                polar: false
            }
        });
    });


document.getElementById('polar')
    .addEventListener('click', () => {
        chart.update({
            chart: {
                polar: true
            }
        });
    });
