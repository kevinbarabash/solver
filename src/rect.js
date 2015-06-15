let Variable = require('./variable');

class Rect {
    constructor(name, color) {
        this.x = new Variable(name + ".x");
        this.y = new Variable(name + ".y");
        this.w = new Variable(name + ".w");
        this.h = new Variable(name + ".h");
        this.color = color;
    }

    get left() { return this.x.value; }
    get right() { return this.x.value + this.w.value; }
    get top() { return this.y.value; }
    get bottom() { return this.y.value + this.h.value; }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x.value, this.y.value, this.w.value, this.h.value);
    }

    toString() {
        return [this.x, this.y, this.w, this.h].map(v => v.toString()).join(":");
    }
}

module.exports = Rect;
