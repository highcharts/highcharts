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
        cy.get('.highcharts-dashboards-edit-overlay-active').should('exist');

        // Change options few times
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(0).click();
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(1).click();
        cy.get('.highcharts-dashboards-edit-dropdown-button').first().click();
        cy.get('.highcharts-dashboards-edit-custom-option-button').first().click();
        cy.get('#marker-radius').should('have.value', '3');

        cy.get('.highcharts-dashboards-edit-dropdown-button').first().click();
        cy.get('.highcharts-dashboards-edit-custom-option-button').eq(1).click();
        cy.get('#marker-radius').should('have.value', '5');
        cy.get('.highcharts-dashboards-edit-overlay-active').should('exist');

        // Cancel changes but discard
        cy.get('.highcharts-dashboards-edit-confirmation-popup-cancel-btn').eq(0).click();
        cy.get('.highcharts-dashboards-edit-confirmation-popup-cancel-btn').eq(1).click();
        cy.wait(110); // wait for the end of the flag change timeout
        cy.get('.highcharts-dashboards-edit-overlay-active').should('exist');

        // Cancel changes and accept
        cy.get('.highcharts-dashboards-edit-confirmation-popup-cancel-btn').eq(0).click();
        cy.get('.highcharts-dashboards-edit-confirmation-popup-confirm-btn').eq(1).click();
        cy.get('#marker-radius').should('have.value', '10');
        cy.get('.highcharts-dashboards-edit-overlay-active').should('not.exist');

        // Change option again
        cy.openCellEditSidebar('#dashboard-col-0');
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(0).click();
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(1).click();
        cy.get('.highcharts-dashboards-edit-dropdown-button').first().click();
        cy.get('.highcharts-dashboards-edit-custom-option-button').first().click();
        cy.get('.highcharts-dashboards-edit-overlay-active').should('exist');
        cy.get('.highcharts-dashboards-edit-confirmation-popup-confirm-btn').first().click();
        cy.get('#marker-radius').should('have.value', '3');
        cy.get('.highcharts-dashboards-edit-overlay-active').should('not.exist');
    });

    it('Labels should be displayed only for nested components.', () => {
        cy.toggleEditMode();
        cy.openCellEditSidebar('#dashboard-col-0');

        // Open chart options
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(0).click();
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(1).click();
        cy.get('label.highcharts-dashboards-edit-label-text').contains('Marker Radius').should('be.visible');

        // Open connector options
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(2).click();
        cy.get('label.highcharts-dashboards-edit-label-text').contains('connectorName').should('be.not.visible');
    });
});
