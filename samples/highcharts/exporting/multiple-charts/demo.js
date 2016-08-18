$(function () {

    /**
     * Create a global getSVG method that takes an array of charts as an argument
     */
    Highcharts.getSVG = function (charts) {
        var svgArr = [],
            top = 0,
            width = 0;

        $.each(charts, function (i, chart) {
            var svg = chart.getSVG();
            svg = svg.replace('<svg', '<g transform="translate(0,' + top + ')" ');
            svg = svg.replace('</svg>', '</g>');

            top += chart.chartHeight;
            width = Math.max(width, chart.chartWidth);

            svgArr.push(svg);
        });

        return '<svg height="' + top + '" width="' + width + '" version="1.1" xmlns="http://www.w3.org/2000/svg">' + svgArr.join('') + '</svg>';
    };

    /**
     * Create a global exportCharts method that takes an array of charts as an argument,
     * and exporting options as the second argument
     */
    Highcharts.exportCharts = function (charts, options) {

        // Merge the options
        options = Highcharts.merge(Highcharts.getOptions().exporting, options);

        // Post to export server
        Highcharts.post(options.url, {
            filename: options.filename || 'chart',
            type: options.type,
            width: options.width,
            svg: Highcharts.getSVG(charts)
        });
    };

    // Create charts
    var chart1 = new Highcharts.Chart({
        chart: {
            renderTo: 'container1'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });

    var chart2 = new Highcharts.Chart({
        chart: {
            renderTo: 'container2',
            type: 'column'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0]
        }]
    });

    $('#exportPNG').click(function () {
        Highcharts.exportCharts([chart1, chart2]);
    });

    $('#exportSVG').click(function () {
        Highcharts.exportCharts([chart1, chart2], { type: 'image/svg+xml' });
    });
});
