/**
 * Create a global getSVG method that takes an array of charts as an
 * argument
 */
Highcharts.getSVG = function (charts) {
    let top = 0;
    let width = 0;

    const groups = charts.map(chart => {
        let svg = chart.exporting.getSVG();
        // Get width/height of SVG for export
        const svgWidth = +svg.match(
            /^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/
        )[1];
        const svgHeight = +svg.match(
            /^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/
        )[1];

        svg = svg
            .replace(
                '<svg',
                '<g transform="translate(0,' + top + ')" '
            )
            .replace('</svg>', '</g>');

        top += svgHeight;
        width = Math.max(width, svgWidth);

        return svg;
    }).join('');

    return `<svg height="${top}" width="${width}" version="1.1"
        xmlns="http://www.w3.org/2000/svg">
            ${groups}
        </svg>`;
};

/**
 * Create a global exportCharts method that takes an array of charts as an
 * argument, and exporting options as the second argument
 */
Highcharts.exportCharts = async function (charts, options) {

    // Merge the options
    options = Highcharts.merge(Highcharts.getOptions().exporting, options);

    // Post to export server
    await Highcharts.post(options.url, {
        filename: options.filename || 'chart',
        type: options.type,
        width: options.width,
        svg: Highcharts.getSVG(charts)
    });
};

const chart1 = Highcharts.chart('container1', {

    chart: {
        height: 200
    },

    title: {
        text: 'First Chart'
    },

    credits: {
        enabled: false
    },

    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
    },

    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0,
            135.6, 148.5, 216.4, 194.1, 95.6, 54.4
        ],
        showInLegend: false
    }],

    exporting: {
        enabled: false // hide button
    }

});

const chart2 = Highcharts.chart('container2', {

    chart: {
        type: 'column',
        height: 200
    },

    title: {
        text: 'Second Chart'
    },

    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
    },

    series: [{
        data: [
            176.0, 135.6, 148.5, 216.4, 194.1, 95.6,
            54.4, 29.9, 71.5, 106.4, 129.2, 144.0
        ],
        colorByPoint: true,
        showInLegend: false
    }],

    exporting: {
        enabled: false // hide button
    }

});

document.getElementById('export-png').addEventListener('click', async () =>
    await Highcharts.exportCharts([chart1, chart2])
);

document.getElementById('export-pdf').addEventListener('click', async () =>
    await Highcharts.exportCharts([chart1, chart2], {
        type: 'application/pdf'
    })
);
