QUnit.test('RangeSelector.dropdown', assert => {
    const container = document.getElementById('container');
    container.style.width = '600px';

    const chart = Highcharts.stockChart('container', {
        series: [
            {
                pointInterval: 24 * 3600 * 1000,
                data: [1, 3, 2, 4, 3, 5, 4, 6, 3, 4, 2, 3, 1, 2, 1]
            }
        ]
    });

    const isSelectInsideChart = () => {
        const select = chart.rangeSelector.dropdown.getBoundingClientRect();
        const container = chart.container.getBoundingClientRect();

        return select.left >= container.left &&
            select.left + select.width <= container.right &&
            select.top >= container.top &&
            select.top + select.height <= container.bottom;
    };

    assert.strictEqual(
        chart.rangeSelector.options.dropdown,
        'responsive',
        'dropdown should be responsive by default'
    );
    assert.strictEqual(
        chart.rangeSelector.buttons.length,
        chart.rangeSelector.dropdown.options.length,
        'Button and option count should match'
    );
    assert.ok(
        chart.rangeSelector.buttons.every((b, i) => {
            const option = chart.rangeSelector.dropdown.options[i];
            return b.state === 3 ? option.disabled : !option.disabled;
        }),
        'Button and option disabled states should match'
    );

    assert.ok(
        chart.rangeSelector.buttons.every(b => b.visibility !== 'hidden'),
        '600px + responsive: All the buttons should be visible'
    );
    assert.notOk(
        isSelectInsideChart(),
        'Select should be outside chart'
    );

    chart.update({
        rangeSelector: {
            dropdown: 'never'
        }
    });

    assert.ok(
        chart.rangeSelector.buttons.every(b => b.visibility !== 'hidden'),
        '600px + never: All the buttons should be visible'
    );
    assert.notOk(
        isSelectInsideChart(),
        'Select should be outside chart'
    );

    chart.update({
        rangeSelector: {
            dropdown: 'always'
        }
    });

    assert.strictEqual(
        chart.rangeSelector.buttons.filter(b => b.visibility !== 'hidden').length,
        1,
        '600px + always: Only 1 button should be visible'
    );
    assert.ok(
        isSelectInsideChart(),
        'Select should be inside chart'
    );

    container.style.width = '400px';
    chart.reflow();

    assert.strictEqual(
        chart.rangeSelector.buttons.filter(b => b.visibility !== 'hidden').length,
        1,
        '400px + always: Only 1 button should be visible'
    );
    assert.ok(
        isSelectInsideChart(),
        'Select should be inside chart'
    );

    chart.update({
        rangeSelector: {
            dropdown: 'responsive'
        }
    });

    assert.strictEqual(
        chart.rangeSelector.buttons.filter(b => b.visibility !== 'hidden').length,
        1,
        '400px + resonsive: Only 1 button should be visible'
    );
    assert.ok(
        isSelectInsideChart(),
        'Select should be inside chart'
    );

    chart.update({
        rangeSelector: {
            dropdown: 'never'
        }
    });

    assert.ok(
        chart.rangeSelector.buttons.every(b => b.visibility !== 'hidden'),
        '400px + never: All the buttons be visible'
    );
    assert.notOk(
        isSelectInsideChart(),
        'Select should be outside chart'
    );
});
