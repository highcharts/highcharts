QUnit[Highcharts.hasWebGLSupport() ? "test" : "skip"](
    "Scatter with boost: reset zoom on y-axis (#24386)",
    function (assert) {
    const chart = Highcharts.chart("container", {
        chart: {
        type: "scatter",
        zooming: {
            type: "xy",
        },
        width: 600,
        height: 400,
        },
        xAxis: {
        min: 0,
        max: 100,
        },
        yAxis: {
        min: 0,
        max: 100,
        },
        series: [
        {
            boostThreshold: 1,
            cropThreshold: 100,
            type: "scatter",
            data: (function () {
            const data = [];
            for (let i = 0; i < 300; i++) {
                data.push([Math.random() * 100, Math.random() * 100]);
            }
            return data;
            })(),
        },
        ],
    });

    const initialXExtremes = chart.xAxis[0].getExtremes();
    const initialYExtremes = chart.yAxis[0].getExtremes();
    const initialPointsLength = chart.series[0].points.length;

    // Zoom on both axes
    chart.xAxis[0].setExtremes(40, 60);
    chart.yAxis[0].setExtremes(30, 70);

    assert.ok(
        chart.series[0].cropped,
        "After zoom both axes, series should be cropped.",
    );
    assert.ok(
        chart.series[0].points.length < initialPointsLength,
        "After zoom both axes, series should show fewer points.",
    );

    // Get zoomed state for comparison
    const zoomedPointsLength = chart.series[0].points.length;

    // Reset x-axis only
    chart.xAxis[0].setExtremes();

    assert.deepEqual(
        chart.xAxis[0].getExtremes(),
        initialXExtremes,
        "After resetting x-axis, x-extremes should match initial state.",
    );
    assert.ok(
        chart.series[0].points.length > zoomedPointsLength,
        "After resetting x-axis, more points should be visible.",
    );

    // Reset y-axis only
    chart.yAxis[0].setExtremes();

    assert.deepEqual(
        chart.yAxis[0].getExtremes(),
        initialYExtremes,
        "After resetting y-axis, y-extremes should match initial state.",
    );
    assert.strictEqual(
        chart.series[0].points.length,
        initialPointsLength,
        "After resetting both axes, all original points should be visible (Issue #24386).",
    );
    assert.ok(
        !chart.series[0].cropped,
        "After resetting both axes, series should not be cropped.",
    );
    },
);
