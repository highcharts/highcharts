describe('Crossfilter with affectNavigator option', () => {
    before(() => {
        cy.visit('/dashboards/components/crossfilter-affecting-navigators');
    });

    it('dashboard should be rendered', () => {
        cy.boardRendered()
    });

    it('should modify a table and crossfilters content', () => {
        const moves = [{
            handle: 0,
            pageX: 250
        }, {
            handle: 1,
            pageX: 200
        }, {
            handle: 4,
            pageX: 800
        }, {
            handle: 5,
            pageX: 770
        }];
    
        for (const move of moves) {
            cy.get('.highcharts-navigator-handle').eq(move.handle)
                .trigger('mouseenter').trigger('mousedown')
                .trigger('mousemove', { pageX: move.pageX }).trigger('mouseup');
        }

        cy.get('.highcharts-datagrid-row').should('have.length', 4);

        cy.board().then(board => {
            const middleChart = board.mountedComponents[1].component.chart;
            assert.strictEqual(
                middleChart.series[0].points.length,
                6,
                'The middle navigator should have 6 points.'
            );
        });
    });
});
