describe('Responsive buttons.', () => {
    before(() => {
        cy.visit('/dashboards/cypress/add-layout');
        cy.viewport(1200, 1000);
    });

    it('Dashboard should be removed without errors', () => {
        cy.toggleEditMode();

        // Check after setting the size to small.
        cy.get('.highcharts-dashboards-edit-button').eq(0).click(); // small
        cy.get('#dashboard-col-0').invoke('width').should('be.lessThan', 300);
        cy.get('.highcharts-dashboards-edit-button').should('have.class', 'selected');

        // Deselect the small button.
        cy.get('.highcharts-dashboards-edit-button').eq(0).click(); // small
        cy.get('#dashboard-col-0').invoke('width').should('be.greaterThan', 300);
        cy.get('.highcharts-dashboards-edit-button').should('not.have.class', 'selected');

        // Set the size to small again.
        cy.get('.highcharts-dashboards-edit-button').eq(0).click(); // small

        // Disable edit mode.
        cy.toggleEditMode();
        cy.get('#dashboard-col-0').invoke('width').should('be.greaterThan', 300);
        cy.get('#dashboard-col-0').invoke('width').should('be.lessThan', 600);
    });
});
