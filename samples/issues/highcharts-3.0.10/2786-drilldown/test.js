function test(chart) { // eslint-disable-line no-unused-vars
    // First drill down
    chart.get('top').points[1].doDrilldown();

    // Second drill down
    chart.get('cars').points[0].doDrilldown();

    // Back to Cars
    chart.drillUp();

    // Back to top
    chart.drillUp();


    chart.getSVG = function () {
        return chart.container.innerHTML;
    };
}