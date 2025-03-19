QUnit.test('No points in series with single point (#21897)', function (assert) {
    // Check if the series has been included. It has not been included if the
    // series segment ends at 0.
    Highcharts.addEvent(Highcharts.Chart, 'testPushedBoostSeries', e => {
        const chart = e.target;

        const webGLRenderer = chart.boost.wgl;
        const boostSeries = webGLRenderer.series[0];

        const segment = boostSeries.segments[0];

        const seriesType = boostSeries.series.type;

        assert.strictEqual(
            segment.from,
            0,
            `Segment (${seriesType}) should start at 0`
        );

        assert.notStrictEqual(
            segment.to,
            0,
            `Segment (${seriesType}) should not end at 0`
        );
    });

    // Override WGLRenderer.pushSeries to fire `testPushedBoostSeries` event
    // before return. This is done because the WGLRenderer.series are flushed
    // before any other events are fired.
    Highcharts.addEvent(Highcharts.Series, 'renderCanvas', e => {
        const chart = e.target.chart;
        const webGLRenderer = chart.boost.wgl;

        if (webGLRenderer.pushSeriesIsOverriden === true) {
            return;
        }

        const pushSeriesBase = webGLRenderer.pushSeries;
        webGLRenderer.pushSeriesIsOverriden = true;
        webGLRenderer.pushSeries = (...args) => {
            pushSeriesBase.apply(webGLRenderer, args);
            Highcharts.fireEvent(chart, 'testPushedBoostSeries');
        };
    });

    const chart = Highcharts.chart('container', {
        boost: {
            seriesThreshold: 1
        },
        yAxis: {
            min: 0,
            max: 80
        },
        // Boost should render scatter with single point (#21897)
        series: [{
            type: 'scatter',
            data: [[1, 1]]
        }]
    });

    chart.update({
        // Boost should draw column with single point outside plot area (#22194)
        series: [{
            type: 'column',
            data: [[1, 81]]
        }]
    });

});