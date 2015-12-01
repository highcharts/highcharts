
$(function () {
    QUnit.test("Funnel size relative to center", function (assert) {
        var chart = $("#container").highcharts({
            chart: {
                type: 'funnel',
                marginRight: 100
            },
            title: {
                text: 'Sales funnel',
                x: -50
            },
            plotOptions: {
                series: {
                    center: [110, 150],
                    neckWidth: 50,
                    neckHeight: 100,
                    //reversed: true,
                    //-- Other available options
                    height: 200,
                    width: 150
                }
            },
            legend: {
                enabled: false
            },
            series: [{
                name: 'Unique users',
                data: [
                    ['Website visits', 15654],
                    ['Downloads', 4064],
                    ['Requested price list', 1987],
                    ['Invoice sent', 976],
                    ['Finalized', 846]
                ]
            }]
        }).highcharts();

        var series = chart.series[0];
        assert.equal(
            series.getWidthAt(250),
            50,
            'Bottom width'
        );
        assert.equal(
            series.getWidthAt(150),
            50,
            'Center width'
        );
        assert.equal(
            series.getWidthAt(50),
            150,
            'Top width'
        );
    });
});