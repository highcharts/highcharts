describe('Grid Component highlight sync autoscroll', () => {
    beforeEach(() => {
        cy.visit('/dashboards/sync/grid-highlight-sync-autoscroll');
    });

    it('Grid AutoScroll should work', () => {
        cy.board().then((board) => {
            const table = board.dataPool.connectors.data.getTable();
            board.dataCursor.emitCursor(table, {
                type: 'position',
                row: 50,
                column: 'Rate',
                state: 'point.mouseOver'
            });

            cy.get('.hcg-row.hcg-synced-row')
                .children()
                .eq(0)
                .should('have.text', '2015-07-15');
        });
    });

    it('Grid AutoScroll should be possible to disable', () => {
        cy.board().then((board) => {
            const gridComponent = board.mountedComponents[1].component;
            gridComponent.update({
                sync: {
                    highlight: {
                        enabled: true,
                        autoScroll: false
                    }
                }
            });

            const table = board.dataPool.connectors.data.getTable();
            board.dataCursor.emitCursor(table, {
                type: 'position',
                row: 50,
                column: 'Rate',
                state: 'point.mouseOver'
            });

            cy.get('tr.hcg-row').children().eq(0).should('have.text', '2015-05-06');
        });
    });
});
