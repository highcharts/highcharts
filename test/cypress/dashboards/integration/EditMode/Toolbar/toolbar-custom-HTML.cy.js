describe('Toolbar when dashboard declared with custom HTML.', () => {
    beforeEach(() => {
        cy.visit('/dashboards/cypress/custom-html');
        cy.viewport(1200, 1000);
    });

    it('Only cell toolbar should be visible.', () => {
        cy.toggleEditMode();
        cy.get('#dashboard-col-0').click();
        cy.get('.highcharts-dashboards-edit-menu.highcharts-dashboards-edit-toolbar-cell').should('be.visible');
        cy.get('.highcharts-dashboards-edit-menu.highcharts-dashboards-edit-toolbar-row').should('not.exist');
    });

    it('Only options should be visible.', () => {
        cy.toggleEditMode();
        cy.get('#dashboard-col-0').click();
        cy.get('.highcharts-dashboards-edit-menu.highcharts-dashboards-edit-toolbar-cell')
            .children()
            .should('have.length', 1);
    });
});
