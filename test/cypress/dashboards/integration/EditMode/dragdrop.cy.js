describe('Edit Mode options', () => {
    beforeEach(() => {
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

    it('Values in the sidebar should reflect what is on the chart, #20944.', () => {
        cy.toggleEditMode();

        // Open sidebar
        cy.get('#dashboard-col-0').click();
        cy.get('.highcharts-dashboards-edit-toolbar-cell').children().eq(0).click();

        // Navigate to the option
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(0).click();
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(1).click();
        cy.get('.highcharts-dashboards-edit-dropdown-button-content > span').should('have.text', '10');
    });
});