const blob2base64 = blob => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
});

document.getElementById('run').addEventListener('click', async () => {

    // Prepare POST data
    const body = new FormData();
    body.append('infile', document.getElementById('infile').value);
    body.append('width', 400);

    // Post it to the export server
    const blob = await fetch('https://export.highcharts.com/', {
        body,
        method: 'post'
    }).then(result => result.blob());

    // Create the image
    const img = new Image();
    img.src = await blob2base64(blob);
    document.getElementById('container').appendChild(img);
});
