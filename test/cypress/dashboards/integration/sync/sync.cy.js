describe('Sync when new connector added to components.', () => {
    before(()=>{
        cy.visit('/dashboards/cypress/component-with-no-connector');
    });

    it('Chart and GridComponent should have synced hover events.', () => {
        cy.get('tr.hcg-row').eq(0).as('firstCell');

        // Hover over GridComponent.
        cy.get('@firstCell').trigger('mouseover');
        cy.get('@firstCell').should('have.class', 'hcg-hovered-row');

        cy.chart().then(chart =>{
            assert.notOk(
                chart.tooltip.isHidden,
                'When hovering over Grid, chart should have tooltip.'
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

describe('Highlight sync after destroying a component.', () => {
    before(() => {
        cy.visit('/dashboards/sync/highlight-after-destroy');
    });

    it('#25082, should unregister highlight on the component table.', () => {
        cy.boardRendered();

        cy.board().then(board => {
            const table = board.mountedComponents[0].component.getDataTable();
            const getCount = () =>
                (board.dataCursor.listenerMap[table.id]?.['point.mouseOver'] || [])
                    .length;

            const before = getCount();
            board.mountedComponents[1].cell.destroy();

            assert.strictEqual(
                getCount(),
                before - 1,
                'Highlight listener should be removed from the component table.'
            );

            board.dataCursor.emitCursor(table, {
                type: 'position',
                row: 0,
                column: 'Vitamin A',
                state: 'point.mouseOver',
                sourceId: 'cypress'
            });
        });
    });
});
