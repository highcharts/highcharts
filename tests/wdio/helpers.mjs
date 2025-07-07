import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

export async function registerHighchartsHelpers() {
  // 1) add setTestingOptions()
  await browser.addCommand('setTestingOptions', async function () {
    await this.execute(() => {
      Highcharts.setOptions({
        chart: { animation: false },
        lang: { locale: 'en-GB' },
        plotOptions: {
          series: {
            animation: false,
            kdNow: true,
            dataLabels: { defer: false },
            states: {
              hover: { animation: false },
              select: { animation: false },
              inactive: { animation: false },
              normal: { animation: false }
            },
            label: { enabled: false }
          },
          networkgraph: {
            layoutAlgorithm: { enableSimulation: false, maxIterations: 10 }
          },
          packedbubble: {
            layoutAlgorithm: { enableSimulation: false, maxIterations: 10 }
          }
        },
        stockTools: { gui: { enabled: false } },
        tooltip: { animation: false },
        drilldown: { animation: false }
      });
    });
  });

  // 2) add loadSample(samplePath)
  await browser.addCommand('loadSample', async function (samplePath) {
    // read demo.details
    const detailsPath = path.join(samplePath, 'demo.details');
    const details = yaml.load(await fs.readFile(detailsPath, 'utf8'));
    const demo = { ...details };

    // read optional assets
    for (const ext of ['html', 'css', 'js', 'mjs', 'ts']) {
      try {
        demo[ext] = await fs.readFile(
          path.join(samplePath, `demo.${ext}`),
          'utf8'
        );
      } catch {/* ignore */;}
    }

    // build template
    const html = `
      <!DOCTYPE html>
      <html lang="en-US">
      <head>
        <meta charset="utf-8">
        <title>${demo.name}</title>
        ${demo.css ? `<style>${demo.css}</style>` : ''}
      </head>
      <body>
        ${demo.html || ''}
        <script id="js" ${demo.esm ? 'type="module"' : ''}>
          ${demo.js || demo.mjs || demo.ts || ''}
        </script>
      </body>
      </html>
    `;

    // load it
    await this.url('about:blank');
    await this.execute(html => document.write(html), html);
    // ensure all scripts/css load
    await this.pause(100);
  });

  // 3) mock code.highcharts.com → local
  if (!process.env.NO_REWRITES) {
    const mock = await browser.mock('https://code.highcharts.com/**', {
      method: 'get'
    });
    mock.respond(async (request) => {
      const url = request.url;
      const rel = url.split('/code.highcharts.com/')[1];
      const localPath = path.join(
        __dirname, '..', '..', 'code',           // adjust as needed
        rel.replace(/^(stock|maps|gantt|grid)\//, '').replace(/\.js$/, '.src.js')
      );
      try {
        const body = await fs.readFile(localPath, null);
        return {
          statusCode: 200,
          body,
          headers: {
            'Content-Type': localPath.endsWith('.js')
              ? 'application/javascript'
              : 'text/css'
          }
        };
      } catch {
        return { statusCode: 404 };
      }
    });
  }
}
