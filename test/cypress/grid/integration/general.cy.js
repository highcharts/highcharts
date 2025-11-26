describe('Remove the dashboard.', () => {
    before(() => {
        cy.visit('/dashboards/cypress/grid-hidden');
    });

    it('Rows should be visible when grid is switched from hidden.', () => {
        // Act
        cy.get('#show').trigger('click');

        // Assert
        cy.get('tr').should('have.length', 5);
    });

    it('Rows should have even and odd classes.', () => {
        cy.get('tbody tr').eq(0).should('have.class', 'hcg-row-odd');
        cy.get('tbody tr').eq(1).should('have.class', 'hcg-row-even');
    });
});

describe('Grid rows removal.', () => {
    before(() => {
        cy.visit('/grid-lite/basic/destroy-grid');
    });

    it('Remove all grid rows.', () => {
        cy.get('#delete-rows-btn').click();
        // All grid rows should be removed.
        cy.get('tbody').should('be.empty');
    });
});
