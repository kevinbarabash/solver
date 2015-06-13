let Variable = require('./variable');
let Expression = require('./expression');
let Constraint = require('./constraint');
let Solver = require('./solver');

let x = new Variable();
let y = new Variable();
let w = new Variable();
let h = new Variable();

// these two expressions don't share any variables
let cx = (new Expression(1, x)).add(0.5, w);
let cy = (new Expression(1, y)).add(0.5, h);

let cn3 = new Constraint(cx, "==", 80);
let cn4 = new Constraint(cy, "==", 40);

console.log(cn3.toString());
console.log(cn4.toString());

let solver = new Solver();
solver.addConstraint(cn3);
solver.addConstraint(cn4);
solver.addConstraint(new Constraint(w, "==", 100));
solver.addConstraint(new Constraint(h, "==", 50));

solver.solve();

let vars = { x, y, w, h };

Object.keys(vars).forEach(id => {
    console.log(`${id} = ${vars[id].value}`);
});
