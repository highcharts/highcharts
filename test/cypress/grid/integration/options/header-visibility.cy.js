describe('DataGrid Header visibility.', () => {
    before(() => {
        cy.visit('grid/basic/header-visibility');
    });

    it('Visibility of the table header should be toggled.', () => {
        cy.get('#toggle-header').click();
        cy.get('.hcg-table thead').should('not.exist');
        cy.get('#toggle-header').click();
        cy.get('.hcg-table thead').should('exist');
    });
});
