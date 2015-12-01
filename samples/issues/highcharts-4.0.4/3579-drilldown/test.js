function test(chart) {

    // First drill down, emulate category click
    chart.series[0].points[0].doDrilldown(true);
    chart.series[1].points[0].doDrilldown(true);
    chart.applyDrilldown();

    // Click the first point in Cats
    chart.get('animals').points[0].doDrilldown();

    // Up
    chart.drillUp();

    // Click the second point in Cats
    chart.get('animals2').points[0].doDrilldown();

    // Up
    //chart.drillUp();


    chart.getSVG = function () {
        return chart.container.innerHTML;
    };
}