describe('Grid Component highlight sync autoscroll', () => {
    beforeEach(() => {
        cy.visit('/dashboards/sync/grid-highlight-sync-autoscroll');
    });

    it('Grid AutoScroll should work', () => {
        cy.board().then((board) => {
            const table = board.dataPool.connectors.data.table;
            board.dataCursor.emitCursor(table, {
                type: 'position',
                row: 50,
                column: 'Rate',
                state: 'point.mouseOver'
            });

            cy.get('.highcharts-datagrid-row.highcharts-datagrid-synced-row')
                .children()
                .eq(0)
                .should('have.text', '2015-07-15');
        });
    });

    it('Grid AutoScroll should be possible to disable', () => {
        cy.board().then((board) => {
            const dataGridComponent = board.mountedComponents[1].component;
            dataGridComponent.update({
                sync: {
                    highlight: {
                        enabled: true,
                        autoScroll: false
                    }
                }
            });

            const table = board.dataPool.connectors.data.table;
            board.dataCursor.emitCursor(table, {
                type: 'position',
                row: 50,
                column: 'Rate',
                state: 'point.mouseOver'
            });

            cy.get('tr.highcharts-datagrid-row').children().eq(0).should('have.text', '2015-05-06');
        });
    });
});
