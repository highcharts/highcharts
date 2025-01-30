describe('Sorting and resizing wide grid', () => {
    before(() => {
        cy.visit('/grid/cypress/wide-grid');
    });

    it('scroll position should stay the same after sorting', () => {
        cy.get('.hcg-rows-content-nowrap').scrollTo('right');
        cy.get('.hcg-column-sortable').last().click();
        cy.get('.hcg-rows-content-nowrap').then($el => {
            expect($el[0].scrollLeft).to.be.greaterThan(100);
        });
    });

    it('resizing should be limited by the cell padding', () => {
        cy.get('.hcg-column-resizer').last()
            .trigger('mousedown');
        cy.get('body').trigger('mousemove', 100, 0).trigger('mouseup');
        cy.get('.hcg-row td').last().then($el => {
            expect($el[0].offsetWidth).to.be.greaterThan(27);
        });
    });
});
