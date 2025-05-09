describe('Rendering types.', () => {
    before(() => {
        cy.visit('grid-pro/cypress/cell-editing');
    });

    it('Checkbox for boolean data type.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="booleans"]').eq(0)
            .should('be.visible')
            .find('input[type="checkbox"]')
            .should('exist');
    });

    it('Select type should be selectable.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="country"]').eq(0)
            .should('be.visible')
            .find('select')
            .should('exist')
            .select('Spain');

        cy.get('tr[data-row-index="2"] td[data-column-id="country"]').eq(0)
            .find('option:selected')
            .should('have.text', 'Spain');
    });
});
