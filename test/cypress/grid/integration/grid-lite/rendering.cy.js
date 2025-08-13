describe('Rendering types.', () => {
    before(() => {
        cy.visit('grid-lite/cypress/column-data-type');
    });

    it('Formatted date.', () => {
        cy.get('tr[data-row-index="0"] td[data-column-id="date"]').eq(0)
            .contains('2023-01-01 00:00:00');
    });
});
