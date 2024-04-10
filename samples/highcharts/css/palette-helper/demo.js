const { Color } = Highcharts;

const generate = () => {

    const backgroundColor = document.querySelector(
            'input[name="background-color"]'
        ).value,
        neutralColor100 = document.querySelector(
            'input[name="neutral-color"]'
        ).value,
        highlightColor100 = document.querySelector(
            'input[name="highlight-color"]'
        ).value;

    const pre = document.getElementById('container'),
        neutralPreview = document.getElementById('neutral-preview'),
        highlightPreview = document.getElementById('highlight-preview');
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = neutralColor100;
    [...document.querySelectorAll('.demo-content pre,.demo-content a')].forEach(
        element => {
            element.style.color = highlightColor100;
        }
    );

    pre.innerText = '';

    const backgroundColorObj = new Color(backgroundColor),
        neutralColor100Obj = new Color(neutralColor100),
        highlightColor100Obj = new Color(highlightColor100);

    pre.innerText += '/* Neutral color variations */\n';
    [100, 80, 60, 40, 20, 10, 5, 3].forEach(weight => {
        const color = neutralColor100Obj.tweenTo(
            backgroundColorObj,
            (100 - weight) / 100
        );
        pre.innerText += `--highcharts-neutral-color-${weight}: ${color};\n`;

        let preview = document.getElementById(`neutral-preview-${weight}`);
        if (!preview) {
            preview = document.createElement('div');
            preview.id = `neutral-preview-${weight}`;
            neutralPreview.appendChild(preview);

            const label = document.createElement('div');
            label.innerText = `Neutral ${weight}`;
            neutralPreview.appendChild(label);
        }
        preview.style.backgroundColor = color;


    });

    pre.innerText += '\n/* Highlight color variations */\n';
    [100, 80, 60, 20, 10].forEach(weight => {
        const color = highlightColor100Obj.tweenTo(
            backgroundColorObj,
            (100 - weight) / 100
        );
        pre.innerText += `--highcharts-highlight-color-${weight}: ${color};\n`;

        let preview = document.getElementById(`highlight-preview-${weight}`);
        if (!preview) {
            preview = document.createElement('div');
            preview.id = `highlight-preview-${weight}`;
            highlightPreview.appendChild(preview);

            const label = document.createElement('div');
            label.innerText = `Highlight ${weight}`;
            highlightPreview.appendChild(label);
        }
        preview.style.backgroundColor = color;
    });
};

[...document.querySelectorAll('input')]
    .forEach(input => input.addEventListener('change', generate));
generate();