QUnit.test('alignThreshold', function (assert) {
    var chart;

    $('#container').highcharts({
        chart: {
            alignThresholds: true,
            type: 'area'
        },
        yAxis: [{
            title: {
                text: 'Primary Axis'
            },
            gridLineWidth: 0
        }, {
            title: {
                text: 'Secondary Axis'
            },
            opposite: true
        }],
        series: [{
            data: [29.9, -71.5, -106.4, -129.2, -144.0, -176.0, -135.6, -148.5, -216.4, -194.1, -95.6, -54.4],
            yAxis: 0
        }, {
            data: [129.9, 271.5, 306.4, -29.2, 544.0, 376.0, 435.6, 348.5, 216.4, 294.1, 35.6, 354.4],
            yAxis: 1
        }]
    });

    chart = $('#container').highcharts();
    assert.equal(
        chart.yAxis[0].tickPositions.indexOf(0),
        chart.yAxis[1].tickPositions.indexOf(0),
        'Same threshold position'
    );


    $('#container').highcharts({
        chart: {
            alignThresholds: true,
            type: 'area'
        },
        yAxis: [{
            title: {
                text: 'Primary Axis'
            },
            gridLineWidth: 0
        }, {
            title: {
                text: 'Secondary Axis'
            },
            opposite: true
        }],
        series: [{
            data: [129.9, 271.5, 306.4, -29.2, 544.0, 376.0, 435.6, 348.5, 216.4, 294.1, 35.6, 354.4],
            yAxis: 0
        }, {
            yAxis: 1,
            data: [29.9, -71.5, -106.4, -129.2, -144.0, -176.0, -135.6, -148.5, -216.4, -194.1, -95.6, -54.4]

        }]
    });

    chart = $('#container').highcharts();
    assert.equal(
        chart.yAxis[0].tickPositions.indexOf(0),
        chart.yAxis[1].tickPositions.indexOf(0),
        'Same threshold position'
    );


    /*$('#container').highcharts({
        chart: {
            alignThresholds: true,
            type: 'column'
        },
        yAxis: [{
            title: {
                text: 'Primary Axis'
            },
            gridLineWidth: 0
        }, {
            title: {
                text: 'Secondary Axis'
            },
            opposite: true
        }],
        series: [{
            data: [29.9, 71.5],
            yAxis: 0
        }, {
            data: [-129, -271],
            yAxis: 1
        }]
    });

    chart = $('#container').highcharts();
    assert.equal(
        chart.yAxis[0].tickPositions.indexOf(0),
        chart.yAxis[1].tickPositions.indexOf(0),
        'Same threshold position'
    );*/

});