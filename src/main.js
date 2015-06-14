let Variable = require('./variable');
let Expression = require('./expression');
let Constraint = require('./constraint');
let Solver = require('./solver');

class Rect {
    constructor(name) {
        if (name) {
            return {
                x: new Variable(name + ".x"),
                y: new Variable(name + ".y"),
                w: new Variable(name + ".w"),
                h: new Variable(name + ".h")
            };
        } else {
            return {
                x: new Variable(),
                y: new Variable(),
                w: new Variable(),
                h: new Variable()
            };
        }
    }
}

let r1 = new Rect("r1");
let r2 = new Rect("r2");
let bar = new Rect("bar");


// these two expressions don't share any variables
r1.cx = (new Expression(1, r1.x)).add(0.5, r1.w);
r1.cy = (new Expression(1, r1.y)).add(0.5, r1.h);
r2.cx = (new Expression(1, r2.x)).add(0.5, r2.w);
r2.cy = (new Expression(1, r2.y)).add(0.5, r2.h);
bar.cx = (new Expression(1, bar.x)).add(0.5, bar.w);
bar.cy = (new Expression(1, bar.y)).add(0.5, bar.h);

let solver = new Solver();
solver.addConstraint(new Constraint(r1.w, "==", 175));
solver.addConstraint(new Constraint(r1.h, "==", 125));
solver.addConstraint(new Constraint(r2.w, "==", 225));
solver.addConstraint(new Constraint(r2.h, "==", 75));
solver.addConstraint(new Constraint(bar.w, "==", 225));
solver.addConstraint(new Constraint(bar.h, "==", 5));

let gap = 25;
r1.bottom = (new Expression(1, r1.y)).add(1, r1.h);
// Note: r1.bottom is an expression, so we're creating expressions from
// sub expressions here
//let between = (new Expression(0.5, r1.bottom)).add(0.5, r2.y);

solver.addConstraint(new Constraint(r2.y, "==", r1.bottom.clone().add(gap)));
solver.addConstraint(new Constraint(r1.cx, "==", r2.cx));
solver.addConstraint(new Constraint(bar.cx, "==", r1.cx));
solver.addConstraint(new Constraint(r2.y, "==", (new Expression(1, bar.cy)).add(gap/2)));
solver.addConstraint(new Constraint(r1.bottom, "==", (new Expression(1, bar.cy)).sub(gap/2)));

//let cn = solver.addConstraint(new Constraint(bar.cy, "==", between));

let cx_cn = solver.addConstraint(new Constraint(bar.cx, "==", 300));
let cy_cn = solver.addConstraint(new Constraint(bar.cy, "==", 200));

solver.solve();

console.log(`cx_cn = ${cx_cn}`);
console.log(`cy_cn = ${cy_cn}`);


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

    ctx.fillStyle = 'black';
    ctx.fillRect(bar.x.value, bar.y.value, bar.w.value, bar.h.value);

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

        cx_cn.update(bar.cx, "==", e.pageX);
        cy_cn.update(bar.cy, "==", e.pageY);

        solver.solve();

        draw(e.pageX, e.pageY);
    }
});

document.addEventListener('mouseup', e => {
    if (down) {
        down = false;
    }
});
