describe('Render and destroy grid', () => {
    before(() => {
        cy.visit('grid-lite/e2e/destroy-grid');
    });

    it('Destroy and re-render grid', () => {
        cy.get('#destroy-grid-btn').click();
        cy.get('.hcg-container').should('not.exist');
        cy.get('#reload-btn').click();
        cy.get('.hcg-container').should('exist');
    });

    it('Destroy ultimately and try to re-render grid', () => {
        cy.get('#destroy-ultimately-btn').click();
        cy.get('.hcg-container').should('not.exist');
        cy.get('#reload-btn').click();
        cy.get('.hcg-container').should('not.exist');
    });
});
