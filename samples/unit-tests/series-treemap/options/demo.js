QUnit.module('defaultOptions', function () {
    var options = Highcharts.getOptions(),
        treemap = options.plotOptions.treemap;

    QUnit.test('dataLabels', function (assert) {
        var dataLabels = treemap.dataLabels,
            formatter = dataLabels.formatter,
            ctx = {};

        /**
         * dataLabels
         */
        assert.strictEqual(
            typeof dataLabels,
            'object',
            'should have dataLabels default to object.'
        );

        /**
         * dataLabels.align
         */
        assert.strictEqual(
            dataLabels.align,
            'center',
            'should have dataLabels.align default to "center".'
        );

        /**
         * dataLabels.defer
         */
        assert.strictEqual(
            dataLabels.defer,
            false,
            'should have dataLabels.defer default to false.'
        );

        /**
         * dataLabels.enabled
         */
        assert.strictEqual(
            dataLabels.enabled,
            true,
            'should have dataLabels.enabled default to true.'
        );

        /**
         * dataLabels.format
         */
        assert.strictEqual(
            typeof dataLabels.format,
            'undefined',
            'should have dataLabels.format default to undefined.'
        );

        /**
         * dataLabels.formatter
         */
        assert.strictEqual(
            formatter.call(),
            '',
            'should have dataLabels.formatter return "" when context is undefined.'
        );

        assert.strictEqual(
            formatter.call(ctx),
            '',
            'should have dataLabels.formatter return "" when point is undefined.'
        );

        ctx.point = {};
        assert.strictEqual(
            formatter.call(ctx),
            '',
            'should have dataLabels.formatter return "" when point.name is undefined.'
        );

        ctx.point.name = {};
        assert.strictEqual(
            formatter.call(ctx),
            '',
            'should have dataLabels.formatter return "" when point.name is not a string.'
        );

        ctx.point.name = 'My Name';
        assert.strictEqual(
            formatter.call(ctx),
            'My Name',
            'should have dataLabels.formatter return point.name when it is a string.'
        );

        /**
         * dataLabels.inside
         */
        assert.strictEqual(
            dataLabels.inside,
            true,
            'should have dataLabels.inside default to true.'
        );

        /**
         * dataLabels.verticalAlign
         */
        assert.strictEqual(
            dataLabels.verticalAlign,
            'middle',
            'should have dataLabels.verticalAlign default to "middle".'
        );
    });
});
