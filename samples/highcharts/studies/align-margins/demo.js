/**
 * Highcharts plugin to allow alignment of margins across several charts.
 *
 * Author:  Torstein Hønsi
 * Version: 2024-06-14
 */
(({ addEvent, Chart, charts, wrap }) => {
    let redrawTimeout;

    wrap(Chart.prototype, 'setChartSize', function (proceed, skipAxes) {
        // Set plotTop to the maximum of all charts
        this.plotTop = charts.reduce(
            (plotTop, chart) => Math.max(plotTop, chart.plotTop),
            0
        );

        // Set marginBottom to the maximum of all charts
        this.marginBottom = charts.reduce(
            (marginBottom, chart) => Math.max(marginBottom, chart.marginBottom),
            0
        );

        // Redraw all charts that are already rendered, but do this only once
        clearTimeout(redrawTimeout);
        redrawTimeout = setTimeout(() => {
            for (let i = 0; i < this.index; i++) {
                const chart = charts[i];
                if (
                    chart.plotTop < this.plotTop ||
                    chart.marginBottom < this.marginBottom
                ) {
                    chart.isDirtyBox = true;
                    chart.redraw();
                }
            }
        }, 0);

        proceed.call(this, skipAxes);
    });


    addEvent(Chart, 'update', function (e) {
        charts.forEach(chart => {
            if (chart !== e.target) {
                // Reset our modified margins so that they can be recalculated
                chart.plotTop = chart.marginBottom = 0;
            }
        });
    });
})(Highcharts);

const config1 = {
    chart: {
        width: 300,
        height: 400,
        plotBorderColor: '#000',
        plotBorderWidth: 1
    },
    title: {
        text: 'Foo bar baz abc peqaD'
    },
    legend: {
        align: 'left',
        verticalAlign: 'top'
    },
    subtitle: {
        text: 'Foo bar'
    },
    xAxis: [{
        title: {
            text: 'Foo bar'
        }
    }],
    yAxis: [{
        title: {
            text: ''
        },
        labels: {
            format: '{value} mm'
        }
    }],
    series: [{
        data: [1, 1, 2, 4]
    }, {
        type: 'column',
        data: [1, 3, 2, 4]
    }]
};

const config2 = {
    chart: {
        width: 300,
        height: 400,
        plotBorderColor: '#000',
        plotBorderWidth: 1
    },
    title: {
        text: 'Foo bar baz abc peqaD'
    },
    legend: {
        align: 'left',
        verticalAlign: 'top'
    },
    yAxis: [{
        title: {
            text: ''
        },
        labels: {
            enabled: false
        }
    }],
    series: [{
        data: [1, 5, 5, 3]
    }, {
        type: 'column',
        data: [1, 3, 2, 4]
    }]
};

Highcharts.chart('container0', config2);
Highcharts.chart('container1', config1);

document.getElementById('update').addEventListener('click', () => {
    Highcharts.charts[1].update({
        subtitle: {
            text: ''
        },
        xAxis: {
            title: {
                text: ''
            }
        }
    });
});
