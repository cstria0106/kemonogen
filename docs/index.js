window.onload = function(){
    var topInput = document.querySelector("#top");
    var middleInput = document.querySelector("#middle");
    var bottomInput = document.querySelector("#bottom"); 

    var top = document.querySelector(".top");
    var middle = document.querySelector(".middle");
    var bottom = document.querySelector(".bottom");

    function update(){
        setTimeout(function(){
            setText(topInput.value, middleInput.value, bottomInput.value);
        });
    }      
    middleInput.addEventListener("change", update);
    middleInput.addEventListener("keydown", update);    
    topInput.addEventListener("change", update);
    topInput.addEventListener("keydown", update);  
    bottomInput.addEventListener("change", update);
    bottomInput.addEventListener("keydown", update);        

    function setText(topText, middleText, bottomText){
        var primaryColour = ["#16ae67", "#ea5421", "#00ac8e", "#227fc4", "#9fa0a0", "#e60013", "#c3d600"];
        var secondaryColour = ["#90c31f", "#f39800", "#e4007f", "#00a1e9", "#c9caca", "#f39800", "#a42e8c"];

        var canvas = document.getElementById("canvas");
        var g = canvas.getContext("2d");

        var topTextSize = 30;
        var topMiddlePadding = 20;
        var middleTextSize = 120;
        var middleBottomPadding = 20;        
        var bottomTextSize = 30;
        var margin = 60;
        var bottomTextLetterSpacing = 20;

        var topTextFont = `normal bold ${topTextSize}px/2 "Yu Mincho"`;
        var middleTextFont = `normal 400 ${middleTextSize}px/2 KillGothic`;
        var bottomTextFont = `normal 400 ${bottomTextSize}px/2 PlayBold`;

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
        function iterate(callback){
            var xors = {
                x: 123456789,
                y: 362436069,
                z: 521288629,
                w: 88675123
            };
            function randomInt(xors) {
                var t = xors.x ^ (xors.x << 11);
                xors.x = xors.y;
                xors.y = xors.z;
                xors.z = xors.w;
                return xors.w = (xors.w^(xors.w>>>19))^(t^(t>>>8));
            }
            function random(xors) {
                return randomInt(xors) / 2147483648;
            }
            g.save();
            var topColors = ["#04ad8f", "#a6ce48", "#f3a118", "#ea6435", "#17b297", "#e30983", "#2782c4", "#1aa6e7", "#b5b5b5", "#f29905", "#e50011", "#ccdc26", "#a5328d", "#0aaa60", "#91c423", "#f29300", "#ec5f69", "#22b69e", "#e63e9b", "#917220"];
            g.font = topTextFont;        
            g.fillStyle = "white";
            g.strokeStyle = "white";
            g.lineJoin = "round";    
            g.lineWidth = 10.0;   
            var metrics = g.measureText(topText);
            g.translate(margin + (canvas.width - metrics.width - margin * 2) * 0.5, margin);
            var x = 0;
            for(var i = 0; i < topText.length; i++){
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
        var xors = {
            x: 123456789,
            y: 362436069,
            z: 521288629,
            w: 88675123
        };
        function randomInt(xors) {
            var t = xors.x ^ (xors.x << 11);
            xors.x = xors.y;
            xors.y = xors.z;
            xors.z = xors.w;
            return xors.w = (xors.w^(xors.w>>>19))^(t^(t>>>8));
        }
        function random(xors) {
            return randomInt(xors) / 2147483648;
        }


        var topColors = ["#04ad8f", "#a6ce48", "#f3a118", "#ea6435", "#17b297", "#e30983", "#2782c4", "#1aa6e7", "#b5b5b5", "#f29905", "#e50011", "#ccdc26", "#a5328d", "#0aaa60", "#91c423", "#f29300", "#ec5f69", "#22b69e", "#e63e9b", "#917220"];

  
        iterate(function(i, c){
            g.strokeText(c, 0, 0);            
        });
        iterate(function(i, c){
            g.fillStyle = topColors[i % topColors.length];
            g.fillText(c, 0, 0);
        });






        // centerize
        var metrics = g.measureText(middleText);
        g.translate((canvas.width - middleMetrics.width) * 0.5, margin + topTextSize + topMiddlePadding);

        // stroke outline
        g.font = middleTextFont;
        g.strokeStyle = "white";
        g.lineWidth = 20.0;
        g.shadowColor = "rgba(0, 0, 0, 0.3)";
        g.shadowBlur = 10;
        g.lineCap = "round";
        g.lineJoin = "round";
        g.strokeText(middleText, 0, 0);
        
        // fill charactors
        var x = 0;
        for(var i = 0; i < middleText.length; i++){
            var c = middleText.slice(i, i + 1);

            // base color
            g.shadowColor = "rgba(0, 0, 0, 0.6)";
            g.shadowBlur = 10;
            g.fillStyle = secondaryColour[i % secondaryColour.length];
            g.fillText(c, 0, 0);

            g.save();

            // clip
            g.beginPath();
            g.moveTo(0, middleTextSize * 0.5);
            g.lineTo(middleTextSize, middleTextSize * 0.5);
            g.lineTo(middleTextSize, middleTextSize);
            g.lineTo(0, middleTextSize);
            g.closePath();
            g.clip();

            // upper color
            g.shadowColor = "none";
            g.shadowBlur = 0;
            g.fillStyle = primaryColour[i % primaryColour.length];
            g.fillText(c, 0, 0);

            g.restore();

            // go to next
            var metrics  = g.measureText(c);
            g.translate(metrics.width, 0);
        }
        
        g.restore();

        // bottom text
        g.save();
        g.strokeStyle = "white";
        g.fillStyle = "#977a2d";
        g.lineWidth = 13.0;
        g.shadowColor = "rgba(0, 0, 0, 0.3)";
        g.shadowBlur = 10;
        g.lineCap = "round";
        g.lineJoin = "round";
        g.textBaseline = "top";
        g.font = bottomTextFont;      

        var metrics = g.measureText(bottomText);
        g.translate(
            (canvas.width - metrics.width - (bottomText.length - 1) * bottomTextLetterSpacing) * 0.5, 
            margin + topTextSize + topMiddlePadding + middleTextSize + middleBottomPadding
        );

        for(var i = 0; i < bottomText.length; i++){
            var c = bottomText.slice(i, i + 1);
            g.strokeText(c, 0, 0);
            g.shadowColor = "transparent";
            g.fillText(c, 0, 0);
            var metrics = g.measureText(c);
            g.translate(metrics.width + bottomTextLetterSpacing, 0);
        }

        g.restore();
    }

    topInput.value = "女の子の姿になった動物たちが繰り広げる大冒険！";
    middleInput.value = "けものフレンズ";
    bottomInput.value = "KEMONO FRIENDS";
    update();
};

