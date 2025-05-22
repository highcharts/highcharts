describe('Rendering types.', () => {
    before(() => {
        cy.visit('grid-lite/cypress/column-data-type');
    });

    it('Boolean sign only.', () => {
        cy.get('tr[data-row-index="0"] td[data-column-id="booleans"]').eq(0)
            .should('be.visible')
            .contains('true')
            .find('input[type="checkbox"]')
            .should('not.exist');

        cy.get('tr[data-row-index="1"] td[data-column-id="booleans"]').eq(0)
            .should('be.visible')
            .contains('false')
            .find('input[type="checkbox"]')
            .should('not.exist');
    });

    it('Formatted date.', () => {
        cy.get('tr[data-row-index="0"] td[data-column-id="date"]').eq(0)
            .contains('2023-01-01');
    });
});
