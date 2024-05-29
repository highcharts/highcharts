describe('Edit Mode sidebar', () => {
    beforeEach(() => {
        cy.visit('/dashboards/cypress/edit-mode-options');
        cy.viewport(1200, 1000);
    });

    it('When isStandalone enabled, options should not be nested.', () => {
        cy.toggleEditMode();

        // Open sidebar
        cy.get('#dashboard-col-0').click();
        cy.get('.highcharts-dashboards-edit-toolbar-cell').children().eq(0).click();

        // Navigate to the option
        cy.get('.highcharts-dashboards-edit-standalone-element').should('exist');
        cy.get('.highcharts-dashboards-edit-accordion-header').first().then(($header) => {
            cy.wrap($header).find('.highcharts-dashboards-edit-accordion-header-btn').should('not.exist');
        });

        // Use the standalone input and update component.
        cy.get('.highcharts-dashboards-edit-accordion-content input').type('test');
        cy.get('.highcharts-dashboards-edit-confirmation-popup-confirm-btn').click();
        cy.board().then((board) => {
            assert.strictEqual(
                board.mountedComponents[0].component.options.title,
                'test',
                'Component title should be updated.'
            )
        });
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

    it('Input should be empty if the title, caption or subtitle disabled, #21079.', () => {
        cy.toggleEditMode();

        // Open sidebar
        cy.get('#dashboard-col-1').click();
        cy.get('.highcharts-dashboards-edit-toolbar-cell').children().eq(0).click();
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(1).click();

        // Assess
        cy.get('.highcharts-dashboards-edit-accordion-content input').should('have.value', '')
    });
});
