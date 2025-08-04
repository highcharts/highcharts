const createChart = data => Highcharts.chart('container', {

    title: {
        text: 'Bell curve'
    },

    xAxis: [{
        title: {
            text: 'Data'
        },
        alignTicks: false
    }, {
        title: {
            text: 'Bell curve'
        },
        alignTicks: false,
        opposite: true
    }],

    yAxis: [{
        title: { text: 'Data' }
    }, {
        title: { text: 'Bell curve' },
        opposite: true
    }],

    series: [{
        name: 'Bell curve',
        type: 'bellcurve',
        xAxis: 1,
        yAxis: 1,
        // baseSeries: 1,
        data: data,
        zIndex: -1
    }, {
        name: 'Data',
        type: 'scatter',
        data: data,
        accessibility: {
            exposeAsGroupOnly: true
        },
        marker: {
            radius: 1.5
        }
    }]
});

const data = [
    3.5, 3, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3, 3, 4,
    4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3, 3.4, 3.5, 3.4, 3.2,
    3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3,
    3.8, 3.2, 3.7, 3.3, 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2, 3,
    2.2, 2.9, 2.9, 3.1, 3, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3, 2.8, 3,
    2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3, 3.4, 3.1, 2.3, 3, 2.5, 2.6, 3, 2.6, 2.3,
    2.7, 3, 2.9, 2.9, 2.5, 2.8, 3.3, 2.7, 3, 2.9, 3, 3, 2.5, 2.9, 2.5, 3.6,
    3.2, 2.7, 3, 2.5, 2.8, 3.2, 3, 3.8, 2.6, 2.2, 3.2, 2.8, 2.8, 2.7, 3.3, 3.2,
    2.8, 3, 2.8, 3, 2.8, 3.8, 2.8, 2.8, 2.6, 3, 3.4, 3.1, 3, 3.1, 3.1, 3.1, 2.7,
    3.2, 3.3, 3, 2.5, 3, 3.4, 3
];

// Plugin to add bell curve zones and labels
(({ addEvent, seriesTypes }) => {
    const decoratedSeries = [];
    addEvent(seriesTypes.bellcurve, 'render', function () {

        if (decoratedSeries.includes(this)) {
            return;
        }

        decoratedSeries.push(this);
        const pointsInInterval = this.options.pointsInInterval,
            labels = ['3σ', '2σ', 'σ', 'μ', 'σ', '2σ', '3σ'],
            opacities = [0.1, 0.2, 0.6, 1, 1, 0.6, 0.2, 0.1];

        const zones = this.points
            .filter((point, i) => i % pointsInInterval === 0)
            .map((point, i) => ({
                value: point.x,
                fillColor: `rgba(44, 175, 254, ${opacities[i]})`
            }));

        this.update({
            zoneAxis: 'x',
            zones
        });

        this.points
            .filter(
                (point, i) => i % pointsInInterval === 0
            ).forEach((point, i) => {
                point.update({
                    color: 'black',
                    dataLabels: {
                        enabled: true,
                        format: labels[i],
                        overflow: 'none',
                        crop: false,
                        y: -2,
                        style: {
                            fontSize: '13px'
                        }
                    }
                });
            });
    });
})(Highcharts);

createChart(data);
