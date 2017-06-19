QUnit.test('Boosted heatmap with styled mode (#6650)', function (assert) {

    assert.expect(0);
    var xsize = 26;
    var ysize = 100;
    // Add some random data
    var data = new Array(xsize * ysize);
    for (var i = 0; i < xsize * ysize; i++) {
        var row = new Array(3);
        row[0] = Math.floor(i / ysize);
        row[1] = -i % ysize;


        row[2] = ((row[1] / ysize) * 125);
        // row[2] = Math.random() * -125;
        data[i] = row;
    }

    Highcharts.chart('container', {
        chart: {
            type: 'heatmap',
            margin: [60, 10, 80, 50]
        },

        boost: {
            useGPUTranslations: true
        },

        title: {
            text: 'Swept Spectrogram',
            align: 'left',
            x: 40
        },

        xAxis: {
            type: 'number',
            title: {
                text: 'Channel'
            },
            min: 0,
            max: 25,
            showLastLabel: true
        },

        yAxis: {
            title: {
                text: null
            },
            labels: {
                format: '{value}s'
            },
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false,
            min: -99,
            max: 0,
            reversed: true
        },

        colorAxis: {
            stops: [
                [0, '#FF0000'],
                [0.25, '#FFFF00'],
                [0.5, '#00FF00'],
                [0.75, '#00FFFF'],
                [1, '#0000FF']
            ],
            min: -125,
            max: 0,
            startOnTick: false,
            endOnTick: false,
            reversed: true,
            labels: {
                format: '{value} dBm'
            }
        },

        series: [{
            boostThreshold: 100,
            borderWidth: 0,
            // nullColor: '#000000',
            // colsize: 100*26, // one full buffer ? no idea...
            data: data
        }]
    });


});
