function test(chart) {
    // First drill down
    chart.get('top').points[1].doDrilldown();

    // Back to top
    chart.drillUp();


    chart.getSVG = function () {
        return chart.container.innerHTML;
    };
}