describe('Date Input Types', () => {
    before(() => {
        cy.visit('grid-pro/cypress/date-input-types');
    });

    it('Should parse date input values correctly', () => {
        // Test date input type
        cy.get('tr[data-row-index="0"] td[data-column-id="dateView"]')
            .dblclick()
            .find('input[type="date"]')
            .should('have.value', '2023-01-01')
            .clear()
            .type('2023-12-25');

        // Trigger blur to save the value
        cy.get('body').click();

        cy.get('tr[data-row-index="0"] td[data-column-id="dateView"]')
            .should('contain', '2023-12-25');
    });

    it('Should parse datetime input values correctly', () => {
        // Test datetime input type
        cy.get('tr[data-row-index="0"] td[data-column-id="datetimeView"]')
            .dblclick()
            .find('input[type="datetime-local"]')
            .should('have.value', '2023-01-01T08:15:30')
            .clear()
            .type('2023-05-20T14:30');

        // Trigger blur to save the value
        cy.get('body').click();

        cy.get('tr[data-row-index="0"] td[data-column-id="datetimeView"]')
            .should('contain', '2023-05-20 14:30:00');
    });

    it('Should parse time input values correctly', () => {
        // Test time input type
        cy.get('tr[data-row-index="0"] td[data-column-id="timeView"]')
            .dblclick()
            .find('input[type="time"]')
            .should('have.value', '03:00:00')
            .clear()
            .type('16:30');

        // Trigger blur to save the value
        cy.get('body').click();

        cy.get('tr[data-row-index="0"] td[data-column-id="timeView"]')
            .should('contain', '16:30');
    });

    it('Should use correct input types for each column', () => {
        // Verify correct input types are used
        cy.get('tr[data-row-index="0"] td[data-column-id="dateView"]')
            .dblclick()
            .find('input[type="date"]')
            .should('exist');

        cy.get('tr[data-row-index="0"] td[data-column-id="datetimeView"]')
            .dblclick()
            .find('input[type="datetime-local"]')
            .should('exist');

        cy.get('tr[data-row-index="0"] td[data-column-id="timeView"]')
            .dblclick()
            .find('input[type="time"]')
            .should('exist');
    });

    it('Should handle always-edit mode columns', () => {
        // Test columns that are always in edit mode
        cy.get('tr[data-row-index="0"] td[data-column-id="dateEdit"]')
            .find('input[type="date"]')
            .should('exist')
            .should('have.value', '2023-01-01');

        cy.get('tr[data-row-index="0"] td[data-column-id="datetimeEdit"]')
            .find('input[type="datetime-local"]')
            .should('exist')
            .should('have.value', '2023-01-01T21:05:10');

        cy.get('tr[data-row-index="0"] td[data-column-id="timeEdit"]')
            .find('input[type="time"]')
            .should('exist')
            .should('have.value', '07:00:00');
    });
});
