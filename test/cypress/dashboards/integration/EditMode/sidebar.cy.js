describe('Edit Mode sidebar', () => {
    beforeEach(() => {
        cy.visit('/dashboards/cypress/edit-mode-options');
        cy.viewport(1200, 1000);
    });

    it('Values in the sidebar should reflect what is on the chart, #20944.', () => {
        cy.toggleEditMode();
        cy.openCellEditSidebar('#dashboard-col-0');

        // Navigate to the option
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(0).click();
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(1).click();
        cy.get('.highcharts-dashboards-edit-dropdown-button-content > span').should('have.text', '10');
    });

    it('Input should be empty if the title, caption or subtitle disabled, #21079.', () => {
        cy.toggleEditMode();
        cy.openCellEditSidebar('#dashboard-col-1');

        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(1).click();

        // Assess
        cy.get('.highcharts-dashboards-edit-accordion-content input').should('have.value', '')
    });

    it('Should be able to confirm or cancel changes, #20756.', () => {
        cy.toggleEditMode();
        cy.openCellEditSidebar('#dashboard-col-0');

        // Change options few times
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(0).click();
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(1).click();
        cy.get('.highcharts-dashboards-edit-dropdown-button').first().click();
        cy.get('.highcharts-dashboards-edit-custom-option-button').first().click();
        cy.get('#marker-radius').should('have.value', '3');

        cy.get('.highcharts-dashboards-edit-dropdown-button').first().click();
        cy.get('.highcharts-dashboards-edit-custom-option-button').eq(1).click();
        cy.get('#marker-radius').should('have.value', '5');

        // Cancel changes
        cy.get('.highcharts-dashboards-edit-confirmation-popup-cancel-btn').click();
        cy.get('.highcharts-dashboards-edit-confirmation-popup-confirm-btn').eq(1).click();
        cy.get('#marker-radius').should('have.value', '10');

        cy.openCellEditSidebar('#dashboard-col-0');

        // Change option again
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(0).click();
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(1).click();
        cy.get('.highcharts-dashboards-edit-dropdown-button').first().click();
        cy.get('.highcharts-dashboards-edit-custom-option-button').first().click();
        cy.get('.highcharts-dashboards-edit-confirmation-popup-confirm-btn').first().click();
        cy.get('#marker-radius').should('have.value', '3');
    });
});
