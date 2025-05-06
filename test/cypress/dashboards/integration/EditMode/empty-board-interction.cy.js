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
});
