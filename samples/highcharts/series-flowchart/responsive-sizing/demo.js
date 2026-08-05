// A flowchart fits itself to the plot area one axis at a time, and the two
// buttons below make that easy to see by halving one dimension at a time.
//
// Stage 1, space. Each axis' gap is set to the widest that still fits: it opens
// up to fill a plot area with room to spare and closes down to a floor when
// room runs short. The two are resolved separately, since the gap within a
// layer only moves the width and the gap between layers only the height - so
// halving the height closes the rows up while the columns spread out to take
// the width that is going spare, and halving the width does the reverse.
//
// Stage 2, wrap. When the width runs out - which is what happens first, since
// a flowchart grows downwards - the labels wrap onto another line. That trades
// height, which a narrow chart has spare, for the width it has run out of, and
// keeps the text at full size where shrinking would not. Watch the boxes turn
// narrow and tall as the width is halved.
//
// Stage 3, shrink. Only once wrapping and tightening are spent does the whole
// diagram scale on a single factor - node boxes, gaps, label text and
// arrowheads together - so the proportions hold. Halve both dimensions to get
// here.
//
// The readout reports the active stage, the shrink factor, the two gaps, and
// how much of each axis the diagram covers - the number the fit is working to
// keep near 1 on both axes at once.

const BASE_WIDTH = 900,
    BASE_HEIGHT = 640;

const chart = Highcharts.chart('container', {

    chart: {
        type: 'flowchart',
        width: BASE_WIDTH,
        height: BASE_HEIGHT,
        events: {
            // Reported after every render, so the numbers always describe what
            // is on screen - including the first draw.
            render: function () {
                updateReadout(this);
            }
        }
    },

    title: {
        text: 'Responsive sizing: space, wrap, then shrink'
    },

    subtitle: {
        text: 'Halve one dimension at a time - each axis is fitted on its own'
    },

    series: [{
        name: 'Connections',

        // Long names, so node widths differ enough for the spacing to matter.
        nodes: [
            { id: 'Start', shape: 'oval' },
            { id: 'Receive', shape: 'parallelogram', name: 'Receive order' },
            { id: 'Stock', shape: 'cylinder', name: 'Check inventory' },
            { id: 'InStock', shape: 'diamond', name: 'In stock?' },
            { id: 'Backorder', shape: 'hexagon', name: 'Backorder item' },
            { id: 'Pay', shape: 'subroutine', name: 'Process payment' },
            { id: 'PayOk', shape: 'diamond', name: 'Payment valid?' },
            { id: 'Retry', name: 'Request retry' },
            { id: 'Cancel', name: 'Cancel order' },
            { id: 'Ship', name: 'Ship item' },
            { id: 'Notify', shape: 'document', name: 'Notify customer' },
            { id: 'End', shape: 'oval', name: 'Order closed' }
        ],

        data: [
            ['Start', 'Receive'],
            ['Receive', 'Stock'],
            ['Stock', 'InStock'],
            ['InStock', 'Pay', 'Yes'],
            ['InStock', 'Backorder', 'No'],
            ['Backorder', 'Stock', 'Restocked'],
            ['Backorder', 'Cancel', 'Unable'],
            ['Pay', 'PayOk'],
            ['PayOk', 'Ship', 'Yes'],
            ['PayOk', 'Retry', 'No'],
            ['Retry', 'Pay', 'Retry'],
            ['Retry', 'Cancel', 'Give up'],
            ['Cancel', 'End'],
            ['Ship', 'Notify'],
            ['Notify', 'End']
        ]
    }]
});

// Which dimensions are currently halved.
const halved = { width: false, height: false };

/**
 * The narrowest gap in each direction, and how much of each axis the diagram
 * covers. Nodes are grouped by their row, since a row is the set the layout
 * keeps apart horizontally and rows are what it keeps apart vertically.
 * @param {Highcharts.Series} series The flowchart series.
 * @return {Object} Gaps in pixels (NaN when there is no pair to measure) and
 *         the covered fraction of each axis.
 */
function geometry(series) {
    const chart = series.chart,
        rows = {};

    let x0 = Infinity,
        x1 = -Infinity,
        y0 = Infinity,
        y1 = -Infinity;

    series.nodes.forEach(node => {
        const row = Math.round(node.plotY);
        (rows[row] = rows[row] || []).push(node);

        x0 = Math.min(x0, node.plotX - node.shapeWidth / 2);
        x1 = Math.max(x1, node.plotX + node.shapeWidth / 2);
        y0 = Math.min(y0, node.plotY - node.shapeHeight / 2);
        y1 = Math.max(y1, node.plotY + node.shapeHeight / 2);
    });

    const keys = Object.keys(rows).map(Number).sort((a, b) => a - b);

    let gapX = Infinity,
        gapY = Infinity;

    keys.forEach(row => {
        const nodes = rows[row].slice().sort((a, b) => a.plotX - b.plotX);

        for (let i = 0; i < nodes.length - 1; i++) {
            gapX = Math.min(
                gapX,
                (nodes[i + 1].plotX - nodes[i + 1].shapeWidth / 2) -
                (nodes[i].plotX + nodes[i].shapeWidth / 2)
            );
        }
    });

    for (let i = 0; i < keys.length - 1; i++) {
        const below = Math.max(
                ...rows[keys[i]].map(n => n.plotY + n.shapeHeight / 2)
            ),
            above = Math.min(
                ...rows[keys[i + 1]].map(n => n.plotY - n.shapeHeight / 2)
            );

        gapY = Math.min(gapY, above - below);
    }

    return {
        gapX: gapX === Infinity ? NaN : gapX,
        gapY: gapY === Infinity ? NaN : gapY,
        usedX: (x1 - x0) / chart.plotWidth,
        usedY: (y1 - y0) / chart.plotHeight
    };
}

/**
 * Report the size, the stage and the numbers behind it.
 * @param {Highcharts.Chart} target The chart being reported on.
 * @return {void}
 */
function updateReadout(target) {
    const series = target.series[0],
        readout = document.getElementById('readout');

    if (!readout || !series || !series.nodes.length) {
        return;
    }

    const scale = series.layoutScale,
        cap = series.labelWidth,
        g = geometry(series),
        // The furthest stage reached. A label cap means the text was wrapped to
        // buy width; a shrink factor below 1 means that was not enough either.
        // The two stack, so the cap is reported alongside rather than replaced.
        stage = scale < 1 ? 'shrinking' : (cap ? 'wrapping' : 'spacing');

    readout.innerHTML = [
        Math.round(target.chartWidth) + ' x ' + Math.round(target.chartHeight),
        '<span class="stage-' + stage + '">' + stage + '</span>',
        'scale ' + scale.toFixed(3),
        'wrap ' + (cap ? cap + 'px' : 'none'),
        'gap ' + (isNaN(g.gapX) ? 'n/a' : g.gapX.toFixed(0)) + '/' +
            (isNaN(g.gapY) ? 'n/a' : g.gapY.toFixed(0)) + 'px',
        'fills ' + g.usedX.toFixed(2) + '/' + g.usedY.toFixed(2)
    ].join(' &middot; ');
}

/**
 * Apply the current toggle state. Both dimensions are always passed, so
 * neither button has to know what the other one did.
 * @return {void}
 */
function resize() {
    chart.setSize(
        halved.width ? BASE_WIDTH / 2 : BASE_WIDTH,
        halved.height ? BASE_HEIGHT / 2 : BASE_HEIGHT,
        // Instant, not animated: the point is to compare two settled layouts,
        // and a tween would show shapes part-way to their new size while their
        // labels have already been re-aligned to the final one.
        false
    );
}

[
    ['halve-width', 'width'],
    ['halve-height', 'height']
].forEach(([id, dimension]) => {
    const button = document.getElementById(id);

    button.addEventListener('click', () => {
        halved[dimension] = !halved[dimension];
        button.setAttribute('aria-pressed', String(halved[dimension]));
        button.textContent =
            (halved[dimension] ? 'Restore the ' : 'Halve the ') + dimension;
        resize();
    });

    button.setAttribute('aria-pressed', 'false');
});
