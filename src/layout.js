let Rect = require('./rect');
let Expression = require('./expression');
let Solver = require('./solver');
let Constraint = require('./constraint');

class Layout {
    constructor() {
        this.translation = [0, 0];
        this.children = [];
    }

    addChild(child) {
        this.children.push(child);
    }

    bounds() {
        let inital = {
            left: Infinity,
            right: -Infinity,
            top: Infinity,
            bottom: -Infinity
        };
        return this.children.reduce((bounds, child) => {
            bounds.left = Math.min(bounds.left, child.left);
            bounds.right= Math.max(bounds.right, child.right);
            bounds.top = Math.min(bounds.top, child.top);
            bounds.bottom = Math.max(bounds.bottom, child.bottom);
            return bounds;
        }, inital);
    }

    draw(ctx) {
        let bounds = this.bounds();

        ctx.save();
        ctx.translate(...this.translation);
        this.children.forEach(child => child.draw(ctx));
        ctx.strokeStyle = 'black';
        ctx.strokeRect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);
        ctx.restore();
    }
}

Layout.createFraction = function (num_w, num_h, den_w, den_h) {
    let r1 = new Rect("r1", 'rgba(255,0,0,0.5)');
    let r2 = new Rect("r2", 'rgba(0,0,255,0.5)');
    let bar = new Rect("bar", 'rgba(0,0,0,0.5)');

    let layout1 = new Layout();
    layout1.addChild(r1);
    layout1.addChild(r2);
    layout1.addChild(bar);

    // these two expressions don't share any variables
    r1.cx = (new Expression(1, r1.x)).add(0.5, r1.w);
    r1.cy = (new Expression(1, r1.y)).add(0.5, r1.h);
    r2.cx = (new Expression(1, r2.x)).add(0.5, r2.w);
    r2.cy = (new Expression(1, r2.y)).add(0.5, r2.h);
    bar.cx = (new Expression(1, bar.x)).add(0.5, bar.w);
    bar.cy = (new Expression(1, bar.y)).add(0.5, bar.h);

    let solver1 = new Solver();
    solver1.addConstraint(new Constraint(r1.w, "==", num_w));
    solver1.addConstraint(new Constraint(r1.h, "==", num_h));
    solver1.addConstraint(new Constraint(r2.w, "==", den_w));
    solver1.addConstraint(new Constraint(r2.h, "==", den_h));
    solver1.addConstraint(new Constraint(bar.w, "==", Math.max(num_w, den_w)));
    solver1.addConstraint(new Constraint(bar.h, "==", 5));

    let gap = 25;
    let bottom = (new Expression(1, r1.y)).add(1, r1.h);
    // Note: bottom is an expression, so we're creating expressions from
    // sub expressions here
    //let between = (new Expression(0.5, bottom)).add(0.5, r2.y);

    solver1.addConstraint(new Constraint(r2.y, "==", bottom.clone().add(gap)));
    solver1.addConstraint(new Constraint(r1.cx, "==", r2.cx));
    solver1.addConstraint(new Constraint(bar.cx, "==", r1.cx));
    solver1.addConstraint(new Constraint(r2.y, "==", (new Expression(1, bar.cy)).add(gap/2)));
    solver1.addConstraint(new Constraint(bottom, "==", (new Expression(1, bar.cy)).sub(gap/2)));
    solver1.addConstraint(new Constraint(bar.cx, "==", 0));
    solver1.addConstraint(new Constraint(bar.cy, "==", 0));
    solver1.solve();

    return layout1;
};

module.exports = Layout;
