QUnit.test('Exported chart width', function (assert) {
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
                    assert.strictEqual(
                        this.width,
                        200,
                        'Generated image is 200px'
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

    chart.exportChart({
        width: 200
    });
});