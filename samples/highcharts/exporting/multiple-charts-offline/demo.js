

/**
 * Create a global getSVG method that takes an array of charts as an argument. The SVG is returned as an argument in the callback.
 */
Highcharts.getSVG = function (charts, options, callback) {
    var svgArr = [],
        top = 0,
        width = 0,
        addSVG = function (svgres) {
            // Grab width/height from exported chart
            var svgWidth = +svgres.match(
                    /^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/
                )[1],
                svgHeight = +svgres.match(
                    /^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/
                )[1],
                // Offset the position of this chart in the final SVG
                svg = svgres.replace('<svg', '<g transform="translate(0,' + top + ')" ');
            svg = svg.replace('</svg>', '</g>');
            top += svgHeight;
            width = Math.max(width, svgWidth);
            svgArr.push(svg);
        },
        exportChart = function (i) {
            if (i === charts.length) {
                return callback('<svg height="' + top + '" width="' + width +
                  '" version="1.1" xmlns="http://www.w3.org/2000/svg">' + svgArr.join('') + '</svg>');
            }
            charts[i].getSVGForLocalExport(options, {}, function () {
                console.log("Failed to get SVG");
            }, function (svg) {
                addSVG(svg);
                return exportChart(i + 1); // Export next only when this SVG is received
            });
        };
    exportChart(0);
};

/**
 * Create a global exportCharts method that takes an array of charts as an argument,
 * and exporting options as the second argument
 */
Highcharts.exportCharts = function (charts, options) {
    options = Highcharts.merge(Highcharts.getOptions().exporting, options);

		// Get SVG asynchronously and then download the resulting SVG
    Highcharts.getSVG(charts, options, function (svg) {
        Highcharts.downloadSVGLocal(svg, options, function () {
            console.log("Failed to export on client side");
        });
    });
};

// Set global default options for all charts
Highcharts.setOptions({
    exporting: {
        fallbackToExportServer: false // Ensure the export happens on the client side or not at all
    }
});

// Create the charts
var chart1 = Highcharts.chart('container1', {

    chart: {
        height: 200,
        type: 'pie'
    },

    title: {
        text: 'First Chart'
    },

    credits: {
        enabled: false
    },

    series: [{
        data: [
            ['Apples', 5],
            ['Pears', 9],
            ['Oranges', 2]
        ]
    }],

    exporting: {
        enabled: false // hide button
    }

});
var chart2 = Highcharts.chart('container2', {

    chart: {
        type: 'column',
        height: 200
    },

    title: {
        text: 'Second Chart'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [176.0, 135.6, 148.5, 216.4, 194.1, 95.6,
            54.4, 29.9, 71.5, 106.4, 129.2, 144.0],
        colorByPoint: true,
        showInLegend: false
    }],

    exporting: {
        enabled: false // hide button
    }

});

$('#export-png').click(function () {
    Highcharts.exportCharts([chart1, chart2]);
});

$('#export-pdf').click(function () {
    Highcharts.exportCharts([chart1, chart2], {
        type: 'application/pdf'
    });
});