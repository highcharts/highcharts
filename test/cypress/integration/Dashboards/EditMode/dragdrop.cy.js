describe('Edit Mode options', () => {
    before(() => {
        cy.visit('/dashboards/cypress/edit-mode-options');
        cy.viewport(1200, 1000);
    });

    it('When disabling the dragDrop and resizer the menu should have only 2 items and resizer should not exist', () => {
        cy.toggleEditMode();
        cy.get('#dashboard-col-0').click();
        cy.get('.highcharts-dashboards-edit-toolbar-cell').children().should('have.length', 2);
        cy.get('.highcharts-dashboards-edit-toolbar-row').children().should('have.length', 2);
        cy.get('.highcharts-dashboards-edit-resize-snap').should('not.exist');

    });
});