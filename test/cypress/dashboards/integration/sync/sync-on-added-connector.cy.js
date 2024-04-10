describe('Sync when new connector added to components.', () => {
    before(()=>{
        cy.visit('/dashboards/cypress/component-with-no-connector');
    });

    it('Chart and DataGridComponent should have synced hover events.', () => {
        cy.get('.highcharts-datagrid-cell').eq(0).as('firstCell');

        // Hover over DataGridComponent.
        cy.get('@firstCell').trigger('mouseover');
        cy.get('@firstCell').parent().should('have.class', 'highcharts-datagrid-row hovered');

        cy.chart().then(chart =>{
            assert.notOk(
                chart.tooltip.isHidden,
                'When hovering over DataGrid, chart should have tooltip.'
            )
        })
    });
});
