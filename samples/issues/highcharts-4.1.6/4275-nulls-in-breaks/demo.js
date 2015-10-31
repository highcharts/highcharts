$(function () {
    QUnit.test('Null inside break', function (assert) {
        var chart = $('#container').highcharts({
            title: {
                text: 'Sample of a simple break'
            },
            subtitle: {
                text: 'Line should be interrupted between 5 and 10'
            },
            plotOptions: {
                series: {
                    connectNulls: false
                }
            },
            xAxis: {
                tickInterval: 1,
                breaks: [{
                    from: 5,
                    to: 10,
                    breakSize: 1
                }]
            },
            series: [{
                marker: {
                    enabled: true
                },
                data: (function () {
                    var arr = [],
                        i;
                    for (i = 0; i < 20; i++) {
                        if (i <= 5 || i >= 10) {
                            arr.push(i);
                        } else {
                            arr.push(null);
                        }
                    }
                    return arr;
                }())
            }]
        }).highcharts();


        assert.notEqual(
            chart.series[0].graph.element.getAttribute('d').indexOf('M', 1),
            -1,
            'Graph has moveTo operator'
        );



        chart = $('#container').highcharts({
            title: {
                text: 'Sample of a simple break'
            },
            subtitle: {
                text: 'Line should be interrupted between 5 and 10'
            },
            plotOptions: {
                series: {
                    connectNulls: true
                }
            },
            xAxis: {
                tickInterval: 1,
                breaks: [{
                    from: 5,
                    to: 10,
                    breakSize: 1
                }]
            },
            series: [{
                marker: {
                    enabled: true
                },
                data: (function () {
                    var arr = [],
                        i;
                    for (i = 0; i < 20; i++) {
                        if (i <= 5 || i >= 10) {
                            arr.push(i);
                        } else {
                            arr.push(null);
                        }
                    }
                    return arr;
                }())
            }]
        }).highcharts();


        assert.equal(
            chart.series[0].graph.element.getAttribute('d').indexOf('M', 1),
            -1,
            'Graph does not have moveTo operator'
        );

    });

});