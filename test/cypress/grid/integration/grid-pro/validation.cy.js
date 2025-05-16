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
            .then(($notifContainer) => {
                expect($notifContainer.position().top > 200)
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
            .then(($notifContainer) => {
                expect($notifContainer.position().top < 200)
            });

        cy.get(topCell)
            .type('4{enter}');
    });

    it('Custom rule.', () => {
        const iconCell = 'tr[data-row-index="2"] td[data-column-id="icon"]';
        cy.get(iconCell)
            .dblclick()
            .find('input')
            .clear()
            .type('{enter}');

        cy.get('.hcg-notification-error').eq(0)
            .should('be.visible')
            .should('contain', 'empty') // First rule
            .should('contain', 'The value must contain "URL"') // Custom rule

        cy.get(iconCell)
            .type('my URL{enter}');
    });

    it('Lang support.', () => {
        const boolCell = 'tr[data-row-index="2"] td[data-column-id="product"]';
        cy.get(boolCell)
            .dblclick()
            .find('input')
            .clear()
            .type('{enter}');
        
        cy.get('.hcg-notification-error').eq(0)
            .should('be.visible')
            .should('contain', 'New value') // Lang rule
        
         cy.get(boolCell)
            .type('true{enter}');
    });

    it('Predefined rules - custom error message.', () => {
        const numberCell =
            'tr[data-row-index="2"] td[data-column-id="numbers"]';
        const priceCell = 'tr[data-row-index="2"] td[data-column-id="price"]';

        cy.get(numberCell)
            .dblclick()
            .find('input')
            .clear()
            .type('{enter}');

        cy.get('.hcg-notification-error').eq(0)
            .should('be.visible')
            .should('contain', 'formatter');

        cy.get(numberCell)
            .type('5{enter}');

        cy.get(priceCell)
            .dblclick()
            .find('input')
            .clear()
            .type('text{enter}');

        cy.get('.hcg-notification-error').eq(0)
            .should('be.visible')
            .should('contain', 'Price should be number');

        cy.get(priceCell)
            .type('5{enter}');
    });
});
