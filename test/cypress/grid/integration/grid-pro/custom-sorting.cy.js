describe('Custom sorting.', () => {
    beforeEach(() => {
        cy.visit('grid-pro/cypress/custom-sorting');
    });

    it('Custom sorting defined in the default column options should be applied.', () => {
        // Act
        cy.get('th[data-column-id="weight"]').click();

        // Assert
        cy.get('td[data-column-id="weight"]')
            .first()
            .should('have.text', '40.0 kg', 'The custom sorting should be applied.');
    });
});
