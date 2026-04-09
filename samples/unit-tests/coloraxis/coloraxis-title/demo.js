QUnit.test(
    'Color axis title lifecycle and layout computations',
    function (assert) {
        const chart = Highcharts.chart('container', {
            colorAxis: {
                title: { text: 'Test Title' }
            },
            series: [{
                type: 'heatmap',
                data: [[0, 0, 1], [0, 1, 2]]
            }]
        });

        const colorAxis = chart.colorAxis[0];
        assert.ok(
            colorAxis.axisTitle &&
        colorAxis.axisTitle.element.textContent === 'Test Title',
            'Color axis title should be rendered with correct text'
        );

        chart.update({
            colorAxis: {
                title: { text: null }
            }
        });

        assert.strictEqual(
            colorAxis.axisTitle,
            undefined,
            'axisTitle should be removed/undefined if the title config' +
            ' is cleared.'
        );

        const initialLegendHeight = chart.legend.legendHeight;

        chart.update({
            colorAxis: {
                title: {
                    text: 'Massive Title',
                    style: { fontSize: '30px' }
                }
            }
        });

        const newLegendHeight = chart.legend.legendHeight;

        assert.ok(
            newLegendHeight > initialLegendHeight,
            'The legend height should increase to accommodate the color axis' +
            ' title dimensions.'
        );

        chart.update({
            colorAxis: {
                title: { text: 'Top Title', style: { fontSize: '12px' } },
                layout: 'horizontal'
            }
        });

        const title = colorAxis.axisTitle;
        const symbol = colorAxis.legendItem.symbol;

        if (title && symbol) {
        // SVG coordinates: lower Y means higher on the screen
            const titleY = title.getBBox().y;
            const symbolY = symbol.getBBox().y;

            assert.ok(
                titleY < symbolY,
                'The title\'s Y position should be less than the symbol\'s Y' +
            ' position (sitting above it).'
            );
        } else {
            assert.ok(false, 'Title or symbol failed to render.');
        }

        chart.update({
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            colorAxis: {
                layout: 'vertical',
                title: { text: 'Test Title', align: 'middle' }
            }
        });

        // Rotation can be on the SVG transform or wrapper rotation property
        const verticalTitle = colorAxis.axisTitle;

        // Rotation can be on the SVG transform or wrapper rotation property
        const transform = verticalTitle && verticalTitle.element &&
                verticalTitle.element.getAttribute('transform');
        const hasRotateInTransform = !!(transform &&
                /rotate\(/.test(transform));
        const wrapperRotation = typeof (
            verticalTitle && verticalTitle.rotation) === 'number' ?
            verticalTitle.rotation : null;

        assert.ok(
            hasRotateInTransform || (wrapperRotation !==
                    null && isFinite(wrapperRotation)),
            'Color axis title is rotated with vertical legend'
        );
    });
