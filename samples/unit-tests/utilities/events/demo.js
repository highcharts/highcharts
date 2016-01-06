/* eslint func-style:0 */
$(function () {

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
                assertEquals(assert, 'preventDefault should exist', typeof e.preventDefault, 'function');
            };

        // Setup event handler
        addEvent(o, 'customEvent', f);

        // Fire it once
        fireEvent(o, 'customEvent', { inc: 1 }, null);

        // Remove the handler (Most fine-grained)
        removeEvent(o, 'customEvent', f);
    });

    /**
     * Tests that it is possible to prevent the default action by calling preventDefault.
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
    QUnit.test('ObjectEventPreventDefaultByFunctionMultiple', function (assert) {
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

        // Fire it again, should fire 'g' which is not preventing the default
        fireEvent(o, 'customEvent', { inc: 10 }, defaultFunction);
        assertEquals(assert, 'clicked again, no change', 22, o.clickedCount); // 2 (from before) + 2 * 10 (handler + default)
        removeEvent(o, 'customEvent', g);
    });

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

        // Fire it again, should only run the default function, since the handler is removed
        fireEvent(o, 'customEvent', { inc: 2 }, defaultFunction);
        assertEquals(assert, 'clicked again, no change', 6, o.clickedCount);
    });

    /**
     * Tests that properties set in the handler is passed on to the default function.
     */
    QUnit.test('ObjectEventPropertiesSetInHandlerSuppliedToDefaultFunction', function (assert) {
        var o = { clickedCount: 0 },
            f = function (e) {
                o.clickedCount += e.inc;
                e.extraInc = 100;
            },
            defaultFunction = function (e) {
                o.clickedCount += e.inc;
                o.clickedCount += (e.extraInc || 0);
            };

        // Setup event handler
        addEvent(o, 'customEvent', f);
        assertEquals(assert, 'not yet clicked', 0, o.clickedCount);

        // Fire it once
        fireEvent(o, 'customEvent', { inc: 2 }, defaultFunction);

        assertEquals(assert, 'now clicked', 104, o.clickedCount);

        // Remove the handler (Most fine-grained)
        removeEvent(o, 'customEvent', f);

        // Fire it again, should only run the default function, since the handler is removed
        fireEvent(o, 'customEvent', { inc: 2 }, defaultFunction);
        assertEquals(assert, 'clicked again, no change', 106, o.clickedCount);
    });

    /**
     * Tests that the default function is executed even when no listeners are registered.
     */
    QUnit.test('ObjectEventDefaultFunctionShouldRunWhenNoHandlersAreRegistered', function (assert) {
        var o = { clickedCount: 0 },
            defaultFunction = function (e) {
                o.clickedCount += e.inc;
            };

        // Fire it, should only run the default function, since there is no handler
        fireEvent(o, 'customEvent', { inc: 1 }, defaultFunction);
        assertEquals(assert, 'clicked again, no change', 1, o.clickedCount);
    });

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
        assertEquals(assert, 'custom clicked again, no change', 1, pInt(o.innerHTML));


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
        assertEquals(assert, 'custom clicked again, no change', 1, pInt(o.innerHTML));

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
        /*:DOC += <div id="o">0</div>*/
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
        assertEquals(assert, 'custom clicked again, no change', 1, pInt(o.innerHTML));

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


});