const container = document.getElementById('container');

const width = 30,
    height = 30;

const specificOptions = {
    arc: {
        start: 0,
        end: Math.PI
    },
    bottombutton: {
        r: 7
    },
    callout: {
        anchorX: width / 2,
        anchorY: height + 10,
        r: 7
    },
    circlepin: {
        anchorX: width / 2,
        anchorY: height + 10
    },
    connector: {
        anchorX: 0,
        anchorY: height + 20
    },
    flag: {
        anchorX: 0,
        anchorY: height + 10
    },
    roundedRect: {
        r: 7
    },
    squarepin: {
        anchorX: width / 2,
        anchorY: height + 10
    },
    topbutton: {
        r: 7
    }
};

Object.keys(Highcharts.SVGRenderer.prototype.symbols)
    .sort()
    .forEach(symbol => {
        const div = container.appendChild(
            Object.assign(document.createElement('div'), {
                className: 'symbol-div'
            })
        );

        // Title
        div.appendChild(
            Object.assign(document.createElement('div'), {
                innerText: symbol,
                className: 'symbol-title'
            })
        );

        // Symbol
        const // Leave some padding around the symbol, some of them go outside
            // the box
            padding = 45;

        const renderer = new Highcharts.SVGRenderer(
            div,
            width + 2 * padding,
            height + 2 * padding
        );

        // The box
        renderer.rect(
            padding,
            padding,
            width,
            height
        ).attr({
            stroke: '#8884',
            'stroke-width': 1
        }).add();

        // The symbol
        renderer.symbol(
            symbol,
            0,
            0,
            width,
            height,
            specificOptions[symbol]
        )
            .translate(padding, padding)
            .attr({
                fill: '#2caffe88',
                stroke: 'var(--highcharts-neutral-color-100)',
                'stroke-width': 1
            }).add();
    });
