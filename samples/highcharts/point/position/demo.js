const chart = Highcharts.chart('container', {
    chart: {
        events: {
            render() {
                const chart = this,
                    // get the position of the first point
                    pos = chart.series[0].points[0].pos(true);

                // if this is the first render, create a custom SVG element
                // and assign it to chart.customSVG
                if (!chart.customSVG) {
                    chart.customSVG = chart.renderer.circle(pos[0], pos[1], 10)
                        .attr({ fill: '#1a1a1a' })
                        .add();
                } else {
                    // if this is not the first render, move the customSVG
                    // to the correct position
                    chart.customSVG.animate({
                        x: pos[0],
                        y: pos[1]
                    });
                }
            }
        }
    },
    series: [{
        type: 'line',
        data: [1, 2, 3, 4]
    }]
});

document.getElementById('invert').addEventListener('click', () => {
    chart.update({
        chart: {
            inverted: !chart.options.chart.inverted
        }
    });
});