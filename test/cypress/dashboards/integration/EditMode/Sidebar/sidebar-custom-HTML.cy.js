describe('Edit Mode sidebar', () => {
    beforeEach(() => {
        cy.visit('/dashboards/cypress/custom-html');
        cy.viewport(1200, 1000);
    });

    it('Should be able to open and close sidebar and leave the sidebar open.', () => {
        cy.toggleEditMode();
        cy.openCellEditSidebar('#dashboard-col-0');
        cy.get('.highcharts-dashboards-edit-overlay-active').should('be.visible');
        cy.get('.highcharts-dashboards-edit-sidebar .highcharts-dashboards-edit-popup-close').click();
        cy.get('.highcharts-dashboards-edit-sidebar').should('not.be.visible');
        cy.get('.highcharts-dashboards-edit-overlay-active').should('not.exist');
        cy.get('.highcharts-dashboards-edit-toolbar-cell').should('be.visible');
    });

    it('Should position sidebar so it do not overlap the components.', () => {
        cy.toggleEditMode();

        cy.openCellEditSidebar('#dashboard-col-0');
        cy.get('.highcharts-dashboards-edit-sidebar-right-show').should('exist');
        cy.get('.highcharts-dashboards-edit-sidebar .highcharts-dashboards-edit-popup-close').click();

        cy.openCellEditSidebar('#dashboard-col-1');
        cy.get('.highcharts-dashboards-edit-sidebar-show').should('exist');
    });

    it('Should be able to use the sidebar to update the component.', () => {
        cy.toggleEditMode();
        cy.openCellEditSidebar('#dashboard-col-0');
        cy.get('.highcharts-dashboards-edit-accordion-header-btn')
            .contains('span', 'Chart options')
            .closest('.highcharts-dashboards-edit-collapsable-content-header')
            .as('chartOptionsContainer');

        cy.board().then((board) => {
            assert.ok(board.mountedComponents[0].component.chart.legend.display, 'Legend should be visible');
        });

        // Change legend
        cy.get('@chartOptionsContainer').click();
        cy.get('@chartOptionsContainer').find('.highcharts-dashboards-edit-toggle-container').first().click();
        cy.board().then((board) => {
            assert.notOk(board.mountedComponents[0].component.chart.legend.display, 'Legend should be hidden');
        });

        // Close sidebar and try to discard changes
        cy.get('.highcharts-dashboards-edit-sidebar .highcharts-dashboards-edit-popup-close').click();
        cy.get('.highcharts-dashboards-edit-confirmation-popup').should('be.visible');
        cy.get('.highcharts-dashboards-edit-overlay-active').should('be.visible');
    });
});
