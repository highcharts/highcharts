describe('data grid highlight sync autoscroll', () => {
    beforeEach(()=>{
        cy.visit('/dashboards/sync/datagrid-highlight-sync-autoscroll');
    });

    it('DataGrid AutoScroll should work', () => {
        cy.board().then(board => {
            const table = board.dataPool.connectors.data.table;
            board.dataCursor.emitCursor(table, {
                type: 'position',
                row: 50,
                column: 'Rate',
                state: 'point.mouseOver'
            });

            cy.get('.highcharts-datagrid-cell').eq(0).should('have.text', '2015-07-10');
        });
    });

    it('DataGrid AutoScroll should be possible to disable', () => {
        cy.board().then(board => {
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

            cy.get('.highcharts-datagrid-cell').eq(0).should('have.text', '2015-05-06');
        });
    });
});
