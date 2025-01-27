describe("Highlight sync options", () => {
    before(() => {
        cy.visit('/dashboards/sync/sync-highlight-options');
    });

    it('All highlight sync options are disabled', () => {
        cy.boardRendered();

        cy.get('#cbx-showTooltip').click();
        cy.get('#cbx-highlightPoint').click();
        cy.get('#cbx-showCrosshair').click();

        cy.get('tr.highcharts-datagrid-row').eq(0).trigger('mouseover');

        cy.chart().then(chart => {
            assert.ok(
                chart.tooltip.isHidden,
                'When hovering over DataGrid, chart should not have tooltip.'
            );

            assert.notOk(
                chart.series[0].points[0].state === 'hover',
                'When hovering over DataGrid, chart should not have marker.'
            );

            assert.notOk(
                chart.yAxis[0].cross?.opacity === 1,
                'When hovering over DataGrid, chart should not have crosshair.'
            )
        });
    });

    it('Highlight showTooltip option is enabled', () => {
        cy.get('#cbx-showTooltip').click();

        cy.get('tr.highcharts-datagrid-row').eq(1).trigger('mouseover');

        cy.chart().then(chart => {
            assert.notOk(
                chart.tooltip.isHidden,
                'When hovering over DataGrid, chart should have tooltip.'
            )
        });
    });

    it('Highlight highlightPoint option is enabled', () => {
        cy.get('#cbx-highlightPoint').click();

        cy.get('tr.highcharts-datagrid-row').eq(2).trigger('mouseover');

        cy.chart().then(chart => {
            assert.strictEqual(
                chart.series[0].points[2].state,
                'hover',
                'When hovering over DataGrid, chart should have marker hovered.'
            )
        });
    });

    it('Highlight showCrosshair option is enabled', () => {
        cy.get('#cbx-showCrosshair').click();

        cy.get('tr.highcharts-datagrid-row').eq(3).trigger('mouseover');

        cy.chart().then(chart => {
            assert.strictEqual(
                chart.yAxis[0].cross?.opacity,
                1,
                'When hovering over DataGrid, chart should have crosshair.'
            )
        });
    });

    it('Highlight sync is disabled', () => {
        cy.get('#cbx-enabled').click();

        cy.get('tr.highcharts-datagrid-row').eq(4).trigger('mouseover');

        cy.chart().then(chart => {
            assert.notEqual(
                chart.series[0].points[0].state,
                'hover',
                'When hovering over DataGrid, recently hovered point should not be hovered.'
            );

            assert.notEqual(
                chart.series[0].points[4].state,
                'hover',
                'When hovering over DataGrid, currently hovered point should not be hovered.'
            );

            assert.notEqual(
                chart.xAxis[0].cross && chart.yAxis[0].cross.opacity,
                1,
                'When hovering over DataGrid, chart should not have crosshair.'
            )
        });
    });
});
