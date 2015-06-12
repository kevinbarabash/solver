let Variable = require('./variable');
let Expression = require('./expression');
let Constraint = require('./constraint');


var x, y;

// example 1
x = new Variable(5);
y = new Variable(0);

x.fixed = true;

var cn = new Constraint(x, "==", new Expression(2, y));
console.log(`isSatisfied = ${cn.isSatisfied()}`);
console.log(`isSatisfiable = ${cn.isSatisfiable()}`);

console.log(cn.toString());

cn.satisfy();

console.log(`x = ${x}, y = ${y}`);
console.log(`isSatisfied = ${cn.isSatisfied()}`);

console.log("");


// example 2
x.value = 25;

var e1 = new Expression(1, y);
var e2 = (new Expression(2, x)).add(5);

var cn2 = new Constraint(e1, "==", e2);
console.log(cn2.toString());

cn2.satisfy();

console.log(`x = ${x}, y = ${y}`);
console.log("");


// example 3
x.fixed = false;
y.fixed = false;

let w = new Variable(100);
let h = new Variable(25);

w.fixed = true;
h.fixed = true;

let cx = new Variable(80);
let cy = new Variable(50);

cx.fixed = true;
cy.fixed = true;

// these two expressions don't share any variables
let e3 = (new Expression(1, x)).add(0.5, w);
let e4 = (new Expression(1, y)).add(0.5, h);

let cn3 = new Constraint(cx, "==", e3);
let cn4 = new Constraint(cy, "==", e4);

cn3.satisfy();
cn4.satisfy();

console.log(cn3.toString());
console.log(cn4.toString());
console.log(`x = ${x}, y = ${y}`);
console.log(`isSatisfied = ${cn3.isSatisfied()}`);
console.log(`isSatisfied = ${cn4.isSatisfied()}`);
