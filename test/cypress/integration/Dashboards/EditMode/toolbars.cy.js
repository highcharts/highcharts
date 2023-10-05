describe('Toolbar settings disabled.', () => {
    before(() => {
        cy.visit('/dashboards/edit-mode/toolbars-settings-disabled');
        cy.toggleEditMode();
        cy.get('.highcharts-dashboards-component').first().click();
    });

    it('Settings button should not exist in cell toolbars.', function () {
        cy.get('.highcharts-dashboards-edit-toolbar-cell').children()
            .should('have.length', 2);
    });

    it('Settings button should not exist in row toolbars.', function () {
        cy.get('.highcharts-dashboards-edit-toolbar-row').children()
            .should('have.length', 2);
    });
});