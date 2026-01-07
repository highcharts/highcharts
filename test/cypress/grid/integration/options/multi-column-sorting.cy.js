describe('Grid multi-column sorting.', () => {
    const expectedOrder = ['c', 'a', 'b', 'g', 'e', 'f', 'h', 'd'];

    before(() => {
        cy.viewport(1200, 800);
        cy.visit('grid-lite/cypress/multi-column-sorting');
    });

    it('Shift-click sorts three columns with custom compare.', () => {
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

        cy.get('th[data-column-id="group"] .hcg-sort-priority-indicator')
            .should('have.text', '1');
        cy.get('th[data-column-id="score"] .hcg-sort-priority-indicator')
            .should('have.text', '2');
        cy.get('th[data-column-id="id"] .hcg-sort-priority-indicator')
            .should('have.text', '3');
    });
});
