import puppeteer from 'puppeteer';
declare const Highcharts: any;

export async function runTest<T>(
	html: string,
    js: (data: Array<T>) => number | Promise<number>,
	data: Array<T>
): Promise<number> {
	const browser = await puppeteer.launch({headless: 'new'});
	const page = await browser.newPage();
	await page.setContent(html);

    let result = await page.evaluate(js, data);
    browser.close();

    return result;
}
