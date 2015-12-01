// TODO: When Gert has allowed cache-control in the HTTP header, try this again.

QUnit.test('Exported chart width', function (assert) {
    var chart = Highcharts.charts[0],
        done = assert.async();


    Highcharts.post = function (url, data) {

        var dataString = encodeURI('async=true&type=jpeg&width=400&svg=' + data.svg);

        $.ajax({
            type: 'POST',
            data: dataString,
            url: url,
            success: function (result) {
                var img = new Image();
                img.src = result;
                img.onload = function () {
                    assert.strictEqual(
                        this.width,
                        200,
                        'Generated image is 200px'
                    );

                    done();
                };
            },
            error: function (err) {
                throw new Error(err.statusText);
            }
        });
    };

    chart.exportChart({
        width: 200
    });
});