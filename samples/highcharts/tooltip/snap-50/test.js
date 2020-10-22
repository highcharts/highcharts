function test(chart) { // eslint-disable-line no-unused-vars
    chart.container.querySelectorAll('.highcharts-tracker').forEach(tracker => {
        tracker.setAttribute('stroke', 'pink');
        tracker.setAttribute('stroke-opacity', '0.3');
    });
}