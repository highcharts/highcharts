$(function () {
    QUnit.test("Legend group should have width minium width to fit navigation at least." , function (assert) {
        var min,
            max,
            UNDEFINED,
            chart = $('#container').highcharts({
                chart: {
                    type: 'pie',
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    y: 30,
                    navigation: {
                        arrowSize: 12
                    }
                },
                series: [{
                    data: (function () {
                        var names = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,' + 'O,P,Q,R,S,T,U,V,W,X,Y,Z',
                            arr = [];

                        Highcharts.each(names.split(','), function (name) {
                            arr.push({
                                name: name,
                                y: Math.round(Math.random() * 100)
                            });
                        });

                        return arr;
                    }()),
                    showInLegend: true
                }]
            }).highcharts();

        assert.strictEqual(
            chart.legend.group.getBBox(true).width >= chart.legend.nav.getBBox(true).width,
            true,
            'The same width for navigation and legend.'
        );
    });
});