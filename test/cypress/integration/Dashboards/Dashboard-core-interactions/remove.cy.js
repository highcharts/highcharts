describe('Remove the dashboard.', () => {
    before(() => {
        cy.visit('/dashboards/cypress/component-datagrid');
    });

    it('Dashboard should be removed without errors', () => {
        cy.dashboard().then(dashboard => {
            dashboard.destroy();
            cy.get('.hd-dashboards-wrapper').should('not.exist');
            cy.get('#container').should('exist');
        });
    });
});
