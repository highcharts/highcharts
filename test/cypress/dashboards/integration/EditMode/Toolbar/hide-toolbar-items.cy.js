describe('Toolbar when dashboard declared with custom HTML.', () => {
    beforeEach(() => {
        cy.visit('/dashboards/edit-mode/toolbars-options');
        cy.viewport(1200, 1000);
    });

    it('For the first cell, the toolbar should be visible with only one item.', () => {
        // Act
        cy.toggleEditMode();
        cy.get('#dashboard-col-0').click();

        // Assert
        cy.get('.highcharts-dashboards-edit-menu.highcharts-dashboards-edit-toolbar-cell').should('be.visible');
        cy.get('.highcharts-dashboards-edit-menu.highcharts-dashboards-edit-toolbar-cell')
            .children(':visible')
            .should('have.length', 1);
        cy.get('.highcharts-dashboards-edit-menu.highcharts-dashboards-edit-toolbar-row').should('be.visible');
        cy.get('.highcharts-dashboards-edit-menu.highcharts-dashboards-edit-toolbar-row')
            .children(':visible')
            .should('have.length', 1);
    });

    it('For the second cell, the toolbar should be visible with all items.', () => {
        // Act
        cy.toggleEditMode();
        cy.get('#dashboard-col-1').click();

        // Assert
        cy.get('.highcharts-dashboards-edit-menu.highcharts-dashboards-edit-toolbar-cell').should('be.visible');
        cy.get('.highcharts-dashboards-edit-menu.highcharts-dashboards-edit-toolbar-cell')
            .children(':visible')
            .should('have.length', 3);
        cy.get('.highcharts-dashboards-edit-menu.highcharts-dashboards-edit-toolbar-row').should('be.visible');
        cy.get('.highcharts-dashboards-edit-menu.highcharts-dashboards-edit-toolbar-row')
            .children(':visible')
            .should('have.length', 1);
    });
});
