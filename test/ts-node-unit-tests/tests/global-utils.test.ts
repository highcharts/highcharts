import { loadHCWithModules } from '../test-utils';
import { ok, strictEqual, match } from 'node:assert';
import { describe, it } from 'node:test';

describe('Global utilities', () => {
    const Highcharts = loadHCWithModules();
    const keys = [
        'addEvent',
        'arrayMax',
        'arrayMin',
        'attr',
        'correctFloat',
        'createElement',
        'css',
        'defined',
        'destroyObjectProperties',
        'discardElement',
        'erase',
        'error',
        'extend',
        'extendClass',
        'find',
        'fireEvent',
        'format',
        'getMagnitude',
        'getOptions',
        'getStyle',
        'inArray',
        'isArray',
        'isClass',
        'isDOMElement',
        'isFunction',
        'isNumber',
        'isObject',
        'isString',
        'keys',
        'merge',
        'normalizeTickInterval',
        'numberFormat',
        'objectEach',
        'offset',
        'pad',
        'pick',
        'pInt',
        'relativeLength',
        'removeEvent',
        'setOptions',
        'splat',
        'stableSort',
        'syncTimeout',
        'timeUnits',
        'uniqueKey',
        'useSerialIds',
        'wrap'
    ];

    keys.forEach(key => {
        it(`The ${key} property is defined on the Highcharts object`, () => {
            const prop = Highcharts[key];
            ok(prop);
            match(typeof prop, /function|object/);
        });
    });
});

describe('Highcharts.Time', () => {
    const Highcharts = loadHCWithModules();
    const time = new Highcharts.Time();

    describe('dateFormat', () => {
        it('correctly formats a date', () => {
            strictEqual(
                time.dateFormat('%A, %e %b, %H:%M:%S', Date.UTC(1893, 0, 1, 0, 0, 0, 0)),
                'Sunday,  1 Jan, 00:00:00'
            );
        });
    });
});
