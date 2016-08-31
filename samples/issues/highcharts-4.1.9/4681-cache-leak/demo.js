
$(function () {
    QUnit.test("Keep the cache size down", function (assert) {
        var ren,
            i,
            label;

        ren = new Highcharts.Renderer(
            document.getElementById('container'),
            400,
            400
        );

        for (i = 0; i < 1000; i++) {
            label = ren.text('This is label no. ' + i)
                .attr({
                    x: i,
                    y: i
                })
                .add();

            label.getBBox();
        }



        assert.strictEqual(
            Object.keys(ren.cache).length <= 251,
            true,
            'Keep below limit'
        );

    });
});