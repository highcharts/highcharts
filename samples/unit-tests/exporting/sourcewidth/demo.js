
QUnit.test('Exported chart sourceWidth and sourceHeight', function (assert) {

    var chart = Highcharts
        .chart('container', {
            title: {
                text: 'Highcharts sourceWidth and sourceHeight demo'
            },
            subtitle: {
                text: 'The on-screen chart is 600x400.<br/>The exported chart is 800x400<br/>(sourceWidth and sourceHeight multiplied by scale)',
                floating: true,
                align: 'left',
                x: 60,
                y: 50
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }],
            exporting: {
                sourceWidth: 400,
                sourceHeight: 200,
                // scale: 2 (default)
                chartOptions: {
                    subtitle: null
                }
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

    chart.exportChart();

});