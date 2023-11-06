describe('Component loading', () => {
  before(() => {
    cy.visit('/dashboards/cypress/component-loading/', {
    });
  })


  it('image should be within parent cell', () => {
    cy.get('#dashboard-col-3').within(([dashboardCell]) => {
      const cellBox = dashboardCell.getBoundingClientRect().toJSON();
      const image = dashboardCell.querySelector('img');
      const imageBox = image?.getBoundingClientRect().toJSON();

      if (!cellBox || !imageBox) {
        throw new Error('Failed to find the cell and/or image');
      }

      assert.ok(
        cellBox.width > imageBox.width,
        'The width of image is smaller than cell'
      );
      assert.ok(
        cellBox.height > imageBox.height,
        'The height of image is smaller than cell'
      );

    });
  });
});
