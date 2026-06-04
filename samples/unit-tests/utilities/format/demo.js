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

        // European thousands separator and decimal point
        Highcharts.setOptions({
            lang: {
                decimalPoint: ',',
                thousandsSep: '.'
            }
        });
        assert.strictEqual(
            '12.345,68',
            format('{point.long:,.2f}', { point: point }),
            'European format (#22402)'
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
        delete Highcharts.defaultOptions.lang.decimalPoint;
        delete Highcharts.defaultOptions.lang.thousandsSep;
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

        // Format %O as timezone offset to local time (#22329)
        let dateFormatCtx;
        Highcharts.dateFormats.O = (timestamp, ctx) => {
            dateFormatCtx = ctx;
            return '+0100';
        };
        assert.strictEqual(
            format(
                '{ucfirst (point.key:%d.%m.%Y %H:%M:%S %O)}',
                {
                    point: {
                        key: Date.UTC(2024, 11, 11)
                    }
                }
            ),
            '11.12.2024 00:00:00 +0100',
            'Custom date format with plus sign'
        );
        assert.strictEqual(
            dateFormatCtx,
            Highcharts.time,
            'Custom date format callback got time ctx as the last argument'
        );
        delete Highcharts.dateFormats.O;

    });

    QUnit.test('Locale-based formatting', assert => {
        const originalLocale = Highcharts.defaultOptions.lang.locale;
        Highcharts.setOptions({
            lang: {
                locale: 'no'
            }
        });

        assert.strictEqual(
            format('{value:.2f}', { value: 1.5 }),
            '1,50',
            'Should format number with locale-based decimal separator.'
        );

        // Reset
        Highcharts.setOptions({
            lang: {
                locale: originalLocale
            }
        });
    });

    QUnit.test('Locale-aware templating and ucfirst', function (assert) {

        // #23462
        // Exhaustive locale list from
        // https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-core/availableLocales.json
        const locales = Intl.DateTimeFormat.supportedLocalesOf([
            'aa',
            'aa-DJ',
            'aa-ER',
            'ab',
            'af',
            'af-NA',
            'agq',
            'ak',
            'am',
            'an',
            'ann',
            'apc',
            'ar',
            'ar-AE',
            'ar-BH',
            'ar-DJ',
            'ar-DZ',
            'ar-EG',
            'ar-EH',
            'ar-ER',
            'ar-IL',
            'ar-IQ',
            'ar-JO',
            'ar-KM',
            'ar-KW',
            'ar-LB',
            'ar-LY',
            'ar-MA',
            'ar-MR',
            'ar-OM',
            'ar-PS',
            'ar-QA',
            'ar-SA',
            'ar-SD',
            'ar-SO',
            'ar-SS',
            'ar-SY',
            'ar-TD',
            'ar-TN',
            'ar-YE',
            'arn',
            'as',
            'asa',
            'ast',
            'az',
            'az-Arab',
            'az-Arab-IQ',
            'az-Arab-TR',
            'az-Cyrl',
            'az-Latn',
            'ba',
            'bal',
            'bal-Arab',
            'bal-Latn',
            'bas',
            'be',
            'be-tarask',
            'bem',
            'bew',
            'bez',
            'bg',
            'bgc',
            'bgn',
            'bgn-AE',
            'bgn-AF',
            'bgn-IR',
            'bgn-OM',
            'bho',
            'blo',
            'blt',
            'bm',
            'bm-Nkoo',
            'bn',
            'bn-IN',
            'bo',
            'bo-IN',
            'bqi',
            'br',
            'brx',
            'bs',
            'bs-Cyrl',
            'bs-Latn',
            'bss',
            'bua',
            'byn',
            'ca',
            'ca-AD',
            'ca-ES-valencia',
            'ca-FR',
            'ca-IT',
            'cad',
            'cch',
            'ccp',
            'ccp-IN',
            'ce',
            'ceb',
            'cgg',
            'cho',
            'chr',
            'cic',
            'ckb',
            'ckb-IR',
            'co',
            'cop',
            'cs',
            'csw',
            'cu',
            'cv',
            'cy',
            'da',
            'da-GL',
            'dav',
            'de',
            'de-AT',
            'de-BE',
            'de-CH',
            'de-IT',
            'de-LI',
            'de-LU',
            'dje',
            'doi',
            'dsb',
            'dua',
            'dv',
            'dyo',
            'dz',
            'ebu',
            'ee',
            'ee-TG',
            'el',
            'el-CY',
            'el-polyton',
            'en',
            'en-001',
            'en-150',
            'en-AE',
            'en-AG',
            'en-AI',
            'en-AS',
            'en-AT',
            'en-AU',
            'en-BB',
            'en-BE',
            'en-BI',
            'en-BM',
            'en-BS',
            'en-BW',
            'en-BZ',
            'en-CA',
            'en-CC',
            'en-CH',
            'en-CK',
            'en-CM',
            'en-CX',
            'en-CY',
            'en-CZ',
            'en-DE',
            'en-DG',
            'en-DK',
            'en-DM',
            'en-Dsrt',
            'en-EE',
            'en-ER',
            'en-ES',
            'en-FI',
            'en-FJ',
            'en-FK',
            'en-FM',
            'en-FR',
            'en-GB',
            'en-GD',
            'en-GE',
            'en-GG',
            'en-GH',
            'en-GI',
            'en-GM',
            'en-GS',
            'en-GU',
            'en-GY',
            'en-HK',
            'en-HU',
            'en-ID',
            'en-IE',
            'en-IL',
            'en-IM',
            'en-IN',
            'en-IO',
            'en-IT',
            'en-JE',
            'en-JM',
            'en-JP',
            'en-KE',
            'en-KI',
            'en-KN',
            'en-KY',
            'en-LC',
            'en-LR',
            'en-LS',
            'en-LT',
            'en-LV',
            'en-MG',
            'en-MH',
            'en-MO',
            'en-MP',
            'en-MS',
            'en-MT',
            'en-MU',
            'en-MV',
            'en-MW',
            'en-MY',
            'en-NA',
            'en-NF',
            'en-NG',
            'en-NL',
            'en-NO',
            'en-NR',
            'en-NU',
            'en-NZ',
            'en-PG',
            'en-PH',
            'en-PK',
            'en-PL',
            'en-PN',
            'en-PR',
            'en-PT',
            'en-PW',
            'en-RO',
            'en-RW',
            'en-SB',
            'en-SC',
            'en-SD',
            'en-SE',
            'en-SG',
            'en-SH',
            'en-SI',
            'en-SK',
            'en-SL',
            'en-SS',
            'en-SX',
            'en-SZ',
            'en-Shaw',
            'en-TC',
            'en-TK',
            'en-TO',
            'en-TT',
            'en-TV',
            'en-TZ',
            'en-UA',
            'en-UG',
            'en-UM',
            'en-VC',
            'en-VG',
            'en-VI',
            'en-VU',
            'en-WS',
            'en-ZA',
            'en-ZM',
            'en-ZW',
            'eo',
            'es',
            'es-419',
            'es-AR',
            'es-BO',
            'es-BR',
            'es-BZ',
            'es-CL',
            'es-CO',
            'es-CR',
            'es-CU',
            'es-DO',
            'es-EA',
            'es-EC',
            'es-GQ',
            'es-GT',
            'es-HN',
            'es-IC',
            'es-MX',
            'es-NI',
            'es-PA',
            'es-PE',
            'es-PH',
            'es-PR',
            'es-PY',
            'es-SV',
            'es-US',
            'es-UY',
            'es-VE',
            'et',
            'eu',
            'ewo',
            'fa',
            'fa-AF',
            'ff',
            'ff-Adlm',
            'ff-Adlm-BF',
            'ff-Adlm-CM',
            'ff-Adlm-GH',
            'ff-Adlm-GM',
            'ff-Adlm-GW',
            'ff-Adlm-LR',
            'ff-Adlm-MR',
            'ff-Adlm-NE',
            'ff-Adlm-NG',
            'ff-Adlm-SL',
            'ff-Adlm-SN',
            'ff-Latn',
            'ff-Latn-BF',
            'ff-Latn-CM',
            'ff-Latn-GH',
            'ff-Latn-GM',
            'ff-Latn-GN',
            'ff-Latn-GW',
            'ff-Latn-LR',
            'ff-Latn-MR',
            'ff-Latn-NE',
            'ff-Latn-NG',
            'ff-Latn-SL',
            'fi',
            'fil',
            'fo',
            'fo-DK',
            'fr',
            'fr-BE',
            'fr-BF',
            'fr-BI',
            'fr-BJ',
            'fr-BL',
            'fr-CA',
            'fr-CD',
            'fr-CF',
            'fr-CG',
            'fr-CH',
            'fr-CI',
            'fr-CM',
            'fr-DJ',
            'fr-DZ',
            'fr-GA',
            'fr-GF',
            'fr-GN',
            'fr-GP',
            'fr-GQ',
            'fr-HT',
            'fr-KM',
            'fr-LU',
            'fr-MA',
            'fr-MC',
            'fr-MF',
            'fr-MG',
            'fr-ML',
            'fr-MQ',
            'fr-MR',
            'fr-MU',
            'fr-NC',
            'fr-NE',
            'fr-PF',
            'fr-PM',
            'fr-RE',
            'fr-RW',
            'fr-SC',
            'fr-SN',
            'fr-SY',
            'fr-TD',
            'fr-TG',
            'fr-TN',
            'fr-VU',
            'fr-WF',
            'fr-YT',
            'frr',
            'fur',
            'fy',
            'ga',
            'ga-GB',
            'gaa',
            'gd',
            'gez',
            'gez-ER',
            'gl',
            'gn',
            'gsw',
            'gsw-FR',
            'gsw-LI',
            'gu',
            'guz',
            'gv',
            'ha',
            'ha-Arab',
            'ha-Arab-SD',
            'ha-GH',
            'ha-NE',
            'haw',
            'he',
            'hi',
            'hi-Latn',
            'hnj',
            'hnj-Hmnp',
            'hr',
            'hr-BA',
            'hsb',
            'ht',
            'hu',
            'hy',
            'ia',
            'id',
            'ie',
            'ig',
            'ii',
            'io',
            'is',
            'it',
            'it-CH',
            'it-SM',
            'it-VA',
            'iu',
            'iu-Latn',
            'ja',
            'jbo',
            'jgo',
            'jmc',
            'jv',
            'ka',
            'kaa',
            'kaa-Cyrl',
            'kaa-Latn',
            'kab',
            'kaj',
            'kam',
            'kcg',
            'kde',
            'kea',
            'kek',
            'ken',
            'kgp',
            'khq',
            'ki',
            'kk',
            'kk-Arab',
            'kk-Cyrl',
            'kk-KZ',
            'kkj',
            'kl',
            'kln',
            'km',
            'kn',
            'ko',
            'ko-CN',
            'ko-KP',
            'kok',
            'kok-Deva',
            'kok-Latn',
            'kpe',
            'kpe-GN',
            'ks',
            'ks-Arab',
            'ks-Deva',
            'ksb',
            'ksf',
            'ksh',
            'ku',
            'ku-Arab',
            'ku-Arab-IR',
            'ku-Latn',
            'ku-Latn-IQ',
            'ku-Latn-SY',
            'ku-TR',
            'kw',
            'kxv',
            'kxv-Deva',
            'kxv-Latn',
            'kxv-Orya',
            'kxv-Telu',
            'ky',
            'la',
            'lag',
            'lb',
            'lg',
            'lij',
            'lkt',
            'lld',
            'lmo',
            'ln',
            'ln-AO',
            'ln-CF',
            'ln-CG',
            'lo',
            'lrc',
            'lrc-IQ',
            'lt',
            'ltg',
            'lu',
            'luo',
            'luy',
            'lv',
            'lzz',
            'mai',
            'mas',
            'mas-TZ',
            'mdf',
            'mer',
            'mfe',
            'mg',
            'mgh',
            'mgo',
            'mhn',
            'mi',
            'mic',
            'mk',
            'ml',
            'mn',
            'mn-Mong',
            'mn-Mong-MN',
            'mni',
            'mni-Beng',
            'mni-Mtei',
            'moh',
            'mr',
            'ms',
            'ms-Arab',
            'ms-Arab-BN',
            'ms-BN',
            'ms-ID',
            'ms-SG',
            'mt',
            'mua',
            'mus',
            'mww',
            'mww-Hmnp',
            'my',
            'myv',
            'mzn',
            'naq',
            'nb',
            'nb-SJ',
            'nd',
            'nds',
            'nds-NL',
            'ne',
            'ne-IN',
            'nl',
            'nl-AW',
            'nl-BE',
            'nl-BQ',
            'nl-CW',
            'nl-SR',
            'nl-SX',
            'nmg',
            'nn',
            'nnh',
            'no',
            'nqo',
            'nr',
            'nso',
            'nus',
            'nv',
            'ny',
            'nyn',
            'oc',
            'oc-ES',
            'oka',
            'oka-US',
            'om',
            'om-KE',
            'or',
            'os',
            'os-RU',
            'osa',
            'pa',
            'pa-Arab',
            'pa-Guru',
            'pap',
            'pap-AW',
            'pcm',
            'pi',
            'pi-Latn',
            'pis',
            'pl',
            'pms',
            'prg',
            'ps',
            'ps-PK',
            'pt',
            'pt-AO',
            'pt-CH',
            'pt-CV',
            'pt-GQ',
            'pt-GW',
            'pt-LU',
            'pt-MO',
            'pt-MZ',
            'pt-PT',
            'pt-ST',
            'pt-TL',
            'qu',
            'qu-BO',
            'qu-EC',
            'quc',
            'raj',
            'rhg',
            'rhg-Rohg',
            'rhg-Rohg-BD',
            'rif',
            'rm',
            'rn',
            'ro',
            'ro-MD',
            'rof',
            'ru',
            'ru-BY',
            'ru-KG',
            'ru-KZ',
            'ru-MD',
            'ru-UA',
            'rw',
            'rwk',
            'sa',
            'sah',
            'saq',
            'sat',
            'sat-Deva',
            'sat-Olck',
            'sbp',
            'sc',
            'scn',
            'sd',
            'sd-Arab',
            'sd-Deva',
            'sdh',
            'sdh-IQ',
            'se',
            'se-FI',
            'se-SE',
            'seh',
            'ses',
            'sg',
            'sgs',
            'shi',
            'shi-Latn',
            'shi-Tfng',
            'shn',
            'shn-TH',
            'si',
            'sid',
            'sk',
            'skr',
            'sl',
            'sma',
            'sma-NO',
            'smj',
            'smj-NO',
            'smn',
            'sms',
            'sn',
            'so',
            'so-DJ',
            'so-ET',
            'so-KE',
            'sq',
            'sq-MK',
            'sq-XK',
            'sr',
            'sr-Cyrl',
            'sr-Cyrl-BA',
            'sr-Cyrl-ME',
            'sr-Cyrl-XK',
            'sr-Latn',
            'sr-Latn-BA',
            'sr-Latn-ME',
            'sr-Latn-XK',
            'ss',
            'ss-SZ',
            'ssy',
            'st',
            'st-LS',
            'su',
            'su-Latn',
            'suz',
            'suz-Deva',
            'suz-Sunu',
            'sv',
            'sv-AX',
            'sv-FI',
            'sw',
            'sw-CD',
            'sw-KE',
            'sw-UG',
            'syr',
            'syr-SY',
            'szl',
            'ta',
            'ta-LK',
            'ta-MY',
            'ta-SG',
            'te',
            'teo',
            'teo-KE',
            'tg',
            'th',
            'ti',
            'ti-ER',
            'tig',
            'tk',
            'tn',
            'tn-BW',
            'to',
            'tok',
            'tpi',
            'tr',
            'tr-CY',
            'trv',
            'trw',
            'ts',
            'tt',
            'twq',
            'tyv',
            'tzm',
            'ug',
            'uk',
            'und',
            'ur',
            'ur-IN',
            'uz',
            'uz-Arab',
            'uz-Cyrl',
            'uz-Latn',
            'vai',
            'vai-Latn',
            'vai-Vaii',
            've',
            'vec',
            'vi',
            'vmw',
            'vo',
            'vun',
            'wa',
            'wae',
            'wal',
            'wbp',
            'wo',
            'xh',
            'xnr',
            'xog',
            'yav',
            'yi',
            'yo',
            'yo-BJ',
            'yrl',
            'yrl-CO',
            'yrl-VE',
            'yue',
            'yue-Hans',
            'yue-Hant',
            'yue-Hant-CN',
            'yue-Hant-MO',
            'za',
            'zgh',
            'zh',
            'zh-Hans',
            'zh-Hans-HK',
            'zh-Hans-MO',
            'zh-Hans-MY',
            'zh-Hans-SG',
            'zh-Hant',
            'zh-Hant-HK',
            'zh-Hant-MO',
            'zh-Hant-MY',
            'zh-Latn',
            'zu'
        ]);

        locales.forEach(locale => {
            const time = new Highcharts.Time({ locale }),
                dateStr = time.dateFormat('%[AeBYHMS]', Date.UTC(2026, 5, 4)),
                ucfirstStr = format(`{ucfirst "${dateStr}"}`);

            assert.ok(
                ucfirstStr.indexOf('ucfirst') === -1,
                `locale = ${locale}: ${ucfirstStr}`
            );
        });
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
