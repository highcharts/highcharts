describe('Column Header Toolbar', () => {
    before(() => {
        cy.viewport(1900, 600);
        cy.visit('grid-lite/cypress/filtering');
    });

    it('Inline filtering is rendered correctly.', () => {
        cy.viewport(1900, 600);
        cy.get('.highcharts-datagrid-column-filter-wrapper').should('have.length', 1);
        cy.get('.highcharts-datagrid-header-cell[data-column-id="url"] .highcharts-datagrid-header-cell-icons')
            .children().should('have.length', 1);
    });

    it('One active button is present.', () => {
        cy.viewport(1900, 600);
        cy.get('.highcharts-datagrid-button.active').should('have.length', 1);
    });

    it('Clicking filter button opens menu.', () => {
        cy.viewport(1900, 600);
        cy.get('.highcharts-datagrid-button.active').first().click();
        cy.get('.highcharts-datagrid-popup-content').should('have.length', 1);
    })

    it('Clearing filter condition disactivates button.', () => {
        cy.viewport(1900, 600);
        cy.get('.highcharts-datagrid-popup-content input')
            .type('{backspace}{backspace}{backspace}{backspace}');
        cy.get('.highcharts-datagrid-button.active').should('have.length', 0);
        cy.get('#container').click();
        cy.get('.highcharts-datagrid-popup-content').should('not.exist');
    });

    it('Programmatically set sorting activates button.', () => {
        cy.viewport(800, 600);
        cy.grid().then(grid => {
            grid.viewport.getColumn('date').sorting.setOrder('desc');
        });
        cy.get('.highcharts-datagrid-button.active').should('have.length', 1);
    });

    it('Shrinking window minifies toolbar.', () => {
        cy.viewport(800, 600);
        cy.get('.highcharts-datagrid-button.active')
            .first().parent().should('have.class', 'highcharts-datagrid-header-cell-menu-icon');
    });

    it('Clicking menu icon opens menu.', () => {
        cy.viewport(800, 600);
        cy.get('.highcharts-datagrid-button.active').click();
        cy.get('.highcharts-datagrid-popup').should('have.length', 1);
    });

    it('Can navigate menu with keyboard to filtering.', () => {
        cy.viewport(800, 600);
        cy.get('.highcharts-datagrid-popup').type('{downarrow}{downarrow}{enter}');
        cy.get('.highcharts-datagrid-popup-content input').should('exist')
            .type('2025-10-06{esc}{esc}{esc}{downArrow}{downArrow}');
        cy.focused().should('have.attr', 'data-column-id', 'date')
            .parent().should('have.attr', 'data-row-id', '5');
    });
});
