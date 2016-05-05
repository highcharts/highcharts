QUnit.test('Exported chart scale', function (assert) {
    var chart = Highcharts.charts[0],
        done = assert.async(),
        count = 0;

    function testScale(scale) {
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
                            scale * 600,
                            'Generated image is ' + (scale * 600) + 'px'
                        );

                        document.body.appendChild(img);

                        count++;
                        if (count === 2) {
                            done();
                        }
                    };
                },
                error: function () {
                    count++;
                    if (count === 2) {
                        done();
                    }
                }
            });
        };

        chart.exportChart({
            scale: scale
        });
    }

    testScale(1);
    testScale(2);
});