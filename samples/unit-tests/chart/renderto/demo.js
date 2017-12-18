/* eslint func-style:0 */


QUnit.test('Container initially hidden (#6693)', function (assert) {

    var outerOuter = document.createElement('div');
    outerOuter.style.visibility = 'hidden';
    outerOuter.style.display = 'none';
    document.body.appendChild(outerOuter);

    var outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outerOuter.appendChild(outer);

    var container = document.createElement('div');
    container.style.display = 'none';
    container.style.width = '300px';
    container.style.height = '300px';
    outer.appendChild(container);


    var chart = Highcharts.chart(container, {
        series: [{
            type: 'column',
            data: [1, 3, 2, 4]
        }]
    });

    container.style.display = 'block';
    outer.style.display = 'block';
    outer.style.visibility = 'visible';
    outerOuter.style.display = 'block';
    outerOuter.style.visibility = 'visible';

    assert.strictEqual(
        chart.chartHeight,
        300,
        'Correct chart height when hidden'
    );
});

QUnit.test('Container originally detached (#5783)', function (assert) {
    var c = document.createElement('div');

    c.style.width = '200px';
    c.style.height = '200px';

    var chart = Highcharts.chart({
        chart: {
            renderTo: c
        },
        title: {
            text: 'The height of the chart is set to 200px'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });

    document.getElementById('container').appendChild(c);

    assert.strictEqual(
        chart.chartWidth,
        200,
        'Chart width detected from CSS of detached container'
    );

    // Check that adding chart again does not throw errors (#7014)
    chart = Highcharts.chart({
        chart: {
            renderTo: c
        },
        title: {
            text: 'The second chart in the same container'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            type: 'column'
        }]
    });
});

QUnit.test('Container parent originally detached (#7024)', function (assert) {

    var parent = document.createElement('div');
    var c = document.createElement('div');

    parent.appendChild(c);

    c.style.width = '210px';
    c.style.height = '210px';

    var chart = Highcharts.chart({
        chart: {
            renderTo: c
        },
        title: {
            text: 'The height of the chart is set to 210px'
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6,
                148.5, 216.4, 194.1, 95.6, 54.4],
            type: 'pie'
        }]
    });

    document.getElementById('container').appendChild(parent);

    assert.ok(
        document.body.contains(chart.container),
        'Chart is attached to DOM'
    );
    assert.strictEqual(
        chart.chartWidth,
        210,
        'Chart width detected from CSS'
    );
});

QUnit.test('Container hidden by display:block !important', function (assert) {

    var style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet.insertRule('.ng-cloak { display: none !important; }');

    var c = document.createElement('div');
    document.body.appendChild(c);
    c.className = 'ng-cloak';

    var chart = Highcharts.chart(c, {
        chart: {
            plotBackgroundColor: 'silver'
        },
        title: {
            text: 'The plot area should not overlap the title'
        },
        series: [{
            data: [1, 3, 2, 4]
        }]
    });

    c.className = '';

    assert.ok(
        chart.plotTop > 15,
        'The chart should make room for the title when rendered inside a ' +
        'hidden container (#2631)'
    );
    document.body.removeChild(c);

});