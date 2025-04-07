describe('Grid Pro - validation.', () => {
    before(() => {
        cy.visit('grid-pro/cypress/cell-editing');
    });

    it('Notification position.', () => {

        // Bottom position
        const topCell = 'tr[data-row-index="2"] td[data-column-id="numbers"]';
        cy.get(topCell)
            .dblclick()
            .find('input')
            .clear()
            .type('{enter}');

        cy.get('.hcg-notification-error').eq(0)
            .should('be.visible')
            .then(($errorContainer) => {
                expect($errorContainer.position().top > 200)
            });

        cy.get(topCell)
            .type('4{enter}');
        
        // Top position
        const bottomCell =
            'tr[data-row-index="2"] td[data-column-id="numbers"]';

        cy.get(bottomCell)
            .dblclick()
            .find('input')
            .clear()
            .type('{enter}');

        cy.get('.hcg-notification-error').eq(0)
            .should('be.visible')
            .then(($errorContainer) => {
                expect($errorContainer.position().top < 200)
            });

        cy.get(topCell)
            .type('4{enter}');
    });

    it('Custom rule.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="icon"]')
            .dblclick()
            .find('input')
            .clear()
            .type('{enter}');

        cy.get('.hcg-notification-error').eq(0)
            .should('be.visible')
            .should('contain', 'empty') // First rule
            .should('contain', 'The value must contain "URL"') // Custom rule

        cy.get('tr[data-row-index="2"] td[data-column-id="icon"]')
            .type('my URL{enter}');
    });

    it('Lang support.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="numbers"]')
            .dblclick()
            .find('input')
            .clear()
            .type('{enter}');
        
        cy.get('.hcg-notification-error').eq(0)
            .should('be.visible')
            .should('contain', 'New value') // Lang rule
    });
});
