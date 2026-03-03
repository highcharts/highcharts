const expectedResult = `"product","weight","price","metaData"
"Apples",100,1.5,"a"
"Pears",40,2.53,"b"
"Plums",0.5,5,"c"
"Bananas",200,4.5,"d"`;
const expectedJSonResult = `{
  "product": [
    "Apples",
    "Pears",
    "Plums",
    "Bananas"
  ],
  "weight": [
    100,
    40,
    0.5,
    200
  ],
  "price": [
    1.5,
    2.53,
    5,
    4.5
  ],
  "metaData": [
    "a",
    "b",
    "c",
    "d"
  ]
}`;

describe('Exporting the Grid.', () => {
    before(() => {
        cy.visit('grid-pro/e2e/exporting');
    });

    it('Grid should be exported to JSON.', () => {
        cy.get('#jsonExport').click();
        cy.get('#result').should('contain', expectedJSonResult);
    });

    it('Grid should be exported to CSV.', () => {
        cy.get('#csvExport').click();
        cy.get('#result').should('contain', expectedResult);
    });
});
