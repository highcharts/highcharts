describe('Remove the dashboard with nested layout.', () => {
    before(() => {
        cy.visit('/dashboards/demos/layout-nested', {});
    });

    it('Dashboard should be removed without errors', () => {
        cy.get('.hd-edit-context-menu-btn').click();
        cy.get('.hd-edit-context-menu-item').contains('Delete current dashboard').click();
        cy.get('.hd-dashboards-wrapper').should('not.exist');
        cy.get('#container').should('exist');
    });
});