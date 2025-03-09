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
        rotation: -22.5
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
        // text: 'HTML subtitle <i class="fa fa-check"></i>',
        text: `<table>
            <tr><th>This</th><td>is</td></tr>
            <tr><th>a</th><td>table</td></tr>
        </table>`,
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
            format: '{value} <i class="fa fa-check"></i>',
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },

    legend: {
        useHTML: true
    },

    tooltip: {
        useHTML: true,
        footerFormat: `<table>
            <tr><th>This</th><td>is</td></tr>
            <tr><th>a</th><td>table</td></tr>
        </table>`
    },

    series: [{
        data: [
            ['Ein', 1234],
            ['To', 4567],
            ['Tre', 2345],
            ['Fire', 3456]
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