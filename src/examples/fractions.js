let Variable = require('../variable');
let Expression = require('../expression');
let Constraint = require('../constraint');
let Solver = require('../solver');
let Rect = require('../rect');
let Layout = require('../layout');
let Graphics = require('./graphics');


let layout1 = Layout.createFraction(300,100,200,75);
let layout2 = Layout.createFraction(150,50,225,40);

let solver = new Solver();

let bounds1 = layout1.bounds();
let bounds2 = layout2.bounds();
// TODO: provide a getter for the layout's "origin"

let r1 = new Rect("r1");
let r2 = new Rect("r2");

console.log(bounds1);
console.log(bounds2);

solver.addConstraint(new Constraint(r1.w, "==", bounds1.right - bounds1.left));
solver.addConstraint(new Constraint(r1.h, "==", bounds1.bottom - bounds1.top));

solver.addConstraint(new Constraint(r2.w, "==", bounds2.right - bounds2.left));
solver.addConstraint(new Constraint(r2.h, "==", bounds2.bottom - bounds2.top));

// x, y is the "origin" of the layouts
// TODO: that needs to be made more clear
let left2 = (new Expression(1, r2.x)).sub(0.5, r2.w);
let right1 = (new Expression(1, r1.x)).add(0.5, r1.w);

solver.addConstraint(new Constraint(left2, "==", right1));
solver.addConstraint(new Constraint(left2, "==", 0));

solver.solve();

layout1.translation[0] = r1.x.value;
layout2.translation[0] = r2.x.value;

let ctx = Graphics.createCanvas();

ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
ctx.translate(500, 350);

Graphics.drawAxes(ctx);

layout1.draw(ctx);
layout2.draw(ctx);

ctx.beginPath();
ctx.arc(0, 0, 3, 0, 2 * Math.PI, false);
ctx.fillStyle = 'black';
ctx.fill();
