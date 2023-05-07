/* eslint func-style:0 */

(function () {
    var addEvent = Highcharts.addEvent,
        fireEvent = Highcharts.fireEvent,
        removeEvent = Highcharts.removeEvent,
        pInt = Highcharts.pInt;

    /**
     * Wrapper because of fast migration from earlier system
     */
    function assertEquals(assert, message, actual, expected) {
        assert.equal(expected, actual, message);
    }

    /**
     * Test an event that fires once and removes itself.
     *
     * The counter is just a property of an object.
     */
    QUnit.test('Object self remove', function (assert) {
        var o = { clickedCount: 0 },
            f = function () {
                o.clickedCount++;
                removeEvent(o, 'customEvent', f);
            };

        // Setup event handler
        addEvent(o, 'customEvent', f);
        assert.equal(0, o.clickedCount, 'Not yet clicked');

        // Fire it once
        fireEvent(o, 'customEvent', null, null);
        assertEquals(assert, 'Now clicked', 1, o.clickedCount);

        // Fire it again, should do nothing, since the handler is removed
        fireEvent(o, 'customEvent', null, null);
        assertEquals(assert, 'clicked again, no change', 1, o.clickedCount);
    });

    /**
     * Test an event that triggers another event that remove itself.
     *
     * The counter is just a property of an object.
     */
    QUnit.test('ObjectEventChainedRemove', function (assert) {
        var o = { clickedCount: 0 },
            f = function () {
                o.clickedCount++;
            };

        // Add a inner event handler
        addEvent(o, 'innerEvent', f);

        var removeHandler = function () {
            removeEvent(o, 'innerEvent', f);
            removeEvent(document, 'outerEvent', removeHandler);
        };

        // remove it on chart destroy
        addEvent(document, 'outerEvent', removeHandler);

        // Fire it once
        fireEvent(o, 'innerEvent', null, null);
        assertEquals(assert, 'now clicked', 1, o.clickedCount);

        // Fire outer to remove inner
        fireEvent(document, 'outerEvent', null, null);
        assertEquals(assert, 'no change', 1, o.clickedCount);

        // Fire it again
        fireEvent(o, 'innerEvent', null, null);
        assertEquals(assert, 'clicked again, no change', 1, o.clickedCount);
    });

    /**
     * Test event add/fire/remove on a POJO.
     *
     * The counter is just a property of an object.
     * Remove all handlers.
     */
    QUnit.test('ObjectEventRemoveAll', function (assert) {
        var o = { clickedCount: 0 },
            f = function () {
                o.clickedCount++;
            };

        // Setup event handler
        addEvent(o, 'customEvent', f);
        assertEquals(assert, 'not yet clicked', 0, o.clickedCount);

        // Fire it once
        fireEvent(o, 'customEvent', null, null);
        assertEquals(assert, 'now clicked', 1, o.clickedCount);

        // Remove all handlers
        removeEvent(o);

        // Fire it again, should do nothing, since the handler is removed
        fireEvent(o, 'customEvent', null, null);
        assertEquals(assert, 'clicked again, no change', 1, o.clickedCount);
    });

    /**
     * Test event add/fire/remove on a POJO.
     *
     * The counter is just a property of an object.
     * Remove handlers of a certain type.
     */
    QUnit.test('ObjectEventRemoveType', function (assert) {
        var o = { clickedCount: 0 },
            f = function () {
                o.clickedCount++;
            };

        // Setup event handler
        addEvent(o, 'customEvent', f);
        assertEquals(assert, 'not yet clicked', 0, o.clickedCount);

        // Fire it once
        fireEvent(o, 'customEvent', null, null);
        assertEquals(assert, 'now clicked', 1, o.clickedCount);

        // Remove the handler (Only specifying event type)
        removeEvent(o, 'customEvent');

        // Fire it again, should do nothing, since the handler is removed
        fireEvent(o, 'customEvent', null, null);
        assertEquals(assert, 'clicked again, no change', 1, o.clickedCount);
    });

    /**
     * Test event add/fire/remove on a POJO.
     *
     * The counter is just a property of an object.
     * Remove a specific handler.
     */
    QUnit.test('ObjectEventRemoveHandler', function (assert) {
        var o = { clickedCount: 0 },
            f = function () {
                o.clickedCount++;
            };

        // Setup event handler
        addEvent(o, 'customEvent', f);
        assertEquals(assert, 'not yet clicked', 0, o.clickedCount);

        // Fire it once
        fireEvent(o, 'customEvent', null, null);
        assertEquals(assert, 'now clicked', 1, o.clickedCount);

        // Remove the handler (Most fine-grained)
        removeEvent(o, 'customEvent', f);

        // Fire it again, should do nothing, since the handler is removed
        fireEvent(o, 'customEvent', null, null);
        assertEquals(assert, 'clicked again, no change', 1, o.clickedCount);
    });

    /**
     * Tests that preventDefault function exists in the event handler.
     */
    QUnit.test('ObjectEventPreventDefaultExists', function (assert) {
        var o = { clickedCount: 0 },
            f = function (e) {
                assertEquals(
                    assert,
                    'preventDefault should exist',
                    typeof e.preventDefault,
                    'function'
                );
            };

        // Setup event handler
        addEvent(o, 'customEvent', f);

        // Fire it once
        fireEvent(o, 'customEvent', { inc: 1 }, null);

        // Remove the handler (Most fine-grained)
        removeEvent(o, 'customEvent', f);
    });

    /**
     * Tests that it is possible to prevent the default action by calling
     * preventDefault.
     */
    QUnit.test('ObjectEventPreventDefaultByFunction', function (assert) {
        var o = { clickedCount: 0 },
            f = function (e) {
                o.clickedCount += e.inc;
                e.preventDefault();
            },
            defaultFunction = function (e) {
                o.clickedCount += e.inc;
            };

        // Setup event handler
        addEvent(o, 'customEvent', f);
        assertEquals(assert, 'not yet clicked', 0, o.clickedCount);

        // Fire it once
        fireEvent(o, 'customEvent', { inc: 1 }, defaultFunction);

        assertEquals(assert, 'now clicked', 1, o.clickedCount);

        // Remove the handler (Most fine-grained)
        removeEvent(o, 'customEvent', f);

        // Fire it again, should do nothing, since the handler is removed
        fireEvent(o, 'customEvent', { inc: 10 }, defaultFunction);
        assertEquals(assert, 'clicked again, no change', 11, o.clickedCount);
    });

    /**
     * Test that it is possible to prevent the default action from one
     * handler and still not running the default.
     */
    QUnit.test(
        'ObjectEventPreventDefaultByFunctionMultiple',
        function (assert) {
            var o = { clickedCount: 0 },
                f = function (e) {
                    o.clickedCount += e.inc;
                    e.preventDefault();
                },
                g = function (e) {
                    o.clickedCount += e.inc;
                    // e.preventDefault(); Do not prevent the default.
                },
                defaultFunction = function (e) {
                    o.clickedCount += e.inc;
                };

            // Setup event handler
            addEvent(o, 'customEvent', f);
            addEvent(o, 'customEvent', g);
            assertEquals(assert, 'not yet clicked', 0, o.clickedCount);

            // Fire it once
            fireEvent(o, 'customEvent', { inc: 1 }, defaultFunction);

            assertEquals(assert, 'now clicked', 2, o.clickedCount);

            // Remove the handler (Most fine-grained)
            removeEvent(o, 'customEvent', f);

            // Fire it again, should fire 'g' which is not preventing the
            // default
            fireEvent(o, 'customEvent', { inc: 10 }, defaultFunction);
            assertEquals(
                assert,
                'clicked again, no change',
                22, // 2 (from before) + 2 * 10 (handler + default)
                o.clickedCount
            );
            removeEvent(o, 'customEvent', g);
        }
    );

    /**
     * Test that arguments are passed to the event handler.
     */
    QUnit.test('ObjectEventArgumentToHandler', function (assert) {
        var o = { clickedCount: 0 },
            f = function (e) {
                o.clickedCount += e.inc;
            };

        // Setup event handler
        addEvent(o, 'customEvent', f);
        assertEquals(assert, 'not yet clicked', 0, o.clickedCount);

        // Fire it once
        fireEvent(o, 'customEvent', { inc: 2 }, null);

        assertEquals(assert, 'now clicked', 2, o.clickedCount);

        // Remove the handler (Most fine-grained)
        removeEvent(o, 'customEvent', f);

        // Fire it again, should do nothing, since the handler is removed
        fireEvent(o, 'customEvent', { inc: 2 }, null);
        assertEquals(assert, 'clicked again, no change', 2, o.clickedCount);
    });

    /**
     * Test that arguments are passed to the default function.
     */
    QUnit.test('ObjectEventArgumentToDefaultFunction', function (assert) {
        var o = { clickedCount: 0 },
            f = function (e) {
                o.clickedCount += e.inc;
            },
            defaultFunction = function (e) {
                o.clickedCount += e.inc;
            };

        // Setup event handler
        addEvent(o, 'customEvent', f);
        assertEquals(assert, 'not yet clicked', 0, o.clickedCount);

        // Fire it once
        fireEvent(o, 'customEvent', { inc: 2 }, defaultFunction);

        assertEquals(assert, 'now clicked', 4, o.clickedCount);

        // Remove the handler (Most fine-grained)
        removeEvent(o, 'customEvent', f);

        // Fire it again, should only run the default function, since the
        // handler is removed
        fireEvent(o, 'customEvent', { inc: 2 }, defaultFunction);
        assertEquals(assert, 'clicked again, no change', 6, o.clickedCount);
    });

    /**
     * Tests that properties set in the handler is passed on to the default
     * function.
     */
    QUnit.test(
        'ObjectEventPropertiesSetInHandlerSuppliedToDefaultFunction',
        function (assert) {
            var o = { clickedCount: 0 },
                f = function (e) {
                    o.clickedCount += e.inc;
                    e.extraInc = 100;
                },
                defaultFunction = function (e) {
                    o.clickedCount += e.inc;
                    o.clickedCount += e.extraInc || 0;
                };

            // Setup event handler
            addEvent(o, 'customEvent', f);
            assertEquals(assert, 'not yet clicked', 0, o.clickedCount);

            // Fire it once
            fireEvent(o, 'customEvent', { inc: 2 }, defaultFunction);

            assertEquals(assert, 'now clicked', 104, o.clickedCount);

            // Remove the handler (Most fine-grained)
            removeEvent(o, 'customEvent', f);

            // Fire it again, should only run the default function, since the
            // handler is removed
            fireEvent(o, 'customEvent', { inc: 2 }, defaultFunction);
            assertEquals(
                assert,
                'clicked again, no change',
                106,
                o.clickedCount
            );
        }
    );

    /**
     * Tests that the default function is executed even when no listeners are
     * registered.
     */
    QUnit.test(
        'ObjectEventDefaultFunctionShouldRunWhenNoHandlersAreRegistered',
        function (assert) {
            var o = { clickedCount: 0 },
                defaultFunction = function (e) {
                    o.clickedCount += e.inc;
                };

            // Fire it, should only run the default function, since there is no
            // handler
            fireEvent(o, 'customEvent', { inc: 1 }, defaultFunction);
            assertEquals(assert, 'clicked again, no change', 1, o.clickedCount);
        }
    );

    /**
     * Test event add/fire/remove on DOM element.
     *
     * The counter is stored as innerHTML in a div.
     */
    QUnit.test('DomElementEventRemoveAll', function (assert) {
        $('<div id="o1">0</div>').appendTo(document.body);

        var o = document.getElementById('o1'),
            f = function () {
                o.innerHTML = pInt(o.innerHTML) + 1;
            };

        // 1. Test custom events
        // Setup event handler
        addEvent(o, 'customEvent', f);
        assertEquals(assert, 'custom not yet clicked', 0, pInt(o.innerHTML));

        // Fire it once
        fireEvent(o, 'customEvent', null, null);
        assertEquals(assert, 'custom now clicked', 1, pInt(o.innerHTML));

        // Remove all handlers
        removeEvent(o);

        // Fire it again, should do nothing, since the handler is removed
        fireEvent(o, 'customEvent', null, null);
        assertEquals(
            assert,
            'custom clicked again, no change',
            1,
            pInt(o.innerHTML)
        );

        // 2. Test HTML events
        // Reset the counter
        o.innerHTML = 0;

        // Setup event handler
        addEvent(o, 'click', f);
        assertEquals(assert, 'not yet clicked', 0, pInt(o.innerHTML));

        // Fire it once
        fireEvent(o, 'click');
        assertEquals(assert, 'now clicked', 1, pInt(o.innerHTML));

        // Remove all handlers
        removeEvent(o);

        // Fire it again, should do nothing, since the handler is removed
        fireEvent(o, 'click');
        assertEquals(assert, 'clicked again, no change', 1, pInt(o.innerHTML));
    });

    /**
     * Test event add/fire/remove on DOM element.
     *
     * The counter is stored as innerHTML in a div.
     */
    QUnit.test('DomElementEventRemoveType', function (assert) {
        $('<div id="o2">0</div>').appendTo(document.body);
        var o = document.getElementById('o2'),
            f = function () {
                o.innerHTML = pInt(o.innerHTML) + 1;
            };

        // 1. Test custom events
        // Setup event handler
        addEvent(o, 'customEvent', f);
        assertEquals(assert, 'custom not yet clicked', 0, pInt(o.innerHTML));

        // Fire it once
        fireEvent(o, 'customEvent', null, null);
        assertEquals(assert, 'custom now clicked', 1, pInt(o.innerHTML));

        // Remove the handler (Only specifying event type)
        removeEvent(o, 'customEvent');

        // Fire it again, should do nothing, since the handler is removed
        fireEvent(o, 'customEvent', null, null);
        assertEquals(
            assert,
            'custom clicked again, no change',
            1,
            pInt(o.innerHTML)
        );

        // 2. Test HTML events
        // Reset the counter
        o.innerHTML = 0;

        // Setup event handler
        addEvent(o, 'click', f);
        assertEquals(assert, 'not yet clicked', 0, pInt(o.innerHTML));

        // Fire it once
        fireEvent(o, 'click');
        assertEquals(assert, 'now clicked', 1, pInt(o.innerHTML));

        // Remove the handler (Only specifying event type)
        removeEvent(o, 'click');

        // Fire it again, should do nothing, since the handler is removed
        fireEvent(o, 'click');
        assertEquals(assert, 'clicked again, no change', 1, pInt(o.innerHTML));
    });

    /**
     * Test event add/fire/remove on DOM element.
     *
     * The counter is stored as innerHTML in a div.
     */
    QUnit.test('DomElementEventRemoveHandler', function (assert) {
        /* :DOC += <div id="o">0</div>*/
        $('<div id="o">0</div>').appendTo(document.body);
        var o = document.getElementById('o'),
            f = function () {
                o.innerHTML = pInt(o.innerHTML) + 1;
            };

        // 1. Test custom events.
        // Setup event handler
        addEvent(o, 'customEvent', f);
        assertEquals(assert, 'custom not yet clicked', 0, pInt(o.innerHTML));

        // Fire it once
        fireEvent(o, 'customEvent', null, null);
        assertEquals(assert, 'custom clicked', 1, pInt(o.innerHTML));

        // Remove the handler (Most fine-grained)
        removeEvent(o, 'customEvent', f);

        // Fire it again, should do nothing, since the handler is removed
        fireEvent(o, 'customEvent', null, null);
        assertEquals(
            assert,
            'custom clicked again, no change',
            1,
            pInt(o.innerHTML)
        );

        // 2. Test HTML events
        // Reset the counter
        o.innerHTML = 0;

        // Setup event handler
        addEvent(o, 'click', f);
        assertEquals(assert, 'not yet clicked', 0, pInt(o.innerHTML));

        // Fire it once
        fireEvent(o, 'click');
        assertEquals(assert, 'now clicked', 1, pInt(o.innerHTML));

        // Remove the handler (Most fine-grained)
        removeEvent(o, 'click', f);

        // Fire it again, should do nothing, since the handler is removed
        fireEvent(o, 'click');
        assertEquals(assert, 'clicked again, no change', 1, pInt(o.innerHTML));
    });

    QUnit.test('Event assigned as null (#5311)', function (assert) {
        assert.expect(0);
        var chart = Highcharts.chart('container', {
            chart: {
                events: {
                    redraw: null
                }
            },

            series: [
                {
                    data: [1, 3, 2, 4]
                }
            ]
        });

        chart.setSize(400, 300, false);
    });

    QUnit.test('Unbinding prototype event', function (assert) {
        var unbind = addEvent(Highcharts.Chart, 'render', function () {
            assert.ok(false, 'This event should never fire');
        });
        unbind();
        Highcharts.chart('container', {});

        assert.ok(true, 'Chart should render');
    });

    QUnit.test('Event order', assert => {
        var obj = {},
            calls = [];

        [undefined, { order: 2 }, undefined, { order: 1 }].forEach(
            options => {
                addEvent(
                    obj,
                    'hit',
                    () => {
                        calls.push(options ? options.order : undefined);
                    },
                    options
                );
            }
        );

        fireEvent(obj, 'hit');

        assert.deepEqual(
            calls,
            [1, 2, undefined, undefined],
            'Events should be fired in ascending order'
        );
    });

    QUnit.test('Events in extended classes', assert => {
        const results = [];

        function Series() {}
        Series.prototype.type = 'line';

        const ColumnSeries = Highcharts.extendClass(Series, {
            type: 'column'
        });
        const item = new ColumnSeries();

        addEvent(Series, 'touch', () => results.push('Series'));
        addEvent(ColumnSeries, 'touch', () => results.push('ColumnSeries'));

        addEvent(item, 'touch', () => results.push('item'));

        fireEvent(item, 'touch');
        assert.deepEqual(
            results,
            ['Series', 'ColumnSeries', 'item'],
            'All levels of the prototype chain should fire'
        );

        const line = new Series();
        results.length = 0;
        fireEvent(line, 'touch');
        assert.deepEqual(
            results,
            ['Series'],
            `Only the Series class event should fire on a Series
            instance`
        );

        // Removed
        results.length = 0;
        removeEvent(ColumnSeries, 'touch');
        fireEvent(item, 'touch');
        assert.deepEqual(
            results,
            ['Series', 'item'],
            'Remaining levels of the prototype chain should fire'
        );

        // Remove all
        results.length = 0;
        removeEvent(Series, 'touch');
        removeEvent(item, 'touch');
        fireEvent(item, 'touch');
        assert.deepEqual(results, [], 'No events should fire');

        // Add randomly ordered events spread over the prototype chain
        results.length = 0;
        addEvent(Series, 'touch', () => results.push('Series.3'), { order: 3 });
        addEvent(Series, 'touch', () => results.push('Series.1'), { order: 1 });

        addEvent(ColumnSeries, 'touch', () => results.push('ColumnSeries.2'), {
            order: 2
        });
        addEvent(ColumnSeries, 'touch', () => results.push('ColumnSeries.0'), {
            order: 0
        });

        addEvent(item, 'touch', () => results.push('item.4'), { order: 4 });

        addEvent(item, 'touch', () => results.push('item.-1'), { order: -1 });
        fireEvent(item, 'touch');
        assert.deepEqual(
            results,
            [
                'item.-1',
                'ColumnSeries.0',
                'Series.1',
                'ColumnSeries.2',
                'Series.3',
                'item.4'
            ],
            'Events should fire in order across the prototype chain'
        );
    });

    QUnit.test('FireEvent on dom element keeps params', assert => {
        const container = document.getElementById('container');
        const value = 'test';

        Highcharts.addEvent(container, 'testEvent', function (e) {
            e.test = value;
        });

        Highcharts.fireEvent(container, 'testEvent', { a: 'test' }, function (e) {
            assert.equal(e.test, value);
        });

        const obj = {};

        Highcharts.addEvent(obj, 'testEvent2', function (e) {
            e.test = value;
        });

        Highcharts.fireEvent(obj, 'testEvent2', { a: 'testt2' }, function (e) {
            assert.equal(e.test, value);
        });
    });
}());
