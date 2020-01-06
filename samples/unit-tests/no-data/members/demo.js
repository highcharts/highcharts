QUnit.test("defaultOptions", assert => {
    const {
        noData: {
            attr: {
                zIndex
            }
        }
    } = Highcharts.getOptions();

    assert.equal(
        zIndex,
        1,
        "Default z index should be 1 (#12343)"
    );
});