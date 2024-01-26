$(function () {
    $('#b').click(testPOST);

    const exportUrl = 'https://export.highcharts.com/';

    function testPOST() {

        const optionsStr = JSON.stringify({
            infile: {
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar']
                },
                series: [{
                    data: [29.9, 71.5, 106.4]
                }]
            },
            width: 400,
            b64: true
        }

        );

        $.ajax({
            type: 'POST',
            data: optionsStr,
            url: exportUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (data) {
                console.log('get the file from relative url: ', data);
                $('#container').html(`<img src="data:image/png; base64,${data}"/>`);
            },
            error: function (err) {
                console.log('error', err.statusText);
            }
        });

    }
});
