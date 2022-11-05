// Morph an SVG element into a different type of element
Highcharts.SVGElement.prototype.morph = function (
    shapeType,
    symbolName,
    shapeArgs
) {
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

    if (!this.newShape) {
        const newShape = symbolName ?
            this.renderer.symbol(symbolName)
                .attr(shapeArgs) :
            this.renderer[shapeType](shapeArgs);

        newShape
            .attr({
                fill: 'none'
            })
            .add(this.parentGroup);
        this.newShape = newShape;
    } else {
        this.newShape.attr(shapeArgs);
    }

    if (this.newShape.element.getTotalLength() === 0) {
        return false;
    }

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
        d: getPath(this.newShape)
    }, {
        duration: 1000,
        complete: () => {
            this.newShape.attr(attribs);
            this.element = this.newShape.element;
            interrim.destroy();
            delete this.newShape.element;
            this.newShape = this.newShape.destroy();
        }
    });

    // Chainable
    return this;
};

Highcharts.SVGElement.prototype.sleep = function (key) {
    this.renderer.sleeping[key] = this;
};

Highcharts.SVGRenderer.prototype.awake = function (
    sleepKey,
    shapeType,
    symbolName
) {
    const zombie = this.sleeping[sleepKey];
    if (zombie) {
        zombie.attr = attribs => {
            if (zombie.morph(shapeType, symbolName, attribs) !== false) {
                delete zombie.attr;
            }
            return zombie;
        };
    }
    delete this.sleeping[sleepKey];
    return zombie;
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

    wrap(Point.prototype, 'destroy', function (proceed) {
        this.graphic.sleep(getSleepKey(this));
        delete this.graphic;
        proceed.call(this);
    });

    const beforeDrawPoints = function (proceed) {
        this.points.forEach(point => {
            const key = getSleepKey(point),
                zombie = this.chart.renderer.awake(
                    key,
                    point.shapeType,
                    this.symbol
                );
            if (zombie) {
                point.graphic = zombie.add(this.group);
            }

            point.hasNewShapeType = () => false;
        });

        proceed.call(this);
    };
    wrap(seriesTypes.column.prototype, 'drawPoints', beforeDrawPoints);
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

// /////////////////////////////////////////////////////////////////////////////

const chart = Highcharts.chart('chart-container', {
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
            chart.series[0].update({ type: button.dataset.type });
        });
    });

// /////////////////////////////////////////////////////////////////////////////

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
        .morph('circle', undefined, {
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
        .morph('rect', undefined, {
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
        .morph('rect', undefined, {
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
        .morph('circle', undefined, {
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
        .morph(undefined, 'arc', {
            x: 200,
            y: 50,
            width: 100,
            height: 100,
            innerR: 0,
            r: 100,
            start: 0.2,
            end: 0.9
        })
        .animate({
            stroke: 'rgb(0,128,128)',
            fill: 'rgba(0,128,128,0.3)'
        });
});
