describe('Rendering types and formatters.', () => {
    beforeEach(() => {
        cy.visit('grid-lite/e2e/column-data-type');
    });

    it('For column with dateType of datetime, formatted date should be displayed', () => {
        cy.get('tr[data-row-index="0"] td[data-column-id="date"]').eq(0).contains('2023-01-01 00:00:00');
    });

    it('When formatter returns null, the cell should have custom className and values should be unchanged', () => {
        cy.get('td[data-column-id="booleans"]').eq(0).should('have.class', 'highlight_green');
        cy.get('td[data-column-id="booleans"]').eq(0).should('have.text', 'true');
    });

    it('When formatter returns empty string, the cell should have custom className and values should be empty', () => {
        cy.get('td[data-column-id="string"]').eq(0).should('have.class', 'highlight_green');
        cy.get('td[data-column-id="string"]').eq(0).should('have.text', '');
    });

    it('Lang options should be used for number formatting', () => {
        cy.get('td[data-column-id="thousands"]').eq(0).should('have.text', '12_452|4524');
        cy.get('td[data-column-id="thousands"]').eq(2).should('have.text', '1_234');
    });
});
