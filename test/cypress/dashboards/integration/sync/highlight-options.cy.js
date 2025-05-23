describe("Highlight sync options", () => {
    before(() => {
        cy.visit('/dashboards/sync/sync-highlight-options');
    });

    it('All chart highlight sync options are disabled', () => {
        cy.boardRendered();

        cy.get('#cbx-chart-showTooltip').click();
        cy.get('#cbx-chart-highlightPoint').click();
        cy.get('#cbx-chart-showCrosshair').click();

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

    it('Chart highlight showTooltip option is enabled', () => {
        cy.get('#cbx-chart-showTooltip').click();

        cy.get('tr.highcharts-datagrid-row').eq(1).trigger('mouseover');

        cy.chart().then(chart => {
            assert.notOk(
                chart.tooltip.isHidden,
                'When hovering over DataGrid, chart should have tooltip.'
            )
        });
    });

    it('Chart highlight highlightPoint option is enabled', () => {
        cy.get('#cbx-chart-highlightPoint').click();

        cy.get('tr.highcharts-datagrid-row').eq(2).trigger('mouseover');

        cy.chart().then(chart => {
            assert.strictEqual(
                chart.series[0].points[2].state,
                'hover',
                'When hovering over DataGrid, chart should have marker hovered.'
            )
        });
    });

    it('Chart highlight showCrosshair option is enabled', () => {
        cy.get('#cbx-chart-showCrosshair').click();

        cy.get('tr.highcharts-datagrid-row').eq(3).trigger('mouseover');

        cy.chart().then(chart => {
            assert.strictEqual(
                chart.yAxis[0].cross?.opacity,
                1,
                'When hovering over DataGrid, chart should have crosshair.'
            )
        });
    });

    it('Chart highlight sync is disabled', () => {
        cy.get('#cbx-chart-enabled').click();

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

    it('Grid highlight sync is enabled', () => {
        cy.get('#cbx-grid-enabled').click();

        // Highlight the row from the first grid.
        cy.get('#grid-0 tr.highcharts-datagrid-row').eq(4).trigger('mouseover');

        // The corresponding row from the second grid should be highlighted.
        cy.get('#grid-1 tr.highcharts-datagrid-row').eq(4)
            .should('have.class', 'highcharts-datagrid-synced-row');
    });
});
