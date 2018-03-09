
QUnit.test('Exported chart scale', function (assert) {

    var chart = Highcharts
        .chart('container', {
            title: {
                text: 'Highcharts exporting scale demo'
            },
            subtitle: {
                text: 'This subtitle is HTML',
                useHTML: true
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }],
            exporting: {
                allowHTML: true,
                enabled: false
            }
        }),
        done = assert.async(),
        count = 0;

    function testScale(scale) {

        var originalPost = Highcharts.post;

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
                            Highcharts.post = originalPost;
                            done();
                        }
                    };
                },
                error: function () {
                    count++;
                    if (count === 2) {
                        Highcharts.post = originalPost;
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