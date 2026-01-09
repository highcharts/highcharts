describe('Grid init in a hidden container.', () => {
    it('Should not keep `noWidth` class on header containers after showing.', () => {
        cy.visit('grid-lite/cypress/init-hidden-container');

        // Sample starts hidden on purpose.
        cy.get('#outer').should('have.css', 'display', 'none');

        // Historically the header containers could end up with `hcg-no-width`
        // when initialized in display:none.
        cy.get('.hcg-header-cell-container.hcg-no-width').should('exist');

        // Wait until the sample shows the container and forces a reflow.
        cy.get('#show').trigger('click');
        cy.get('#outer').should('not.have.css', 'display', 'none');

        // After becoming visible, the header containers should be measurable,
        // and `hcg-no-width` should be removed.
        cy.get('.hcg-header-cell-container.hcg-no-width').should('not.exist');
    });
});

