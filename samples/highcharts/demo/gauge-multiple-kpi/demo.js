/**
 * In the chart render event, add icons on top of the circular shapes
 */
function renderIcons() {

    this.series.forEach(series => {
        if (!series.icon) {
            series.icon = this.renderer
                .text(
                    `<i class="fa fa-${series.options.custom.icon}"></i>`,
                    0,
                    0,
                    true
                )
                .attr({
                    zIndex: 10
                })
                .css({
                    color: series.options.custom.iconColor,
                    fontSize: '1.5em'
                })
                .add(this.series[2].group);
        }
        series.icon.attr({
            x: this.chartWidth / 2 - 15,
            y: this.plotHeight / 2 -
                series.points[0].shapeArgs.innerR -
                (
                    series.points[0].shapeArgs.r -
                    series.points[0].shapeArgs.innerR
                ) / 2 +
                8
        });
    });
}

const trackColors = Highcharts.getOptions().colors.map(color =>
    new Highcharts.Color(color).setOpacity(0.3).get()
);

Highcharts.chart('container', {

    chart: {
        type: 'solidgauge',
        height: '110%',
        events: {
            render: renderIcons
        }
    },

    title: {
        text: 'Multiple KPI gauge',
        style: {
            fontSize: '24px'
        }
    },

    tooltip: {
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        style: {
            fontSize: '16px'
        },
        valueSuffix: '%',
        pointFormat: '{series.name}<br>' +
            '<span style="font-size: 2em; color: {point.color}; ' +
            'font-weight: bold">{point.y}</span>',
        positioner: function (labelWidth) {
            return {
                x: (this.chart.chartWidth - labelWidth) / 2,
                y: (this.chart.plotHeight / 2) + 15
            };
        }
    },

    pane: {
        startAngle: 0,
        endAngle: 360,
        background: [{ // Track for Conversion
            outerRadius: '112%',
            innerRadius: '88%',
            backgroundColor: trackColors[0],
            borderWidth: 0
        }, { // Track for Engagement
            outerRadius: '87%',
            innerRadius: '63%',
            backgroundColor: trackColors[1],
            borderWidth: 0
        }, { // Track for Feedback
            outerRadius: '62%',
            innerRadius: '38%',
            backgroundColor: trackColors[2],
            borderWidth: 0
        }]
    },

    yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: []
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                enabled: false
            },
            linecap: 'round',
            stickyTracking: false,
            rounded: true
        }
    },

    series: [{
        name: 'Conversion',
        data: [{
            color: Highcharts.getOptions().colors[0],
            radius: '112%',
            innerRadius: '88%',
            y: 80
        }],
        custom: {
            icon: 'filter',
            iconColor: '#303030'
        }
    }, {
        name: 'Engagement',
        data: [{
            color: Highcharts.getOptions().colors[1],
            radius: '87%',
            innerRadius: '63%',
            y: 65
        }],
        custom: {
            icon: 'comments-o',
            iconColor: '#ffffff'
        }
    }, {
        name: 'Feedback',
        data: [{
            color: Highcharts.getOptions().colors[2],
            radius: '62%',
            innerRadius: '38%',
            y: 50
        }],
        custom: {
            icon: 'commenting-o',
            iconColor: '#303030'
        }
    }]
});
