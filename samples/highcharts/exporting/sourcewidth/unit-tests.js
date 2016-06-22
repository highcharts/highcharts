QUnit.test('Exported chart sourceWidth and sourceHeight', function (assert) {
    var chart = Highcharts.charts[0],
        done = assert.async();

    Highcharts.post = function (url, data) {

        function serialize(obj) {
            var str = [];
            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            }
            return str.join("&");
        }

        data.async = true;
        $.ajax({
            type: 'POST',
            data: serialize(data),
            url: url,
            success: function (result) {
                var img = new Image();
                img.src = url + result;
                img.onload = function () {

                    // Since the default scale is 2 and the sourceWidth is 400, we
                    // expect the exported width to be 800px.
                    assert.strictEqual(
                        this.width,
                        800,
                        'Generated image width is 800px'
                    );

                    assert.strictEqual(
                        this.height,
                        400,
                        'Generated image height is 400px'
                    );

                    document.body.appendChild(img);

                    done();
                };
            },
            error: function () {
                done();
            }
        });
    };

    chart.exportChart();
});