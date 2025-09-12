describe('Grid Component highlight sync autoscroll', () => {
    beforeEach(() => {
        cy.visit('/dashboards/sync/grid-highlight-sync-autoscroll');
    });

    it('Grid AutoScroll should work', () => {
        cy.get('#autoscroll').click();
        cy.get('#grid-0 tr').eq(30).scrollIntoView();
        cy.get('.hcg-row.hcg-synced-row')
            .should('exist');
    });

    it('Grid AutoScroll should be possible to disable', () => {
        cy.get('#autoscroll').click();
        cy.get('#grid-0 tr').eq(0).scrollIntoView();
        cy.get('tr.hcg-row').children().eq(0).should('have.text', '2015-05-06');
    });
});
