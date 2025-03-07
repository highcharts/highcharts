// Experimental support `foreignObject`. This will resolve all z-index issues.
Highcharts.HTMLElement.useForeignObject = true;

/*
const ren = new Highcharts.Renderer(
    document.getElementById('container'),
    600,
    400
);

ren.circle(100, 100, 3)
    .attr({
        fill: '#2caffe'
    })
    .add();

ren.text('Hello there', 100, 100, true)
    .attr({
        align: 'center',
        // rotation: -45
    })
    .add();
// */

//*
Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'HTML title <i class="fa fa-check"></i>',
        useHTML: true
    },

    subtitle: {
        text: 'HTML subtitle <i class="fa fa-check"></i>',
        useHTML: true
    },

    yAxis: {
        title: {
            text: 'HTML y-axis <i class="fa fa-check"></i>',
            useHTML: true
        }
    },

    xAxis: {
        type: 'category',
        labels: {
            useHTML: true,
            format: '{value} <i class="fa fa-check"></i>'
        }
    },

    legend: {
        useHTML: true
    },

    tooltip: {
        useHTML: true
    },

    series: [{
        data: [
            ['Ein', 1234],
            ['To', 3456],
            ['Tre', 2345],
            ['Fire', 4567]
        ],
        dataLabels: {
            enabled: true,
            useHTML: true,
            format: '{y} <i class="fa fa-check"></i>'
        },
        name: 'HTML Series <i class="fa fa-check"></i>'
    }],

    exporting: {
        allowHTML: true
    }

});
// */