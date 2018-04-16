QUnit[TestUtilities.isCET ? 'test' : 'skip'](
    name + ' - set and get hours across DST transition',
    function (assert) {

        function checkHours(name, month, day) {
            var timeTZ = new Highcharts.Time({
                timezone: 'CET'
            });
            var timeLocal = new Highcharts.Time({
                useUTC: false
            });

            var datesTZ = [],
                datesLocal = [],
                getsTZ = [],
                getsLocal = [],
                offsetsTZ = [],
                offsetsLocal = [];

            var ms, dateTZ, dateLocal;

            for (var hours = 20; hours < 50; hours++) {
                ms = Date.UTC(2022, month, day, hours, 0, 0);
                dateTZ = new Date(ms);
                dateLocal = new Date(ms);

                // Getters
                getsTZ.push(timeTZ.get('Hours', dateTZ));
                getsLocal.push(timeLocal.get('Hours', dateLocal));

                // Setters. Generate different times and set the hour to 0. Test
                // which date it lands on.
                timeTZ.set('Hours', dateTZ, 0);
                timeLocal.set('Hours', dateLocal, 0);
                datesTZ.push(dateTZ.toString());
                datesLocal.push(dateLocal.toString());

                // Timezone offsets
                offsetsTZ.push(timeTZ.getTimezoneOffset(dateTZ));
                offsetsLocal.push(timeLocal.getTimezoneOffset(dateLocal));

            }

            assert.deepEqual(
                getsTZ,
                getsLocal,
                'Time getters: Specific CET should equal local CET'
            );


            assert.deepEqual(
                datesTZ,
                datesLocal,
                'Time setters: Specific CET should equal local CET'
            );

            assert.deepEqual(
                offsetsTZ,
                offsetsLocal,
                'Time.getTimezoneOffset: Specific CET should equal local CET'
            );


            /*
            console.table(datesTZ.map((dateTZ, i) => ({
                datesTZ: datesTZ[i],
                datesLocal: datesLocal[i]
            })));
            // */
            /*

                var ticks = time.getTimeTicks(
                    {
                        unitRange: 36e5,
                        count: 1
                    },
                    Date.UTC(2017, 9, 28, 20),
                    Date.UTC(2017, 9, 29, 10)
                );
                console.table(
                    ticks.map(tick => ({
                        'UTC':  new Date(tick).getUTCHours(),
                        'Prod':  time.dateFormat('%H', tick),
                        'time.get':  time.get('Hours', new Date(tick))
                    }))
                );
            //*/

        }

        checkHours('Spring', 2, 26);
        checkHours('Autumn', 9, 29);
    }
);

QUnit[TestUtilities.isCET ? 'test' : 'skip'](
    name + ' - set and get days across DST transition',
    function (assert) {

        function checkDays(name, month) {

            var timeTZ = new Highcharts.Time({
                timezone: 'CET'
            });
            var timeLocal = new Highcharts.Time({
                useUTC: false
            });

            var datesTZ = [],
                datesLocal = [],
                getsTZ = [],
                getsLocal = [],
                offsetsTZ = [],
                offsetsLocal = [];

            var ms, dateTZ, dateLocal;

            for (var day = 1; day < 35; day++) {
                ms = Date.UTC(2022, month, day, 0, 0, 0);
                dateTZ = new Date(ms);
                dateLocal = new Date(ms);

                // Getters
                getsTZ.push(timeTZ.get('Hours', dateTZ));
                getsLocal.push(timeLocal.get('Hours', dateLocal));

                // Setters. Generate different times and set the date to 0. Test
                // which date it lands on.
                timeTZ.set('Date', dateTZ, 1);
                timeLocal.set('Date', dateLocal, 1);
                datesTZ.push(dateTZ.toString());
                datesLocal.push(dateLocal.toString());

                // Timezone offsets
                offsetsTZ.push(timeTZ.getTimezoneOffset(dateTZ));
                offsetsLocal.push(timeLocal.getTimezoneOffset(dateLocal));

            }

            assert.deepEqual(
                getsTZ,
                getsLocal,
                'Time getters: Specific CET should equal local CET'
            );


            assert.deepEqual(
                datesTZ,
                datesLocal,
                'Time setters: Specific CET should equal local CET'
            );

            assert.deepEqual(
                offsetsTZ,
                offsetsLocal,
                'Time.getTimezoneOffset: Specific CET should equal local CET'
            );

            /*
            console.table(datesTZ.map((dateTZ, i) => ({
                datesTZ: datesTZ[i],
                datesLocal: datesLocal[i]
            })));
            // */
            /*

            var ticks = time.getTimeTicks(
                {
                    unitRange: 36e5,
                    count: 1
                },
                Date.UTC(2017, 9, 28, 20),
                Date.UTC(2017, 9, 29, 10)
            );
            console.table(
                ticks.map(tick => ({
                    'UTC':  new Date(tick).getUTCHours(),
                    'Prod':  time.dateFormat('%H', tick),
                    'time.get':  time.get('Hours', new Date(tick))
                }))
            );
            //*/

        }

        checkDays('Spring', 2);
        checkDays('Autumn', 9);
    }
);

QUnit[TestUtilities.isCET ? 'test' : 'skip'](
    'All levels setters',
    function (assert) {

        var timeTZ = new Highcharts.Time({
                timezone: 'CET'
            }),
            timeLocal = new Highcharts.Time({
                useUTC: false
            });

        var ms = Date.UTC(2022, 9, 29, 23, 30),
            dateTZ = new Date(ms),
            dateLocal = new Date(ms);

        timeTZ.set('Minutes', dateTZ, 0);
        timeLocal.set('Minutes', dateLocal, 0);
        assert.strictEqual(
            dateTZ.toString(),
            dateLocal.toString(),
            'Set minutes inside the DST transition'
        );

        [
            'Milliseconds',
            'Seconds',
            'Minutes',
            'Hours',
            'Date',
            'Month',
            'FullYear'
        ].forEach(function (key) {
            var dateTZ = new Date(
                    Date.UTC(2022, 11, 31, 22, 59, 59)
                ),
                dateLocal = new Date(
                    Date.UTC(2022, 11, 31, 22, 59, 59)
                );

            timeTZ.set(key, dateTZ, 0);
            timeLocal.set(key, dateLocal, 0);

            assert.strictEqual(
                dateTZ.toString(),
                dateLocal.toString(),
                key + ' set to 0, CET should be the same as local time'
            );
        });
    }
);

QUnit[TestUtilities.isCET ? 'test' : 'skip'](
    'Maketime',
    function (assert) {

        var timeTZ = new Highcharts.Time({
                timezone: 'CET'
            }),
            timeLocal = new Highcharts.Time({
                useUTC: false
            });

        for (var hours = 24; hours < 30; hours++) {
            for (var minutes = 0; minutes < 60; minutes += 15) {
                var tz = new Date(
                    timeTZ.makeTime(2017, 9, 28, hours, minutes, 0)
                ).toString();

                var local = new Date(
                    timeLocal.makeTime(2017, 9, 28, hours, minutes, 0)
                ).toString();

                assert.strictEqual(
                    tz,
                    local,
                    'UTC ' + hours + ':' + minutes + ' - CET time should be same as local'
                );
            }
        }
    }
);
