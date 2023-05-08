const keepDecimals = 0;

document.getElementById('run').click(function () {
    document.getElementById('output').innerText = document.getElementById('input'.value.replace(/\s/g, '').replace(/(\[-?\d+)\.(\d+)(,-?\d+)\.(\d+)(\])/g, function (s1, s2, s3, s4, s5, s6) {
        return keepDecimals ? s2 + '.' + s3.slice(0, keepDecimals) + s4 + '.' + s5.slice(0, keepDecimals) + s6 : s2 + s4 + s6;
    }));
});
