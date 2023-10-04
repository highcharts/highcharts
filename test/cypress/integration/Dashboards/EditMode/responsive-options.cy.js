
describe('Responsive options.', () => {
    before(() => {
        cy.visit('/dashboards/cypress/respo-options');
        cy.viewport(1200, 1000);
    });

    it('The nested layout should apply responsive options on resize', () => {

        // Check after setting the size to small.
        cy.get('.highcharts-dashboards-edit-button').eq(0).click(); // small

		cy.get('#cell-1').then((cell) => {
			cy.get('#row').should((row) => {
				const cellWidth = cell.width();
				const rowWidth = row.width();
				expect(cellWidth / rowWidth).greaterThan(0.8);
			});
		});

    });
});
