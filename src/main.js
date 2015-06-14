let Variable = require('./variable');
let Expression = require('./expression');
let Constraint = require('./constraint');
let Solver = require('./solver');

let r1 = {
    x: new Variable(),
    y: new Variable(),
    w: new Variable(),
    h: new Variable()
};

let r2 = {
    x: new Variable(),
    y: new Variable(),
    w: new Variable(),
    h: new Variable()
};


// these two expressions don't share any variables
r1.cx = (new Expression(1, r1.x)).add(0.5, r1.w);
r1.cy = (new Expression(1, r1.y)).add(0.5, r1.h);
r2.cx = (new Expression(1, r2.x)).add(0.5, r2.w);
r2.cy = (new Expression(1, r2.y)).add(0.5, r2.h);

let solver = new Solver();
solver.addConstraint(new Constraint(r1.w, "==", 175));
solver.addConstraint(new Constraint(r1.h, "==", 125));
solver.addConstraint(new Constraint(r2.w, "==", 225));
solver.addConstraint(new Constraint(r2.h, "==", 75));

let gap = 25;
r1.bottom = (new Expression(1, r1.y)).add(1, r1.h).add(gap);

solver.addConstraint(new Constraint(r2.y, "==", r1.bottom));
solver.addConstraint(new Constraint(r1.cx, "==", r2.cx));

let cx_cn = solver.addConstraint(new Constraint(r1.cx, "==", 300));
let cy_cn = solver.addConstraint(new Constraint(r1.cy, "==", 200));

solver.solve();

Object.keys(r1).forEach(id => {
    console.log(`${id} = ${r1[id].value}`);
});


document.body.style.backgroundColor = 'gray';
document.body.style.margin = 0;

var canvas = document.createElement('canvas');
canvas.width = 1000;
canvas.height = 700;
canvas.style.backgroundColor = 'white';
document.body.appendChild(canvas);

var ctx = canvas.getContext('2d');

let draw = function (x, y) {
    ctx.fillStyle = 'red';
    ctx.fillRect(r1.x.value, r1.y.value, r1.w.value, r1.h.value);

    ctx.fillStyle = 'blue';
    ctx.fillRect(r2.x.value, r2.y.value, r2.w.value, r2.h.value);

    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
};

draw(300, 200);

let down = false;
document.addEventListener('mousedown', e => {
    down = true;
});

document.addEventListener('mousemove', e => {
    if (down) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        cx_cn.update(r1.cx, "==", e.pageX);
        cy_cn.update(r1.cy, "==", e.pageY);

        solver.solve();

        draw(e.pageX, e.pageY);
    }
});

document.addEventListener('mouseup', e => {
    if (down) {
        down = false;
    }
});
