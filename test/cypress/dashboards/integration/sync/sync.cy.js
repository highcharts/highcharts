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
        cy.board().then(board => {
            const component = board.mountedComponents[2].component;
            const componentFromFirstGroup = board.mountedComponents[0].component;
            const componentFromSecondGroup = board.mountedComponents[3].component;
            component.chart.series[0].setVisible(true);
            assert.equal(
                componentFromFirstGroup.chart.series[0].visible,
                true,
                'After updating group for a component, it should be synced with the other components in the same group.'
            );
            assert.equal(
                componentFromSecondGroup.chart.series[0].visible,
                false,
                'After updating group for a component, it should be not synced with the previous group.'
            );
        });
    });
});
