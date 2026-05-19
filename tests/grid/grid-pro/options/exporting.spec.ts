import { test, expect } from '~/fixtures.ts';

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

test.describe('Exporting the Grid', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('grid-pro/e2e/exporting');
    });

    test('Grid should be exported to JSON', async ({ page }) => {
        await page.locator('#jsonExport').click();
        await expect(page.locator('#result')).toContainText(expectedJSonResult);
    });

    test('Grid should be exported to CSV', async ({ page }) => {
        await page.locator('#csvExport').click();
        await expect(page.locator('#result')).toContainText(expectedResult);
    });
});

