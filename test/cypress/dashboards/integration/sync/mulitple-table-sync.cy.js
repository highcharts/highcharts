describe('Multiple dataTables sync', () => {
    beforeEach(() => {
        cy.visit('/dashboards/cypress/multiple-datatables');
    });

    it('Hovering over firs Grid should highlight the first chart', () => {
        cy.get('#dashboard-col-0 tr.hcg-row').eq(0).trigger('mouseover');

        cy.board().then((board) => {
            const firstChart = board.mountedComponents[2].component.chart;
            const secondChart = board.mountedComponents[3].component.chart;

            assert.notOk(
                firstChart.tooltip.isHidden,
                'When hovering over first Grid, first chart should have tooltip.'
            );

            assert.ok(
                secondChart.tooltip.isHidden,
                'When hovering over second Grid, second chart should have tooltip.'
            );
        });
    });

    it('Hovering over second Grid should highlight the second chart', () => {
        cy.get('#dashboard-col-1 tr.hcg-row').eq(0).trigger('mouseover');

        cy.board().then((board) => {
            const firstChart = board.mountedComponents[2].component.chart;
            const secondChart = board.mountedComponents[3].component.chart;

            assert.ok(
                firstChart.tooltip.isHidden,
                'When hovering over first Grid, first chart should have tooltip.'
            );

            assert.notOk(
                secondChart.tooltip.isHidden,
                'When hovering over second Grid, second chart should have tooltip.'
            );
        });
    });
});
