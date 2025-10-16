describe('Grid Pro - validation.', () => {
    beforeEach(() => {
        cy.visit('grid-pro/cypress/cell-editing');
    });

    it('Notification position.', () => {
        // Bottom position
        cy.editGridCell(2, 'numbers', '');

        cy.get('.hcg-notification-error')
            .eq(0)
            .should('be.visible')
            .then(($notifContainer) => {
                expect($notifContainer.position().top > 200);
            });

        cy.editGridCell(2, 'numbers', '4');

        // Top position
        cy.editGridCell(2, 'numbers', '');

        cy.get('.hcg-notification-error')
            .eq(0)
            .should('be.visible')
            .then(($notifContainer) => {
                expect($notifContainer.position().top < 200);
            });

        cy.editGridCell(2, 'numbers', '4');
    });

    it('Custom rule.', () => {
        cy.editGridCell(2, 'icon', '');

        cy.get('.hcg-notification-error')
            .eq(0)
            .should('be.visible')
            .should('contain', 'empty') // First rule
            .should('contain', 'The value must contain "URL"'); // Custom rule
    });

    it('Lang support.', () => {
        cy.editGridCell(2, 'product', '');

        cy.get('.hcg-notification-error').eq(0).should('be.visible').should('contain', 'New value'); // Lang rule
    });

    it('In case of wrong renderer type or dataType, it should default to string.', () => {
        cy.get('tr[data-row-index="2"] td[data-column-id="wrongName"]').should('exist');
    });

    it('Case unique validation.', () => {
        // Act
        cy.editGridCell(1, 'product', 'apples');

        // Assert
        cy.get('.hcg-notification-error')
            .eq(0)
            .should('be.visible')
            .should('contain', 'Value must be unique within this column (case-insensitive).');

        // Act
        cy.editGridCell(1, 'product', 'Red Apples');

        // Assert
        cy.get('.hcg-notification-error').should('not.exist');
    });

    it('Case unique validation with no changes in value.', () => {
        // Act
        cy.editGridCell(0, 'product', 'apples');

        // Assert
        cy.get('.hcg-notification-error').should('not.exist');

        // Act
        cy.editGridCell(1, 'product', 'Apples');

        // Assert
        cy.get('.hcg-notification-error')
            .eq(0)
            .should('be.visible')
            .should('contain', 'Value must be unique within this column (case-insensitive).');
    });
});
