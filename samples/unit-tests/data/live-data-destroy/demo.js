(function () {
    /**
     * Installs a fake XMLHttpRequest that answers every request asynchronously
     * with the given body, and keeps track of the requests that were made.
     *
     * @param {number} latency
     * Milliseconds before a request is answered.
     *
     * @param {Function} getBody
     * Callback returning the response body for a request.
     *
     * @return {Object}
     * The request log, with a `restore` method.
     */
    function interceptRequests(latency, getBody) {
        const win = Highcharts.win,
            originalXMLHttpRequest = win.XMLHttpRequest,
            log = {
                count: 0,
                afterDestroy: 0,
                errors: [],
                destroyed: false,
                restore: function () {
                    win.XMLHttpRequest = originalXMLHttpRequest;
                }
            };

        function FakeXMLHttpRequest() {}

        FakeXMLHttpRequest.prototype.open = function (method, url) {
            this.url = url;
        };
        FakeXMLHttpRequest.prototype.setRequestHeader = function () {};
        FakeXMLHttpRequest.prototype.send = function () {
            const xhr = this;

            log.count++;
            if (log.destroyed) {
                log.afterDestroy++;
            }

            setTimeout(function () {
                xhr.readyState = 4;
                xhr.status = 200;
                xhr.responseText = getBody();
                try {
                    xhr.onreadystatechange();
                } catch (e) {
                    // The response handler runs outside the QUnit stack, so
                    // collect the errors and assert on them instead
                    log.errors.push(e.message);
                }
            }, latency);
        };

        win.XMLHttpRequest = FakeXMLHttpRequest;

        return log;
    }

    QUnit.test(
        'Live data polling stops on chart destroy (#25115)',
        function (assert) {
            const clock = TestUtilities.lolexInstall(),
                log = interceptRequests(60, function () {
                    return 'x,y\n1,2';
                });

            try {
                const chart = Highcharts.chart('container', {
                    data: {
                        csvURL: '/fake.csv',
                        enablePolling: true,
                        dataRefreshRate: 1
                    }
                });

                // Let it poll for a couple of rounds
                clock.tick(2200);

                assert.strictEqual(
                    log.count,
                    4,
                    'Only one polling chain should be running. Each ' +
                    'successful poll runs chart.update, which re-enters ' +
                    'Data#init, and the poller started there must replace ' +
                    'the current one rather than add requests of its own.'
                );

                const data = chart.data;

                assert.strictEqual(
                    typeof data.liveDataTimeout,
                    'number',
                    'A poll should be scheduled at the time of the destroy'
                );

                log.destroyed = true;
                chart.destroy();

                assert.strictEqual(
                    data.liveDataTimeout,
                    undefined,
                    'Destroying the chart should clear the scheduled poll'
                );

                // Advance past the point where the cleared poll would have
                // fired
                clock.tick(1500);

                assert.strictEqual(
                    log.afterDestroy,
                    0,
                    'No request should be made after the chart is destroyed'
                );
                assert.deepEqual(
                    log.errors,
                    [],
                    'No error should be thrown after the chart is destroyed'
                );
            } finally {
                log.restore();
                TestUtilities.lolexUninstall(clock);
            }
        }
    );

    QUnit.test(
        'Google Sheets polling stops on chart destroy (#25115)',
        function (assert) {
            const bodies = [
                JSON.stringify({ values: [[1, 2, 3], [4, 5, 6]] }),
                // An empty sheet keeps the response handler from throwing,
                // so that the re-scheduling of the next poll is reached
                JSON.stringify({ values: [] })
            ];

            bodies.forEach(function (body, i) {
                const clock = TestUtilities.lolexInstall(),
                    log = interceptRequests(60, function () {
                        return body;
                    });

                try {
                    const chart = Highcharts.chart('container', {
                        data: {
                            googleSpreadsheetKey: 'fake-key',
                            googleAPIKey: 'fake-api-key',
                            enablePolling: true,
                            dataRefreshRate: 1
                        }
                    });

                    const data = chart.data;

                    // Destroy while the first request is still in flight
                    log.destroyed = true;
                    chart.destroy();

                    // Let the in-flight response arrive, and go past the
                    // point where a poll scheduled by it would have fired
                    clock.tick(1500);

                    assert.deepEqual(
                        log.errors,
                        [],
                        'Response ' + i + ' arriving after destroy should ' +
                        'not throw. The success handler must not touch a ' +
                        'chart that is no longer there.'
                    );
                    assert.strictEqual(
                        data.liveDataTimeout,
                        undefined,
                        'Response ' + i + ' arriving after destroy should ' +
                        'not schedule another poll'
                    );
                    assert.strictEqual(
                        log.afterDestroy,
                        0,
                        'Response ' + i + ' should not trigger another ' +
                        'request after destroy'
                    );
                } finally {
                    log.restore();
                    TestUtilities.lolexUninstall(clock);
                }
            });
        }
    );
}());
