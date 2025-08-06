QUnit.test(
    'Time.parse',
    assert => {
        const time = new Highcharts.Time();

        // #22707
        assert.strictEqual(
            typeof time.parse('2025-01'),
            'number',
            'Short month format YYYY-MM should parse to number in all browsers'
        );
        assert.strictEqual(
            time.parse('2025-01'),
            time.parse('2025-01-01'),
            'YYYY-MM should mean the same as YYYY-MM-DD regardless of timezone'
        );
    }
);

QUnit.test(
    'Parsing dates with timezone information',
    function (assert) {
        const time = new Highcharts.Time({}),
            samples = [
                '2018-03-13T17:00:00+00:00',
                '2018-03-13T20:00:00+03:00',
                // '2018-03-13T20:00:00+03',
                '2018-03-13T17:00:00GMT',
                '2018-03-13T07:00:00GMT-1000',
                '2018-03-13T08:00:00GMT-09:00',
                '2018-03-13T17:00:00UTC',
                '2018-03-13T18:30:00UTC+0130',
                '2018-03-13T17:30:00UTC+00:30',
                '2018-03-13T17:00:00Z'
            ],
            expected = new Date(samples[0]).toISOString();


        samples
            .forEach(sample => {
                const timestamp = time.parse(sample);

                assert.strictEqual(
                    new Date(timestamp).toISOString(),
                    expected,
                    `Parsed dates should be the same. (Input: "${sample}")`
                );
            });
    }
);

QUnit.test(
    'Time.parse and DST crossover with given time zone',
    assert => {
        const time = new Highcharts.Time({ timezone: 'Europe/Oslo' });

        const dates = [
            '2023-03-25 22:00',
            '2023-03-25 23:00',
            '2023-03-26 00:00',
            '2023-03-26 01:00',
            '2023-03-26 02:00',
            '2023-03-26 03:00'
        ];

        assert.deepEqual(
            dates.map(date => new Date(time.parse(date)).toUTCString()),
            [
                'Sat, 25 Mar 2023 21:00:00 GMT',
                'Sat, 25 Mar 2023 22:00:00 GMT',
                // Crossover, 23:00 is repeated
                'Sat, 25 Mar 2023 23:00:00 GMT',
                'Sat, 25 Mar 2023 23:00:00 GMT',
                'Sun, 26 Mar 2023 00:00:00 GMT',
                'Sun, 26 Mar 2023 01:00:00 GMT'
            ],
            'Parsed dates should be correct.'
        );
    }
);