describe('Crossfilter with affectNavigator option', () => {
    before(() => {
        cy.visit('/dashboards/components/crossfilter-affecting-navigators');
    });

    it('dashboard should be rendered', () => {
        cy.boardRendered();
    });

    it('should modify a table and crossfilters content', () => {
        cy.viewport(1000, 660);

        /**
         * An array of objects specifying:
         *  - handle - index handle element in the navigator we want to drag,
         *  - pageX - absolute X position to which the handle is to be dragged.
         */
        const moves = [{
            handle: 0, // 1st navigator, right handle
            pageX: 250
        }, {
            handle: 1, // 1st navigator, left handle
            pageX: 200
        }, {
            handle: 4, // 3rd navigator, right handle
            pageX: 800
        }, {
            handle: 5, // 3rd navigator, left handle
            pageX: 770
        }];
    
        for (const { handle, pageX } of moves) {
            cy.get('.highcharts-navigator-handle')
                .eq(handle).trigger('mouseenter').trigger('mousedown')
                .trigger('mousemove', { pageX }).trigger('mouseup');
        }

        cy.board().then(board => {
            const dataTable = board.dataPool.connectors.Economy.table;
            assert.ok(
                dataTable.modified.rowCount < dataTable.rowCount,
                'The modified table should have less rows than the original one.'
            );
            
            assert.ok(
                board.mountedComponents[1].component.chart
                    .series[0].points.length < 30,
                'The middle navigator should have less than 30 points.'
            );
        });
    });
});
