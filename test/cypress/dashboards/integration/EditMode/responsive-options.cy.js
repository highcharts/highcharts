
describe('Responsive options.', () => {
    before(() => {
        cy.visit('/dashboards/cypress/respo-options');
        cy.viewport(1200, 1000);
    });

    it('The nested layout should apply responsive options on resize', () => {

        // Change the viewport to a mobile device.
        cy.viewport('iphone-x');

		cy.get('#cell-1').then((cell) => {
			cy.get('#row').should((row) => {
				const cellWidth = cell.width();
				const rowWidth = row.width();
				expect(cellWidth / rowWidth).greaterThan(0.8);
			});
		});

    });
});
