describe('Responsive buttons.', () => {
    before(() => {
        cy.visit('/dashboards/cypress/add-layout');
        cy.viewport(1200, 1000);
    });

    it('Dashboard should be removed without errors', () => {
        cy.toggleEditMode();
        cy.get('.highcharts-dashboards-edit-button').contains('small').click();

        // Check after setting the size to small
        cy.get('#dashboard-col-0').invoke('width').should('be.lessThan', 300);

        // Disable edit mode.
        cy.toggleEditMode();
        cy.get('#dashboard-col-0').invoke('width').should('be.greaterThan', 300);
        cy.get('#dashboard-col-0').invoke('width').should('be.lessThan', 600);
    });
});
