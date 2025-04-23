describe('Column distribution strategies.', () => {
    before(() => {
        cy.visit('/grid-lite/cypress/column-distribution');
    });

    it('Should be mixed strategy when width in column options.', () => {
        cy.grid().then(grid => {
            expect(grid.viewport.columnDistribution.type).to.equal('mixed');
        });
    });

    it('Update should not reset column widths if not changed strategy or updated widths directly.', () => {
        cy.get('.hcg-header-cell').eq(0).as('cell');
        cy.get('@cell').find('.hcg-column-resizer').as('resizer');

        cy.get('@resizer').trigger('mousedown');
        cy.get('@resizer').trigger('mousemove', { pageX: 0 });
        cy.get('@resizer').trigger('mouseup');

        cy.get('#cbx-virt').click();

        cy.get('@cell').invoke('width').should('be.lessThan', 100);
    });

    it('Remove widths from options should change strategy to full.', () => {
        cy.get('#btn-remove-widths').click();

        cy.grid().then(grid => {
            expect(grid.viewport.columnDistribution.type).to.equal('full');
        });
    });
});
