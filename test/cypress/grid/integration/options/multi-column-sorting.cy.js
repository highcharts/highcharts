describe('Grid multi-column sorting.', () => {
    const expectedOrder = ['c', 'a', 'b', 'g', 'e', 'f', 'h', 'd'];
    const demoPath = 'grid-lite/cypress/multi-column-sorting';

    it('Shift-click sorts three columns with custom compare.', () => {
        cy.viewport(1200, 800);
        cy.visit(demoPath);

        cy.get('th[data-column-id="group"]').click();
        cy.get('th[data-column-id="score"]').click({ shiftKey: true });
        cy.get('th[data-column-id="id"]').click({ shiftKey: true });

        cy.grid().should(grid => {
            const sortings = grid.querying.sorting.currentSortings || [];
            expect(
                sortings.map(sorting => sorting.columnId),
                'Applied sorting priority'
            ).to.deep.equal(['group', 'score', 'id']);
            expect(
                grid.presentationTable.columns.id,
                'Sorted row order'
            ).to.deep.equal(expectedOrder);
        });

        cy.get('th[data-column-id="group"] .hcg-button span')
            .should('have.text', '1');
        cy.get('th[data-column-id="score"] .hcg-button span')
            .should('have.text', '2');
        cy.get('th[data-column-id="id"] .hcg-button span')
            .should('have.text', '3');
    });

    it('Shift-clicking menu sort adds a secondary priority.', () => {
        cy.viewport(320, 800);
        cy.visit(demoPath);

        cy.get('th[data-column-id="group"]').click();

        cy.get('th[data-column-id="score"] .hcg-header-cell-menu-icon .hcg-button')
            .should('exist')
            .click({ force: true });

        cy.get('.hcg-popup').should('be.visible');

        cy.contains('.hcg-menu-item-label', 'Sort descending')
            .closest('button')
            .click({ shiftKey: true });

        cy.grid().should(grid => {
            const sortings = grid.querying.sorting.currentSortings || [];

            expect(
                sortings.map(sorting => sorting.columnId),
                'Applied sorting priority'
            ).to.deep.equal(['group', 'score']);
            expect(
                sortings.map(sorting => sorting.order),
                'Applied sorting order'
            ).to.deep.equal(['asc', 'desc']);
        });

        cy.contains('.hcg-menu-item-label', 'Sort descending')
            .should('contain.text', '(2)');
    });
});
