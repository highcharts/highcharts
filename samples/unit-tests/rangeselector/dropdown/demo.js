QUnit.test('RangeSelector.dropdown', assert => {
    const chart = Highcharts.stockChart('container', {
        chart: {
            width: 800
        },
        series: [
            {
                pointInterval: 24 * 3600 * 1000,
                data: [1, 3, 2, 4, 3, 5, 4, 6, 3, 4, 2, 3, 1, 2, 1]
            }
        ]
    });

    assert.strictEqual(
        chart.rangeSelector.options.dropdown,
        'responsive',
        'dropdown should be responsive by default'
    );
    assert.strictEqual(
        chart.rangeSelector.buttons.length,
        chart.rangeSelector.dropdown.options.length - 1,
        'Button and option count should match'
    );
    assert.ok(
        chart.rangeSelector.buttons.every((b, i) => {
            const option = chart.rangeSelector.dropdown.options[i + 1];
            return b.state === 3 ? option.disabled : !option.disabled;
        }),
        'Button and option disabled states should match'
    );

    assert.ok(
        chart.rangeSelector.buttons.every(b => b.visibility !== 'hidden'),
        '800px + responsive: All the buttons should be visible'
    );
    assert.strictEqual(
        chart.rangeSelector.dropdown.style.visibility,
        'hidden',
        'Dropdown select should be hidden'
    );
    assert.strictEqual(
        chart.rangeSelector.dropdownLabel.visibility,
        'hidden',
        'Dropdown label should be hidden'
    );

    chart.update({
        rangeSelector: {
            dropdown: 'never'
        }
    });

    assert.ok(
        chart.rangeSelector.buttons.every(b => b.visibility !== 'hidden'),
        '800px + never: All the buttons should be visible'
    );
    assert.strictEqual(
        chart.rangeSelector.dropdown.style.visibility,
        'hidden',
        'Dropdown select should be hidden'
    );
    assert.strictEqual(
        chart.rangeSelector.dropdownLabel.visibility,
        'hidden',
        'Dropdown label should be hidden'
    );

    chart.update({
        rangeSelector: {
            dropdown: 'always'
        }
    });

    assert.ok(
        chart.rangeSelector.buttons.every(b => b.visibility === 'hidden'),
        '800px + always: Every button should be hidden'
    );
    assert.notStrictEqual(
        chart.rangeSelector.dropdown.style.visibility,
        'hidden',
        'Dropdown select should be visible'
    );
    assert.notStrictEqual(
        chart.rangeSelector.dropdownLabel.visibility,
        'hidden',
        'Dropdown label should be visible'
    );

    chart.update({
        chart: {
            width: 400
        }
    });

    assert.ok(
        chart.rangeSelector.buttons.every(b => b.visibility === 'hidden'),
        '400px + always: Every button should be hidden'
    );
    assert.notStrictEqual(
        chart.rangeSelector.dropdown.style.visibility,
        'hidden',
        'Dropdown select should be visible'
    );
    assert.notStrictEqual(
        chart.rangeSelector.dropdownLabel.visibility,
        'hidden',
        'Dropdown label should be visible'
    );

    chart.update({
        rangeSelector: {
            dropdown: 'responsive'
        }
    });

    assert.ok(
        chart.rangeSelector.buttons.every(b => b.visibility === 'hidden'),
        '400px + resonsive: Every button should be hidden'
    );
    assert.notStrictEqual(
        chart.rangeSelector.dropdown.style.visibility,
        'hidden',
        'Dropdown select should be visible'
    );
    assert.notStrictEqual(
        chart.rangeSelector.dropdownLabel.visibility,
        'hidden',
        'Dropdown label should be visible'
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
    assert.strictEqual(
        chart.rangeSelector.dropdown.style.visibility,
        'hidden',
        'Dropdown select should be hidden'
    );
    assert.strictEqual(
        chart.rangeSelector.dropdownLabel.visibility,
        'hidden',
        'Dropdown label should be hidden'
    );

    chart.update({
        rangeSelector: {
            buttons: [],
            dropdown: 'always'
        }
    });
    assert.ok(
        true, '#15124: Attempting to collapse with no buttons should ' +
        'not throw'
    );
});
