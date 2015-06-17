let createCanvas = function() {
    document.body.style.backgroundColor = 'gray';
    document.body.style.margin = 0;

    var canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 700;
    canvas.style.backgroundColor = 'white';
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    ctx.translate(200, 350);

    return ctx;
};

let registerDraw = function(callback) {
    let down = false;
    document.addEventListener('mousedown', e => {
        down = true;
    });

    document.addEventListener('mousemove', e => {
        if (down) {
            callback(e.pageX - 500, e.pageY - 350);
        }
    });

    document.addEventListener('mouseup', e => {
        if (down) {
            down = false;
        }
    });
};

let drawAxes = function(ctx) {
    ctx.strokeStyle = 'black';

    ctx.beginPath();
    ctx.moveTo(-250,0);
    ctx.lineTo(255,0);
    ctx.moveTo(0,-250);
    ctx.lineTo(0,250);
    ctx.stroke();
};

module.exports = {
    createCanvas: createCanvas,
    registerDraw: registerDraw,
    drawAxes: drawAxes
};
