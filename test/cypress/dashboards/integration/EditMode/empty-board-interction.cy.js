describe('Empty board interaction', () => {
    beforeEach(() => {
        cy.visit('/dashboards/basic/empty-board');
        cy.viewport(1200, 1000);
        cy.toggleEditMode();
    });

    it('When component added to an empty board, resize handle should be visible.', () => {
        cy.grabComponent('HTML');
        cy.dropComponent('#container');
        cy.hideSidebar();

        cy.get('.highcharts-dashboards-edit-resize-snap').should('be.visible');
    });

    it('When adding Highcharts component to an empty board, sidebar should be visible.', () => {
        cy.grabComponent('Highcharts');
        cy.dropComponent('#container');

        cy.get('.highcharts-dashboards-edit-sidebar').should('be.visible');
    });

    it('Removing row should remove all components and elements from it.', () => {
        // Act
        cy.grabComponent('Row');
        cy.dropComponent('#container');
        cy.get('.highcharts-dashboards-component-placeholder').click();
        cy.get('.highcharts-dashboards-edit-toolbar-row').find('.highcharts-dashboards-edit-menu-destroy').click();
        cy.get('.highcharts-dashboards-edit-confirmation-popup-confirm-btn').click({ force: true });

        // Assert
        cy.get('.highcharts-dashboards-edit-resize-snap-y').should('not.be.visible');
        cy.get('.highcharts-dashboards-row').should('not.exist');
    });
});
