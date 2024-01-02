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

export async function runHCTest(config: any) {
const html = `
<!DOCTYPE html>
<html>
<head>
<script src="https://code.highcharts.com/stock/highstock.js"></script>
</head>
<body>
<div id="container"></div>
</body>
</html>
`;

    const result = await runTest(html,
        (config) => {
        performance.mark('start') 
        Highcharts.stockChart('container', config);
            performance.mark('end')
            return performance.measure('start to end', 'start', 'end').duration;
    }, config);

    return result;
}
