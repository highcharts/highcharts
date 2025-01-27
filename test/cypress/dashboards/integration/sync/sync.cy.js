describe('Sync when new connector added to components.', () => {
    before(()=>{
        cy.visit('/dashboards/cypress/component-with-no-connector');
    });

    it('Chart and DataGridComponent should have synced hover events.', () => {
        cy.get('tr.highcharts-datagrid-row').eq(0).as('firstCell');

        // Hover over DataGridComponent.
        cy.get('@firstCell').trigger('mouseover');
        cy.get('@firstCell').should('have.class', 'highcharts-datagrid-hovered-row');

        cy.chart().then(chart =>{
            assert.notOk(
                chart.tooltip.isHidden,
                'When hovering over DataGrid, chart should have tooltip.'
            )
        })
    });
});

describe('Sync groups for the same connectors.', () => {
    before(() => {
        cy.visit('/dashboards/sync/groups');
    });

    it('Components should be synced only inside the same group.', () => {
        cy.get('.highcharts-legend-item').eq(0).click();
        cy.get('.highcharts-legend-item').eq(1).should('have.class', 'highcharts-legend-item-hidden');
        cy.get('.highcharts-legend-item').eq(2).should('not.have.class', 'highcharts-legend-item-hidden');
    });

    it('Group can be toggled by updating a component.', () => {
        cy.get('.highcharts-legend-item').eq(2).click();
        cy.get('#s3').select('First Group');
        cy.wait(100);
        cy.get('.highcharts-legend-item').eq(2).click();
        cy.get('.highcharts-legend-item').eq(1).should('not.have.class', 'highcharts-legend-item-hidden');
        cy.get('.highcharts-legend-item').eq(3).should('have.class', 'highcharts-legend-item-hidden');
    });
});
