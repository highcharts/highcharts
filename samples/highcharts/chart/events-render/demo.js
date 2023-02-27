function createLabel(chart, text, y, color) {
    const label = chart.renderer.label(text, 80, y)
        .attr({
            fill: color,
            padding: 10,
            r: 5,
            zIndex: 8
        })
        .css({
            color: '#ffffff'
        })
        .add();

    setTimeout(function () {
        label.fadeOut();
    }, 1500);
}

const colors = Highcharts.getOptions().colors;

const chart = Highcharts.chart('container', {
    chart: {
        events: {
            load() {
                createLabel(this, 'load event', 80, colors[0]);
            },
            redraw() {
                createLabel(this, 'redraw event', 80, colors[3]);
            },
            render() {
                createLabel(this, 'render event', 120, colors[1]);
            }
        }
    },

    title: {
        text: 'Load vs Redraw vs Render'
    },

    subtitle: {
        text: 'Label is displayed when an event is fired.'
    },

    series: [
        {
            data: [1, 2, 3, 4, 5]
        }
    ]
});

const addPointButton = document.getElementById('add-point'),
    reloadButton = document.getElementById('reload');

addPointButton.addEventListener('click', () => {
    chart.series[0].addPoint(Math.random() * 6);
});

reloadButton.addEventListener('click', () => {
    window.location.reload();
});