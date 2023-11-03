describe('Context menu.', () => {
    before(() => {
        cy.visit('/dashboards/cypress/add-layout');
        cy.viewport(1200, 1000);
    });

    it('Click on the button should fire the callback.', () => {
        cy.toggleEditMode();

        cy.get('.highcharts-dashboards-edit-menu-item')
            .contains('Context menu click test')
            .click();

        cy.get('.highcharts-dashboards-wrapper')
            .should('have.class', 'context-menu-button-clicked');
    });
});