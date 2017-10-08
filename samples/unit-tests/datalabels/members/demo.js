QUnit.test('Series.drawDataLabels', function (assert) {
    var H = Highcharts,
        Series = H.Series,
        defaultOptions = H.getOptions(),
        drawDataLabels = Series.prototype.drawDataLabels,
        noop = Highcharts.noop,
        point = {
            getLabelConfig: H.Point.prototype.getLabelConfig,
            options: {
                dataLabels: {}
            }
        },
        series = {
            alignDataLabel: function (p, d) {
                d.aligned = true;
            },
            chart: {
                options: {
                    drilldown: {}
                },
                renderer: {
                    getContrast: H.Renderer.prototype.getContrast,
                    label: function () {
                        return {
                            attribs: {},
                            style: {},
                            add: function () {
                                this.added = true;
                                return this;
                            },
                            addClass: noop,
                            attr: function (obj) {
                                H.extend(this.attribs, obj);
                                return this;
                            },
                            css: function (obj) {
                                H.extend(this.style, obj);
                                return this;
                            },
                            destroy: noop,
                            shadow: noop
                        };
                    }
                }
            },
            options: H.merge(defaultOptions.plotOptions.line),
            plotGroup: function () {
                return {
                    attr: noop
                };
            },
            points: [point]
        };

    drawDataLabels.call(series);
    assert.strictEqual(
        !!point.dataLabel,
        false,
        'dataLabel disabled'
    );

    series.options.dataLabels.enabled = true;
    drawDataLabels.call(series);
    assert.strictEqual(
        !!point.dataLabel,
        true,
        'point.dataLabel undefined: Created dataLabel'
    );
    assert.strictEqual(
        !!point.dataLabel.added,
        true,
        'point.dataLabel undefined: Added dataLabel'
    );
    assert.strictEqual(
        point.dataLabel.attribs.text,
        undefined,
        'point.dataLabel undefined: attr.text undefined'
    );
    assert.strictEqual(
        point.dataLabel.style.color,
        '#000000',
        'point.dataLabel undefined: Color set to #000000'
    );
    assert.strictEqual(
        point.dataLabel.aligned,
        true,
        'point.dataLabel undefined: Label aligned'
    );

    point.dataLabel.aligned = false;
    series.options.dataLabels.color = '#FFFFFF';
    point.y = 1;
    drawDataLabels.call(series);
    assert.strictEqual(
        point.dataLabel.style.color,
        '#FFFFFF',
        'Update label: color updated.'
    );
    assert.strictEqual(
        point.dataLabel.attribs.text,
        '1',
        'Update label: text is 1'
    );
    assert.strictEqual(
        point.dataLabel.aligned,
        true,
        'Update label: aligned'
    );

    point.options.dataLabels.enabled = false;
    drawDataLabels.call(series);
    assert.strictEqual(
        !!point.dataLabel,
        false,
        'point.options.dataLabels.enabled: false'
    );

    point.dataLabel = {
        destroy: noop
    };
    series.options.formatter = noop;
    drawDataLabels.call(series);
    assert.strictEqual(
        !!point.dataLabel,
        false,
        'dataLabel && !defined(str)'
    );
});