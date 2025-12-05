describe('Credits.', () => {
    beforeEach(() => {
        cy.visit('/grid-pro/cypress/cell-after-edit/');
    });

    it('View renderer cell edition should trigger afterEdit event.', () => {
        cy.get('tr[data-row-index="0"] > td[data-column-id="cbx"] > input').click();
        cy.get('#view-renderer').should('have.value', 'afterEdit');
    });
    
    it('Edit mode renderer cell edition should trigger afterEdit event.', () => {
        cy.get('tr[data-row-index="0"] > td[data-column-id="price"]').dblclick().type('{backspace}{backspace}10{enter}');
        cy.get('#edit-mode-renderer').should('have.value', 'afterEdit');
    });
});
