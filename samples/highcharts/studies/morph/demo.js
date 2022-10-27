// Morph an SVG element into a different type of element
Highcharts.SVGElement.prototype.morph = function (shapeType, shapeArgs) {
    // Return the point that is closest to an imaginary point directly above the
    // shape. To avoid rotation when morphing.
    const alignToTopPoint = (points, bBox) => {
        // Find the point that is closest to an imaginary point directly above
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

    const getPath = shape => {
        const totalLength = shape.element.getTotalLength();
        const count = 100;
        const points = [];
        for (let i = 0; i < count; i++) {
            points.push(
                shape.element.getPointAtLength(i * totalLength / count)
            );
        }
        alignToTopPoint(points, shape.element.getBBox());
        const path = points.map((point, i) => ([
            i === 0 ? 'M' : 'L',
            point.x,
            point.y
        ]));
        path.push(['Z']);
        return path;
    };

    const newShape = this.renderer[shapeType](shapeArgs)
        .attr({
            fill: 'none'
        })
        .add(this.parentGroup);

    const attribs = {
        fill: this.element.getAttribute('fill'),
        stroke: this.element.getAttribute('stroke'),
        'stroke-width': this.element.getAttribute('stroke-width')
    };
    const interrim = this.renderer.path(getPath(this))
        .attr(attribs)
        .add(this.parentGroup);

    this.element.remove();

    interrim.animate({
        d: getPath(newShape)
    }, {
        duration: 1000,
        complete: () => {
            newShape.attr(attribs);
            this.element = newShape.element;
            interrim.destroy();
            delete newShape.element;
            newShape.destroy();
        }
    });

    // Chainable
    return this;
};


(function (H) {
    const { addEvent, Chart, Point, Series, seriesTypes, wrap } = H;

    const getSleepKey = point => [
        'point',
        point.series.name || point.series.index,
        point.x
    ].join(',');

    addEvent(Chart, 'afterGetContainer', e => {
        e.target.renderer.sleeping = {};
    });

    wrap(Point.prototype, 'destroy', function () {
        this.series.chart.renderer.sleeping[
            getSleepKey(this)
        ] = this.graphic;
        delete this.graphic;
    });

    const beforeDrawPoints = function (proceed) {
        const sleeping = this.chart.renderer.sleeping;

        this.points.forEach(point => {
            const key = getSleepKey(point),
                zombie = sleeping[key];

            if (zombie) {
                point.graphic = zombie.add(this.group);

                zombie.attr = attribs => {
                    zombie.morph(point.shapeType, attribs);
                    delete zombie.attr;
                };
            }
            delete sleeping[key];

            point.hasNewShapeType = () => false;
        });

        proceed.call(this);
    };
    wrap(seriesTypes.pie.prototype, 'drawPoints', beforeDrawPoints);
    wrap(Series.prototype, 'drawPoints', beforeDrawPoints);

    addEvent(Chart, 'redraw', e => {
        const sleeping = e.target.renderer.sleeping;
        Object.keys(sleeping).forEach(key => {
            sleeping[key].destroy();
            delete sleeping[key];
        });

    });
}(Highcharts));


const ren = new Highcharts.Renderer(
    document.getElementById('container'),
    600,
    400
);

const shape = ren.circle(100, 100, 50)
    .attr({
        stroke: 'rgb(255,0,0)',
        'stroke-width': '2px',
        fill: 'rgba(255,0,0,0.3)'
    })
    .add();

document.getElementById('circle').addEventListener('click', () => {
    shape
        .morph('circle', {
            x: 100,
            y: 100,
            r: 50
        })
        .animate({
            stroke: 'rgb(255,0,0)',
            fill: 'rgba(255,0,0,0.3)'
        });
});

document.getElementById('column').addEventListener('click', () => {
    shape
        .morph('rect', {
            x: 100,
            y: 100,
            width: 10,
            height: 100
        })
        .animate({
            stroke: 'rgb(0,0,255)',
            fill: 'rgba(0,0,255,0.3)'
        });
});

document.getElementById('bar').addEventListener('click', () => {
    shape
        .morph('rect', {
            x: 150,
            y: 50,
            width: 100,
            height: 20
        })
        .animate({
            stroke: 'rgb(0,0,255)',
            fill: 'rgba(0,0,255,0.3)'
        });
});

document.getElementById('marker').addEventListener('click', () => {
    shape
        .morph('circle', {
            x: 200,
            y: 300,
            r: 3
        })
        .animate({
            stroke: 'rgb(0,255,0)',
            fill: 'rgba(0,255,0,0.3)'
        });
});

document.getElementById('arc').addEventListener('click', () => {
    shape
        .morph('path', Highcharts.SVGRenderer.prototype.symbols.arc(
            200,
            50,
            100,
            100,
            {
                innerR: 0,
                r: 100,
                start: 0.2,
                end: 0.9
            }
        ))
        .animate({
            stroke: 'rgb(0,128,128)',
            fill: 'rgba(0,128,128,0.3)'
        });
});

const chart = Highcharts.chart('chart-container', {
    title: {
        text: 'Morphed chart'
    },
    colors: ['#cad2c5', '#84a98c', '#52796f', '#354f52'],
    series: [{
        type: 'column',
        data: [1, 3, 2, 4],
        colorByPoint: true
    }]
});

setTimeout(() => {
    chart.series[0].update({ type: 'pie' });
}, 1234);
