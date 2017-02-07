

var chart = Highcharts.chart('container', {

    chart: {
        animation: false
    },

    title: {
        text: 'Relative fonts and lines'
    },

    subtitle: {
        text: 'Use the slider below the chart to set top-level font size'
    },

    xAxis: {
        categories: ['Rain', 'Snow', 'Sun', 'Wind']
    },

    series: [{
        data: [324, 124, 547, 221],
        type: 'column'
    }, {
        data: [698, 675, 453, 543]
    }]

});


$('#em').on('input', function () {
    chart.container.style.fontSize = this.value + 'em';

    // Update layout based on new font and line sizes
    chart.isDirtyLegend = true;
    chart.redraw(false);
});