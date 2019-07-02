/**
 * This file sets up minimum viable integration tests for IE8. Since QUnit v2
 * doesn't support IE8, a karma framework is part of the test file. Assertions
 * are made by calling `ok` with a description and a truthy argument. The tests
 * run on BrowserStack.
 *
 * Usage:
 * gulp test --oldie
 *
 * Debugging in utils:
 * http://192.168.15.208:3030/samples/view?path=unit-tests/oldie/general&mobile=true
 */

/* eslint no-underscore-dangle: 0 */

var results = [];

function ok(description, success) {
    results.push({
        description: description,
        success: Boolean(success)
    });
}


//----------------------------------------------------------------------------//
// Start of actual tests

//var types = Highcharts.seriesTypes;
var types = {
    line: 1,
    column: 1,
    pie: 1,
    area: 1
};

Highcharts.Chart.prototype.isReadyToRender = function () {
    return true;
};
for (var type in types) {
    if (types.hasOwnProperty(type)) {

        var chart = Highcharts.chart('container', {
            series: [{
                type: type,
                data: [1, 3, 2, 4]
            }]
        });

        ok(
            'The container should be generated for series type ' + type,
            chart.container.tagName === 'DIV'
        );

        chart.series[0].points[0].onMouseOver();
        ok(
            'The tooltip should be displayed',
            chart.tooltip.getLabel().element.innerHTML
                .indexOf('<SPAN') !== -1
        );
        chart.destroy();
    }
}


// End of actual tests
//----------------------------------------------------------------------------//

if (window.__karma__) {
    window.__karma__.start = function () {

        this.info({
            total: results.length
        });

        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            this.result({
                id: 'Test ' + i,
                description: result.description,
                success: result.success,
                log: [result.description],
                suite: ['oldie'],
                skipped: false
            });
        }
        this.complete();
    };
} else {
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        console.log(
            result.success ? 'SUCCESS: ' : 'FAILED: ', result.description
        );
    }
}
