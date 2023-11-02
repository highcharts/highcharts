import Highcharts from '/base/code/es-modules/masters/highcharts.src.js';
import '/base/code/es-modules/masters/modules/boost.src.js';

QUnit.test('Highcharts boost composition', function (assert) {

    assert.strictEqual(
        typeof Highcharts.hasWebGLSupport,
        'function',
        'Highcharts should be decorated with boost functions.'
    );

});
