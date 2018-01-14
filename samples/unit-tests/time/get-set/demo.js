(function () {
    var isCET = (
        new Date().toString().indexOf('CET') !== -1 ||
        new Date().toString().indexOf('CEST') !== -1
    );


    function checkHours(name, month, day) {
        QUnit[isCET ? 'test' : 'skip'](name + ' - set and get hours across DST transition', function (assert) {
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
                offsetsLocal = [],
                madeTimesTZ = [],
                madeTimesLocal = [];

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

                // makeTime tests
                /*
                madeTimesTZ.push(
                    new Date(
                        timeTZ.makeTime(2017, 9, 28, hours, 0, 0)
                    ).toISOString()
                );
                madeTimesLocal.push(
                    new Date(
                        timeLocal.makeTime(2017, 9, 28, hours, 0, 0)
                    ).toISOString()
                );
                */
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

            assert.deepEqual(
                madeTimesTZ,
                madeTimesLocal,
                'Time.makeTime: Specific CET should equal local CET'
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


        });
    }

    checkHours('Spring', 2, 26);
    checkHours('Autumn', 9, 29);


    function checkDays(name, month) {
        QUnit[isCET ? 'test' : 'skip'](name + ' - set and get days across DST transition', function (assert) {
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
                offsetsLocal = [],
                madeTimesTZ = [],
                madeTimesLocal = [];

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

                // makeTime tests
                /*
                madeTimesTZ.push(
                    new Date(
                        timeTZ.makeTime(2017, 9, 28, hours, 0, 0)
                    ).toISOString()
                );
                madeTimesLocal.push(
                    new Date(
                        timeLocal.makeTime(2017, 9, 28, hours, 0, 0)
                    ).toISOString()
                );
                */
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

            assert.deepEqual(
                madeTimesTZ,
                madeTimesLocal,
                'Time.makeTime: Specific CET should equal local CET'
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


        });
    }


    checkDays('Spring', 2);
    checkDays('Autumn', 9);
}());