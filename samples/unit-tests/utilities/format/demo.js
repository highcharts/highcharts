QUnit.module('Format', () => {
    const format = Highcharts.format;

    // Arrange
    const point = {
        key: 'January',
        value: Math.PI,
        long: 12345.6789,
        date: Date.UTC(2012, 0, 1),
        deep: {
            deeper: 123
        },
        dom: {
            string: 'Hello',
            container: document.getElementById('container'),
            doc: document,
            win: window
        },
        fn: function () {
            return 'Hello';
        },
        proto: new Date(),
        items: ['Ein', 'To', 'Tre'],
        persons: [{
            firstName: 'Mick',
            lastName: 'Jagger'
        }, {
            firstName: 'Keith',
            lastName: 'Richards'
        }]
    };

    const nullPoint = {
        isNull: true
    };

    QUnit.test('Replacement', function (assert) {

        assert.strictEqual(
            Math.PI.toString(),
            format('{point.value}', { point: point }),
            'Basic replacement'
        );

        assert.strictEqual(
            '3.14',
            format('{point.value:.2f}', { point: point }),
            'Replacement with two decimals'
        );

        // localized thousands separator and decimal point
        Highcharts.setOptions({
            lang: {
                decimalPoint: ',',
                thousandsSep: ' '
            }
        });
        assert.strictEqual(
            '12 345,68',
            format('{point.long:,.2f}', { point: point }),
            'Localized format'
        );

        // default thousands separator and decimal point
        Highcharts.setOptions({
            lang: {
                decimalPoint: '.',
                thousandsSep: ','
            }
        });
        assert.strictEqual(
            '12,345.68',
            format('{point.long:,.2f}', { point: point }),
            'Thousands separator format'
        );

        // Date format with colon
        assert.strictEqual(
            '00:00:00',
            format('{point.date:%H:%M:%S}', { point: point }),
            'Date format with colon'
        );

        // Deep access
        assert.strictEqual(
            '123',
            format('{point.deep.deeper}', { point: point }),
            'Deep access format'
        );

        // Shallow access
        assert.strictEqual(
            '123',
            format('{value}', { value: 123 }),
            'Shallow access format'
        );

        // Formatted shallow access
        assert.strictEqual(
            '123.00',
            format('{value:.2f}', { value: 123 }),
            'Shallow access format with decimals'
        );

        // Six decimals by default
        assert.strictEqual(
            '12345.567',
            format('{value:f}', { value: 12345.567 }),
            'Keep decimals by default'
        );

        // Complicated string format
        assert.strictEqual(
            'Key: January, value: 3.14, date: 2012-01-01.',
            format(
                'Key: {point.key}, value: {point.value:.2f}, date: ' +
                '{point.date:%Y-%m-%d}.',
                { point: point }
            ),
            'Complex string format'
        );

        assert.strictEqual(
            '',
            Highcharts.format('{point.y}', {}),
            'Do not choke on undefined objects (node-export-server#31)'
        );

        assert.strictEqual(
            format('{point.dom.string}', { point }),
            'Hello',
            'Primitive type verified'
        );

        assert.strictEqual(
            format('{point.dom.container}', { point }),
            '',
            'DOM nodes should not be accessible through format strings'
        );

        assert.strictEqual(
            format('{point.dom.container.ownerDocument.referrer}', { point }),
            '',
            'DOM properties should not be accessible through format strings'
        );

        assert.strictEqual(
            format('{point.dom.doc}', { point }),
            '',
            'The document should not be accessible through format strings'
        );

        assert.strictEqual(
            format('{point.dom.win}', { point }),
            '',
            'The window/global should not be accessible through format strings'
        );

        assert.strictEqual(
            format('{point.fn}', { point }),
            '',
            'Functions should not be accessible through format strings'
        );

        assert.strictEqual(
            format('{point.proto.__proto__}', { point }),
            '',
            'Prototypes should not be accessible through format strings'
        );

        // Reset
        Highcharts.setOptions({
            lang: {
                decimalPoint: '.',
                thousandsSep: ' '
            }
        });
    });

    QUnit.test('if helper', assert => {
        assert.strictEqual(
            format(
                'Value: {#if point.isNull}null{else}{point.value:.2f}{/if}',
                { point }
            ),
            'Value: 3.14',
            'Condition with falsy argument and else block'
        );

        assert.strictEqual(
            format(
                'Value: {#if nullPoint.isNull}null{else}{point.value:.2f}{/if}',
                { nullPoint }
            ),
            'Value: null',
            'Condition with true argument and else block'
        );

        assert.strictEqual(
            format(
                `
                Value: {#if point.key}
                Deep,
                {#if point.deep}
                deeper: {point.deep.deeper}
                {/if}
                {/if}
                `,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            'Value: Deep, deeper: 123',
            'Nested conditions'
        );

    });

    QUnit.test('foreach helper', assert => {
        assert.strictEqual(
            format(
                `{#foreach point.items}
                - {this}
                {/foreach}`,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            '- Ein - To - Tre',
            'Looping an array of strings'
        );

        assert.strictEqual(
            format(
                `{#foreach point.persons}
                - {firstName} {lastName}
                {/foreach}`,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            '- Mick Jagger - Keith Richards',
            'Looping an array of objects'
        );

    });

    QUnit.test('Custom helper function', assert => {
        // Custom, non-block  helper
        const divide = Highcharts.Templating.helpers.divide;
        Highcharts.Templating.helpers.divide = (value, divisor) =>
            value / divisor;

        assert.strictEqual(
            format(
                '{divide point.long 1000}',
                { point }
            ),
            '12.345678900000001',
            'Custom divide helper'
        );

        // Reset
        Highcharts.Templating.helpers.divide = divide;
    });


});
