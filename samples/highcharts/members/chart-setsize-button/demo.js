$(function () {
    var $container = $('#container'),
        chart,
        origChartWidth = 400,
        origChartHeight = 300,
        chartWidth = origChartWidth,
        chartHeight = origChartHeight;

    $container.highcharts({

        chart: {
            width: 400,
            height: 300
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });

    // create some buttons to test the resize logic
    chart = $container.highcharts();

    $('<button>+</button>').insertBefore($container).click(function () {
        chartWidth *= 1.1;
        chartHeight *= 1.1;
        chart.setSize(chartWidth, chartHeight);
    });
    $('<button>-</button>').insertBefore($container).click(function () {
        chartWidth *= 0.9;
        chartHeight *= 0.9;
        chart.setSize(chartWidth, chartHeight);
    });
    $('<button>1:1</button>').insertBefore($container).click(function () {
        chartWidth = origChartWidth;
        chartHeight = origChartHeight;
        chart.setSize(origChartWidth, origChartHeight);
    });
});