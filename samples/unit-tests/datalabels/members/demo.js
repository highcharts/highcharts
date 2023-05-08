QUnit.test('Series.drawDataLabels', function (assert) {
    const {
        extend,
        noop,
        Series: {
            prototype: { drawDataLabels }
        }
    } = Highcharts;

    // Create a Point and Series to use when calling drawDataLabels
    const {
        renderer,
        series: [series],
        series: [
            {
                points: [point]
            }
        ]
    } = Highcharts.chart('container', {
        series: [
            {
                dataLabels: { enabled: false }, // Disable data labels
                data: [{}] // Create one null point
            }
        ]
    });

    // Mock SvgRenderer.label to listen for function calls and input parameters.
    renderer.label = function () {
        return {
            attribs: {},
            style: {},
            add: function () {
                this.added = true;
                return this;
            },
            addClass: noop,
            attr: function (obj) {
                extend(this.attribs, obj);
                return this;
            },
            css: function (obj) {
                extend(this.style, obj);
                return this;
            },
            setTextPath: function () {
                return this;
            },
            destroy: noop,
            shadow: noop
        };
    };

    // Overwrite alignDataLabel to just listen for if it is called.
    series.alignDataLabel = (_, d) => {
        d.aligned = true;
    };

    drawDataLabels.call(series);
    assert.strictEqual(
        !!point.dataLabel,
        false,
        'Should not create a dataLabel when series.dataLabels.enabled=false'
    );

    series.options.dataLabels.enabled = true;
    point.isNull = void 0;
    drawDataLabels.call(series);
    assert.strictEqual(
        !!point.dataLabel,
        true,
        'Should create dataLabel when series.dataLabels.enabled=true'
    );
    assert.strictEqual(
        !!point.dataLabel.added,
        true,
        'Should add dataLabel when created'
    );
    assert.strictEqual(
        point.dataLabel.attribs.text,
        void 0,
        'Should have dataLabel text equal to undefined when y is undefined'
    );
    assert.strictEqual(
        point.dataLabel.style.color,
        '#000000',
        'Should have dataLabel.style.color equal to #000000 by default'
    );
    assert.strictEqual(
        point.dataLabel.aligned,
        true,
        'Should align dataLabel when created'
    );

    point.dataLabel.aligned = false;
    series.options.dataLabels.color = '#FFFFFF';
    point.y = 1;
    drawDataLabels.call(series);
    assert.strictEqual(
        point.dataLabel.style.color,
        '#FFFFFF',
        'Should have dataLabel.style.color equal to #FFFFFF after update'
    );
    assert.strictEqual(
        point.dataLabel.attribs.text,
        '1',
        'Should have dataLabel text equal to "1" when y is 1'
    );
    assert.strictEqual(
        point.dataLabel.aligned,
        true,
        'Should align dataLabel after update'
    );

    assert.equal(
        point.dataLabel.options.borderWidth,
        0,
        'Should have dataLabel.options.borderWidth equal to 0 by default #18127'
    );

    point.options.dataLabels = { enabled: false };
    drawDataLabels.call(series);
    assert.strictEqual(
        !!point.dataLabel,
        false,
        'Should destroy dataLabel when point.dataLabels.enabled=false'
    );

    point.dataLabel = {
        destroy: noop
    };
    series.options.formatter = noop;
    drawDataLabels.call(series);
    assert.strictEqual(
        !!point.dataLabel,
        false,
        'Should destroy dataLabel when series.formatter returns a value not of type string'
    );

    // Revert to prototype
    delete renderer.label;
});
