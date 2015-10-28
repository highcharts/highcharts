$(function () {
    QUnit.test("pointBreak callback wasn't called for xAxis and different series than column.", function (assert) {

        var iteratorPB = 0,
            iteratorAB = 0;

        $('#container').highcharts({
            yAxis:{
                breaks: [{
                    from: 5,
                    to: 15,
                    breakSize: 1
                }],
                events: {
                    pointBreak: function () {
                        iteratorPB++;
                    },
                    afterBreaks: function () {
                        iteratorAB++;
                    }
                }
            },
            xAxis:{
                breaks: [{
                    from: 5,
                    to: 15,
                    breakSize: 1
                }],
                events: {
                    pointBreak: function () {
                        iteratorPB++;
                    },
                    afterBreaks: function () {
                        iteratorAB++;
                    }
                }
            },
            series: [{
                data: (function () {
                    var data = [],
                        i;
                    for (i = 0; i < 20; i = i + 1) {
                        data.push(i);
                    }
                    return data;
                }())
            }]
        });

        var chart = $('#container').highcharts();

        assert.strictEqual(
            iteratorAB,
            9,
            "All after breaks called"
        );
        assert.strictEqual(
            iteratorPB,
            8,
            "All point breaks called"
        );

    });
});