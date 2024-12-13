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

        // Markup in format
        assert.strictEqual(
            format(
                '{value:<span style="font-size: 12px; font-weight: bold">' +
                '%Y</span>-%m-%d}',
                { value: Date.UTC(2023, 5, 5, 12) }
            ),
            '<span style="font-size: 12px; font-weight: bold">' +
                '2023</span>-06-05',
            'HTML inside format should be preserved'
        );

        assert.strictEqual(
            Highcharts.format('{point.y}', {}),
            '',
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

        assert.strictEqual(
            format('{ucfirst (point.date:søndag %Y-%m-%d)}', { point }),
            'Søndag 2012-01-01',
            'Non-ASCII characters should be preserved in formats'
        );

        assert.strictEqual(
            format('{ucfirst (point.date:%[Ymd])}', { point }),
            '01/01/2012',
            'Locale-aware date formats should work in expressions'
        );

        assert.strictEqual(
            format('{value:%b \u2019%y}', { value: 1706745600000 }),
            'Feb ’24',
            `Right single quotation mark shouldn't disable the format method,
            #21124.`
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
                '{#if point.isNull}{else}{point.value:.2f}{/if}',
                { point }
            ),
            '3.14',
            'Condition with empty block'
        );

        assert.strictEqual(
            format(
                `
                Value: {#if point.key}
                Deep,
                {#if point.deep}
                deeper: {point.deep.deeper}
                {else}
                Nested else
                {/if}
                {/if}
                `,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            'Value: Deep, deeper: 123',
            'Nested conditions'
        );

        const f = `
        {#if (lt value 3)}
            Green
        {else}
            {#if (lt value 7)}
                Yellow
            {else}
                Red
            {/if}
        {/if}
        `;

        assert.deepEqual(
            [2, 5, 8].map(value => format(f, { value }).trim()),
            ['Green', 'Yellow', 'Red'],
            'Nested conditions with sub expression'
        );

    });

    QUnit.test('each helper', assert => {
        assert.strictEqual(
            format(
                `{#each point.items}
                {@index}. {this}
                {#if @last}...{/if}
                {/each}`,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            '0. Ein 1. To 2. Tre ...',
            'Looping an array of strings'
        );

        assert.strictEqual(
            format(
                `{#each point.persons}
                {add @index 1}) {firstName} {lastName}
                {/each}`,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            '1) Mick Jagger 2) Keith Richards',
            'Looping an array of objects'
        );

        assert.strictEqual(
            format(
                `{#each nonexisting}
                - {firstName} {lastName}
                {else}
                Else-block
                {/each}`,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            'Else-block',
            'An else-block for a loop'
        );

    });

    QUnit.test('Custom helper function', assert => {
        // Custom, non-block  helper
        Highcharts.Templating.helpers.custom = (value, divisor) =>
            value / divisor;

        assert.strictEqual(
            format(
                '{custom point.deep.deeper 1000}',
                { point }
            ),
            '0.123',
            'Custom divide helper'
        );

        // Reset
        delete Highcharts.Templating.helpers.custom;
    });

    QUnit.test('Arithmetic helpers', assert => {
        assert.strictEqual(
            format(
                '{add meat potatoes}',
                {
                    meat: 'meat',
                    potatoes: 'potatoes'
                }
            ),
            'meatpotatoes',
            'Invalid types addition'
        );
        assert.strictEqual(
            format(
                '{divide 1 0}',
                {}
            ),
            '',
            'Division by zero'
        );
    });

    QUnit.test('Relational helpers', assert => {

        assert.strictEqual(
            format(
                '{#if (lt one 2)}true{/if}',
                {
                    one: 1
                }
            ),
            'true',
            'Less than'
        );
        assert.strictEqual(
            format(
                '{#if (lt one 1)}true{/if}',
                {
                    one: 1
                }
            ),
            '',
            'Less than'
        );
        assert.strictEqual(
            format(
                '{#if (le one 1)}true{/if}',
                {
                    one: 1
                }
            ),
            'true',
            'Less than or equal'
        );
        assert.strictEqual(
            format(
                '{#if (le one 2)}true{/if}',
                {
                    one: 1
                }
            ),
            'true',
            'Less than or equal'
        );

        assert.strictEqual(
            format(
                '{#ne 1 one}not equal{else}equal{/ne}',
                {
                    one: 1
                }
            ),
            'equal',
            'Shorthand relational'
        );

        assert.strictEqual(
            format(
                '{#eq foo "bar"}equal{else}not equal{/eq}',
                {
                    foo: 'bar'
                }
            ),
            'equal',
            'String comparison, double quotes'
        );

        assert.strictEqual(
            format(
                // eslint-disable-next-line quotes
                "{#eq foo 'bar'}equal{else}not equal{/eq}",
                {
                    foo: 'bar'
                }
            ),
            'equal',
            'String comparison, single quotes'
        );

        assert.strictEqual(
            format(
                '{#eq musketeer "D\'Artagnan"}equal{else}not equal{/eq}',
                {
                    musketeer: 'D\'Artagnan'
                }
            ),
            'equal',
            'String comparison, mixed quotes'
        );

        assert.strictEqual(
            format(
                '{#if (eq foo "bar")}equal{else}not equal{/if}',
                {
                    foo: 'bar'
                }
            ),
            'equal',
            'String comparison, sub expression'
        );
    });

    QUnit.test('Subexpressions', assert => {
        assert.strictEqual(
            format(
                '{celsius}℃ == {add (multiply celsius (divide 9 5)) 32}℉',
                { celsius: 20 }
            ),
            '20℃ == 68℉',
            'Nested subexpressions'
        );

        assert.strictEqual(
            format(
                '{(divide 22 7):.2f}',
                {}
            ),
            '3.14',
            'Number formatting on expression result'
        );

        assert.strictEqual(
            format(
                '{(divide 0 22):.2f}',
                {}
            ),
            '0.00',
            'Division of zero'
        );

        assert.strictEqual(
            format(
                '{(divide 22 0):.2f}',
                {}
            ),
            '',
            'Division by zero'
        );

        assert.strictEqual(
            format(
                'A {word} (outside bracket) is not a subexpression',
                {
                    word: 'parentheses'
                }
            ),
            'A parentheses (outside bracket) is not a subexpression',
            'A parentheses outside brackets should should not be touched'
        );

        assert.strictEqual(
            format(
                '{#if completed}Task {(completed)}% completed{/if}',
                {
                    completed: 50
                }
            ),
            'Task 50% completed',
            'Subexpression in conditional body should work'
        );

        assert.strictEqual(
            format(
                '{ucfirst "hello world"}',
                {
                    point: {
                        key: Date.UTC(2024, 0, 1)
                    }
                }
            ),
            'Hello world',
            'String literal argument'
        );

        assert.strictEqual(
            format(
                '{ucfirst (point.key:date %Y-%m-%d)}',
                {
                    point: {
                        key: Date.UTC(2024, 7, 23)
                    }
                }
            ),
            'Date 2024-08-23',
            'Date formatting with string output should be preserved'
        );

        assert.strictEqual(
            format(
                'Hello {"World"}',
                {}
            ),
            'Hello World',
            'Immediate string literal should resolve'
        );

        assert.strictEqual(
            format(
                'Hello {(key)}',
                { key: 'World' }
            ),
            'Hello World',
            'Immediate parenthesis should resolve'
        );

        assert.strictEqual(
            format(
                '<span>{(point.key:%a %d.%m.%y %H:%M)}</span><br>',
                { point: { key: Date.UTC(2024, 11, 11) } }
            ),
            '<span>Wed 11.12.24 00:00</span><br>',
            'Date formatting with parens and colon inside string should ' +
                'resolve (#22316)'
        );

        assert.strictEqual(
            format(
                'How people with {type} see {ucfirst (color)}',
                {
                    type: 'Tritanopia',
                    color: 'red'
                }
            ),
            'How people with Tritanopia see Red',
            'Strings with multiple expressions, sub in one, should resolve'
        );

        assert.strictEqual(
            format(
                '<span>{categories.(point.key)}</span>',
                {
                    categories: {
                        one: 'First',
                        two: 'Second'
                    },
                    point: {
                        key: 'two'
                    }
                }
            ),
            '<span>Second</span>',
            'String properties inside deep objects should resolve'
        );

    });

    QUnit.test('Error handling', assert => {
        assert.strictEqual(
            format(
                `{#each}
                - Item
                {/each}`,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            '',
            'Looping nothing'
        );
        assert.strictEqual(
            format(
                `{#each 122}
                - Item
                {/each}`,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            '',
            'Looping number'
        );
        assert.strictEqual(
            format(
                `{#each false}
                - Item
                {/each}`,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            '',
            'Looping bool'
        );
        assert.strictEqual(
            format(
                `{#each point.persons true}
                - Item
                {/each}`,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            '- Item - Item',
            'Looping excess arguments'
        );
    });


});
