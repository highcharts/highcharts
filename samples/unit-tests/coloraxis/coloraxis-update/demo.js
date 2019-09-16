QUnit.test('Color axis updates', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap',
            width: 500,
            height: 300
        },

        colorAxis: {
            min: 0
        },

        series: [{
            data: [
                [0, 0, 10],
                [0, 1, 19],
                [0, 2, 8],
                [0, 3, 24],
                [0, 4, 67],
                [1, 0, 92],
                [1, 1, 58],
                [1, 2, 78],
                [1, 3, 117],
                [1, 4, 48]
            ]
        }]
    });

    var plotHeight = chart.plotHeight;

    assert.ok(
        plotHeight > 100,
        'Ready'
    );

    chart.colorAxis[0].update({
        max: 500
    });

    assert.strictEqual(
        chart.plotHeight,
        plotHeight,
        'Geometry ok after update (#6025)'
    );

    // Trigger a chart.redraw
    chart.setSize(490);

    assert.strictEqual(
        chart.plotHeight,
        plotHeight,
        'Geometry ok after resize (#6025)'
    );

    // On Update, no memory leak in colorAxis.undefined.undefined.undefined...
    assert.strictEqual(
        chart.options.colorAxis.undefined,
        undefined,
        'No extra undefined properties after update'
    );
});

QUnit.test('Color axis update with responsive rules', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap',
            width: 600,
            height: 400
        },
        colorAxis: {
            min: 0
        },
        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
        },
        series: [{
            data: [
                [0, 0, 10],
                [0, 1, 19],
                [0, 2, 8],
                [0, 3, 24],
                [0, 4, 67],
                [1, 0, 92],
                [1, 1, 58],
                [1, 2, 78],
                [1, 3, 117],
                [1, 4, 48]
            ]
        }],
        responsive: {
            rules: [{
                condition: { maxWidth: 500 },
                chartOptions: {
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal',
                        symbolHeight: 10,
                        y: 15
                    }
                }
            }]
        }
    });

    chart.setSize(500, 400);

    assert.strictEqual(
        chart.colorAxis[0].labelAlign,
        'center',
        'Labels are not misaligned'
    );
});

QUnit.test('Adding color axis', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            data: [1, 2, 3]
        }, {
            data: [3, 2, 1],
            colorAxis: 1
        }]
    });

    chart.update({
        colorAxis: {}
    }, true, true);

    assert.notEqual(
        chart.series[0].points[0].color,
        chart.series[0].points[1].color,
        'Colors should be different for the first series after colorAxis has been added.'
    );

    assert.strictEqual(
        chart.series[1].points[0].color,
        chart.series[1].points[1].color,
        'Colors should be the same for the second series.'
    );

    chart.addColorAxis({});

    assert.notEqual(
        chart.series[1].points[0].color,
        chart.series[1].points[2].color,
        'Colors should be different for the second series after the second colorAxis has been added.'
    );
});

QUnit.test('Adding color axis in a map chart (#11924)', function (assert) {
    var chart = Highcharts.mapChart('container', {
        series: [{
            data: [{
                name: "Northern Territory",
                value: 1,
                path: "M385,111,392,109,400,111,401,105,393,97,392,92,396,86,401,86,404,70,409,72,414,64,411,58,411,53,416,53,417,49,424,45,425,38,432,38,436,32,447,35,458,34,464,36,473,31,481,29,479,18,474,14,467,13,461,7,474,2,484,13,489,10,495,19,507,22,514,19,515,24,538,28,541,28,548,34,552,35,556,31,564,32,565,35,572,34,575,40,579,41,583,36,579,32,587,28,588,28,591,33,595,34,597,35,600,39,595,44,591,50,587,51,588,57,585,62,580,60,570,67,570,76,573,79,569,87,569,89,565,93,559,103,556,105,559,112,578,125,580,129,589,133,591,140,600,138,611,145,619,149,623,157,614,415,564,413,501,412,417,415,395,415zM407,24,417,26,425,22,433,25,444,18,448,12,448,6,442,5,428,10,418,7,414,9,410,15,410,17zM582,92,597,93,600,89,595,85,596,78,586,75,585,78,583,88z"
            }, {
                name: "Queensland",
                value: 2,
                path: "M628,159,635,162,646,166,653,171,658,181,667,185,677,193,685,191,694,190,700,182,706,171,712,162,717,147,718,137,725,120,722,112,724,98,723,92,720,86,724,78,728,72,727,61,732,58,736,54,729,48,740,30,745,13,746,8,752,5,757,0,759,1,759,5,765,10,765,32,769,35,773,38,769,45,777,55,777,59,780,67,778,85,782,98,784,107,790,110,797,104,805,103,807,111,818,121,823,125,822,140,825,152,824,159,823,167,835,191,839,198,838,209,834,217,841,220,840,232,839,237,846,246,857,253,868,254,870,260,872,267,884,269,889,280,893,276,901,284,899,290,904,303,910,315,912,335,912,345,919,346,921,349,922,337,927,340,938,353,943,361,940,377,952,394,960,396,964,403,966,411,975,418,977,425,980,431,984,435,983,444,987,451,986,454,983,459,984,479,983,484,979,483,982,490,986,500,985,513,973,514,963,510,947,518,946,526,940,525,938,525,933,530,931,531,932,526,928,522,925,518,919,516,912,516,909,510,897,513,889,508,882,511,875,518,795,510,751,505,691,501,685,501,691,419,618,415zM657,163,660,164,664,162,670,160,673,159,673,156,672,154,665,153,661,154,657,157,655,159,655,162zM987,432,989,439,992,440,997,434,999,425,993,421,990,423z",
                middleY: 0.7
            }]
        }]
    });

    chart.addColorAxis({});

    assert.notEqual(
        chart.series[0].points[0].color,
        chart.series[0].points[1].color,
        'Colors should be different after colorAxis has been added.'
    );
});
