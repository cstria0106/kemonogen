var seed = {
    x: (2147483648 * Math.random()) | 0,
    y: (2147483648 * Math.random()) | 0,
    z: (2147483648 * Math.random()) | 0,
    w: (2147483648 * Math.random()) | 0
};

function randomInt(xors) {
    var t = xors.x ^ (xors.x << 11);
    xors.x = xors.y;
    xors.y = xors.z;
    xors.z = xors.w;
    return xors.w = (xors.w ^ (xors.w >>> 19)) ^ (t ^ (t >>> 8));
}

function random(xors) {
    return randomInt(xors) / 2147483648;
}

function shuffle(xs) {
    var v = Object.assign({}, seed);
    var xs = xs.slice();
    var ys = [];
    while (0 < xs.length) {
        var i = Math.abs(randomInt(v)) % xs.length;
        ys.push(xs[i]);
        xs.splice(i, 1);
    }
    return ys;
}

var colorTuples = shuffle([
    ["#16ae67", "#90c31f"],
    ["#ea5421", "#f39800"],
    ["#00ac8e", "#e4007f"],
    ["#227fc4", "#00a1e9"],
    ["#9fa0a0", "#c9caca"],
    ["#e60013", "#f39800"],
    ["#c3d600", "#a42e8c"]
]);

var topColors = shuffle(["#04ad8f", "#a6ce48", "#f3a118", "#ea6435", "#17b297", "#e30983", "#2782c4", "#1aa6e7", "#b5b5b5", "#f29905", "#e50011", "#ccdc26", "#a5328d", "#0aaa60", "#91c423", "#f29300", "#ec5f69", "#22b69e", "#e63e9b", "#917220"]);

var topTextSize = 25;
var topMiddlePadding = 20;
var middleTextSize = 120;
var middleBottomPadding = 40;
var bottomTextSize = 20;
var margin = 60;
var bottomTextLetterSpacing = 20;

window.onload = function () {
    var topInput = document.querySelector("#top");
    var middleInput = document.querySelector("#middle");
    var bottomInput = document.querySelector("#bottom");

    var toggleOutline = document.querySelector("#t-outline");
    var toggleShadow = document.querySelector("#t-shadow");

    var image = document.getElementById("result");

    var download = document.getElementById("download");

    var canvas = document.createElement("canvas");
    var g = canvas.getContext("2d");

    middleInput.addEventListener("change", update);
    middleInput.addEventListener("keydown", update);
    topInput.addEventListener("change", update);
    topInput.addEventListener("keydown", update);
    bottomInput.addEventListener("change", update);
    bottomInput.addEventListener("keydown", update);
    toggleOutline.addEventListener("change", update);
    toggleShadow.addEventListener("change", update);

    function update() {
        setTimeout(function () {
            setText(topInput.value, middleInput.value, bottomInput.value);
        });
    }

    function setText(topText, middleText, bottomText) {
        var topTextFont = `normal bold ${topTextSize}px/2 "NanumMyeongjo"`;
        var middleTextFont = `normal 400 ${middleTextSize}px/2 JapariFont`;
        var bottomTextFont = `normal 400 ${bottomTextSize}px/2 NanumSquare`;

        // resize canvas
        g.font = topTextFont;
        var topMetrics = g.measureText(topText);
        g.font = middleTextFont;
        var middleMetrics = g.measureText(middleText);
        g.font = bottomTextFont;
        var bottomMetrics = g.measureText(bottomText);
        canvas.width = margin + Math.max(
            topMetrics.width,
            middleMetrics.width,
            bottomMetrics.width + bottomTextLetterSpacing * (bottomText.length - 1)
        ) + margin;
        canvas.height = margin + topTextSize + topMiddlePadding + middleTextSize + middleBottomPadding + bottomTextSize + margin;

        // prepare canvas
        g.save();
        g.clearRect(0, 0, canvas.width, canvas.height);
        g.textBaseline = "top";

        // stroke top text 
        function iterate(callback) {
            var xors = Object.assign({}, seed);
            g.save();

            g.font = topTextFont;
            g.fillStyle = "white";
            g.strokeStyle = "white";
            g.lineJoin = "round";
            g.lineWidth = 10.0;

            var metrics = g.measureText(topText);
            g.translate(margin + (canvas.width - metrics.width - margin * 2) * 0.5, margin);
            var x = 0;
            for (var i = 0; i < topText.length; i++) {
                var c = topText.slice(i, i + 1);
                var rot = random(xors) * 0.2;
                var metrics = g.measureText(c);
                g.save();
                g.translate(metrics.width * 0.5, topTextSize * 0.5);
                g.rotate(rot);
                g.translate(-metrics.width * 0.5, -topTextSize * 0.5);
                callback(i, c);
                g.restore();
                g.translate(metrics.width, 0);
            }
            g.restore();
        }
        g.save();
        var xors = Object.assign({}, seed);

        var topColors = ["#04ad8f", "#a6ce48", "#f3a118", "#ea6435", "#17b297", "#e30983", "#2782c4", "#1aa6e7", "#b5b5b5", "#f29905", "#e50011", "#ccdc26", "#a5328d", "#0aaa60", "#91c423", "#f29300", "#ec5f69", "#22b69e", "#e63e9b", "#917220"];

        if (toggleOutline.checked) {
            iterate(function (i, c) {
                if (toggleShadow.checked) {
                    g.shadowColor = "rgba(0, 0, 0, 0.3)";
                    g.shadowBlur = 10;
                }
                g.strokeStyle = "black";
                g.strokeText(c, 0, 0);

            });
            iterate(function (i, c) {
                g.strokeStyle = "white";
                g.strokeText(c, 0, 0);
            });
        } else {
            if (toggleShadow.checked) {
                g.shadowColor = "rgba(0, 0, 0, 0.3)";
                g.shadowBlur = 10;
            }
        }

        iterate(function (i, c) {
            g.fillStyle = topColors[i % topColors.length];
            g.fillText(c, 0, 0);
        });


        // centerize
        var metrics = g.measureText(middleText);
        g.translate((canvas.width - middleMetrics.width) * 0.5, margin + topTextSize + topMiddlePadding);

        // stroke outline
        g.font = middleTextFont;
        if (toggleOutline.checked) {
            g.strokeStyle = "white";
            g.lineWidth = 20.0;
            g.lineCap = "round";
            g.lineJoin = "round";
            if (toggleShadow.checked) {
                g.shadowColor = "rgba(0, 0, 0, 0.3)";
                g.shadowBlur = 10;
            }
            g.strokeText(middleText, 0, 0);
        }


        // fill charactors
        var x = 0;
        var xors = Object.assign({}, seed);
        for (var i = 0; i < middleText.length; i++) {
            var c = middleText.slice(i, i + 1);


            if (!toggleOutline.checked && toggleShadow.checked) {
                g.shadowColor = "rgba(0, 0, 0, 0.3)";
                g.shadowBlur = 10;
            } else {
                g.shadowColor = "none";
                g.shadowBlur = 0;
            }

            g.fillStyle = colorTuples[i % colorTuples.length][0];
            g.fillText(c, 0, 0);

            g.save();

            // clip
            var rot = random(xors);
            g.beginPath();
            g.save();
            g.translate(middleTextSize * 0.5, middleTextSize * 0.5);
            g.rotate(rot);
            g.translate(-middleTextSize * 0.5, -middleTextSize * 0.5);
            g.moveTo(-middleTextSize * 2, middleTextSize * 0.5);
            g.lineTo(middleTextSize * 2, middleTextSize * 0.5);
            g.lineTo(middleTextSize * 2, middleTextSize * 2);
            g.lineTo(-middleTextSize * 2, middleTextSize * 2);
            g.closePath();
            g.restore();
            g.clip();

            // upper color
            g.fillStyle = colorTuples[i % colorTuples.length][1];
            g.fillText(c, 0, 0);

            g.restore();

            // go to next
            var metrics = g.measureText(c);
            g.translate(metrics.width, 0);
        }

        g.restore();

        // bottom text
        g.save();
        g.fillStyle = "#977a2d";

        g.strokeStyle = "white";
        g.lineWidth = 13.0;
        g.lineCap = "round";
        g.lineJoin = "round";
        g.textBaseline = "top";
        g.font = bottomTextFont;

        var metrics = g.measureText(bottomText);
        g.translate(
            (canvas.width - metrics.width - (bottomText.length - 1) * bottomTextLetterSpacing) * 0.5,
            margin + topTextSize + topMiddlePadding + middleTextSize + middleBottomPadding
        );

        for (var i = 0; i < bottomText.length; i++) {
            var c = bottomText.slice(i, i + 1);

            if (toggleOutline.checked) {
                if (toggleShadow.checked) {
                    g.shadowColor = "rgba(0, 0, 0, 0.3)";
                    g.shadowBlur = 10;
                }
                g.strokeText(c, 0, 0);
                g.shadowColor = "none";
                g.shadowBlur = 0;
            } else if (toggleShadow.checked) {
                g.shadowColor = "rgba(0, 0, 0, 0.3)";
                g.shadowBlur = 10;
            }

            g.fillText(c, 0, 0);

            var metrics = g.measureText(c);
            g.translate(metrics.width + bottomTextLetterSpacing, 0);
        }

        g.restore();


        var url = canvas.toDataURL();
        image.src = url;
        download.href = url;
    }

    topInput.value = "여자아이의 모습을 한 동물들이 펼치는 대모험!";
    middleInput.value = "케모노 프렌즈";
    bottomInput.value = "KEMONO FRIENDS";
    update();

    download.addEventListener("click", function () {
        canvas.toBlob(function (blob) {
            saveAs(blob, middleInput.value + ".png");
        });
    });
}