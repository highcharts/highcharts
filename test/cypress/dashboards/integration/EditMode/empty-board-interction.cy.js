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
});
