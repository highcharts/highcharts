describe('Column Header Toolbar', () => {
    before(() => {
        cy.viewport(1900, 600);
        cy.visit('grid-lite/cypress/filtering');
    });

    it('Inline filtering is rendered correctly.', () => {
        cy.viewport(1900, 600);
        cy.get('.hcg-column-filter-wrapper').should('have.length', 1);
        cy.get('.hcg-header-cell[data-column-id="url"] .hcg-header-cell-icons')
            .children().should('have.length', 1);
    });

    it('One active button is present.', () => {
        cy.viewport(1900, 600);
        cy.get('.hcg-button.hcg-button-selected').should('have.length', 1);
    });

    it('Clicking filter button opens menu.', () => {
        cy.viewport(1900, 600);
        cy.get('.hcg-button.hcg-button-selected').first().click();
        cy.get('.hcg-popup-content').should('have.length', 1);
    })

    it('Clearing filter condition disactivates button.', () => {
        cy.viewport(1900, 600);
        cy.get('.hcg-popup-content input')
            .type('{backspace}{backspace}{backspace}{backspace}');
        cy.get('.hcg-button.hcg-button-selected').should('have.length', 0);
        cy.get('#container').click({ force: true });
        cy.get('.hcg-popup-content').should('not.exist');
    });

    it('Programmatically set sorting activates button.', () => {
        cy.viewport(800, 600);
        cy.grid().then(grid => {
            grid.viewport.getColumn('product').sorting.setOrder('desc');
        });
        cy.get('.hcg-button.hcg-button-selected').should('have.length', 1);
    });

    it('Shrinking window minifies toolbar.', () => {
        cy.viewport(800, 600);
        cy.get('.hcg-button.hcg-button-selected').first().parent()
            .should('have.class', 'hcg-header-cell-menu-icon');
    });

    it('Clicking menu icon opens menu.', () => {
        cy.viewport(800, 600);
        cy.get('.hcg-button.hcg-button-selected').click();
        cy.get('.hcg-popup').should('have.length', 1);
    });

    it('Can navigate menu with keyboard to filtering.', () => {
        cy.viewport(800, 600);
        cy.get('.hcg-popup').type('{downarrow}{downarrow}{enter}');
        cy.get('.hcg-popup-content input').should('exist')
            .type('es{esc}{esc}{esc}{downArrow}{downArrow}');
        cy.focused().should('have.attr', 'data-column-id', 'product')
            .parent().should('have.attr', 'data-row-id', '0');
    });
});
