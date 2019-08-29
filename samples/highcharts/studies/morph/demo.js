// Morph an SVG element into a different type of element
Highcharts.SVGElement.prototype.morph = function (shapeType, shapeArgs) {
    const getPath = shape => {
        const totalLength = shape.element.getTotalLength();
        const count = 100;
        const step = totalLength / count;
        const points = [];
        for (let i = 0; i < count; i++) {
            points.push(shape.element.getPointAtLength(i * step));
        }
        const path = points.reduce((path, point) => {
            path.push(path.length === 0 ? 'M' : 'L');
            path.push(point.x, point.y);
            return path;
        }, []);
        return path.concat('z');
    };

    const newShape = this.renderer[shapeType](shapeArgs)
        .attr({
            fill: 'none'
        })
        .add();

    const attribs = {
        fill: this.element.getAttribute('fill'),
        stroke: this.element.getAttribute('stroke'),
        'stroke-width': this.element.getAttribute('stroke-width')
    };
    const interrim = this.renderer.path(getPath(this))
        .attr(attribs)
        .add();

    this.element.remove();
    this.element = interrim.element;
    this.d = interrim.d; // For animation

    this.animate({
        d: getPath(newShape)
    }, {
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
