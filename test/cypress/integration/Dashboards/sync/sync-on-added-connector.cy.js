describe('Sync when new connector added to components.', () => {
    before(()=>{
        cy.visit('/dashboards/cypress/component-with-no-connector');
    });

    it('Chart and DataGridComponent should have synced hover events.', () => {
        const firstDataGridRow = cy.get('.highcharts-datagrid-cell').eq(0)

        // Hover over DataGridComponent.
        firstDataGridRow.trigger('mouseover');
        firstDataGridRow.parent().should('have.class', 'highcharts-datagrid-row hovered');
        cy.chart().then(chart =>{
            assert.notOk(
                chart.tooltip.isHidden,
                'When hovering over DataGrid, chart should have tooltip.'
            )
        })
    });
});
