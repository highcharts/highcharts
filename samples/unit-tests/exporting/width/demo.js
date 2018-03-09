
QUnit.test('Exported chart width', function (assert) {

    var chart = Highcharts
        .chart('container', {
            title: {
                text: 'Highcharts export width test'
            },
            subtitle: {
                text: 'Exported chart should be 200px wide'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }],
            exporting: {
                width: 200
            }
        }),
        done = assert.async();

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
                        200,
                        'Generated image is 200px'
                    );

                    Highcharts.post = originalPost;

                    done();
                };
            },
            error: function () {
                Highcharts.post = originalPost;
                done();
            }
        });
    };

    chart.exportChart({
        width: 200
    });

});
