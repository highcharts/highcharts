describe('Column distribution strategies.', () => {
    before(() => {
        cy.visit('/grid-lite/cypress/column-resizing-mode');
    });

    it('Should be adjacent strategy by default.', () => {
        cy.grid().then(grid => {
            expect(grid.viewport.columnResizing.type).to.equal('adjacent');
        });
    });

    it('Should be independent strategy when selected.', () => {
        cy.get('#select-distr').select('independent');
        cy.wait(50);
        cy.grid().then(grid => {
            expect(grid.viewport.columnResizing.type).to.equal('independent');
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

    it('Resize should change column width in options', () => {
        cy.grid().then(grid => {
            expect(grid.viewport.columns[0].options.width).to.be.lessThan(100);
        });
    });

    it('Remove widths from options should reset column widths to default.', () => {
        cy.get('#btn-remove-widths').click();

        cy.grid().then(grid => {
            expect(grid.viewport.columns[0].options.width).to.be.undefined;
        });
    });
});
