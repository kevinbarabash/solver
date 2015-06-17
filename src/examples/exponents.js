let Variable = require('../variable');
let Expression = require('../expression');
let Constraint = require('../constraint');
let Solver = require('../solver');
let Rect = require('../rect');
let Layout = require('../layout');
let Graphics = require('./graphics');

let basic = require('../../metrics/basic-latin.json');




let ctx = Graphics.createCanvas();

ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
ctx.translate(200, 350);

Graphics.drawAxes(ctx);

ctx.font = '144px comic sans ms';

var unit_per_em = 2048;


class Glyph {
    constructor(charcode, fontSize) {
        this.translate = [0, 0];
        this.metrics = basic[charcode];
        this.fontSize = fontSize;
        this.k = fontSize / unit_per_em;
        this.char = String.fromCharCode(charcode);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(...this.translate);
        ctx.font = `${this.fontSize}px comic sans ms`;
        ctx.fillText(this.char, 0, 0);
        ctx.restore();
    }

    // localBounds, parentBounds => apply transform to localBounds
    bounds() {
        let height = this.k * this.metrics.height;
        let bearingY = this.k * this.metrics.bearingY;
        let advance = this.k * this.metrics.advance;
        return {
            left: this.translate[0],
            top: this.translate[1] + y - bearingY,
            right: this.translate[0] + advance,
            bottom: this.translate[1] + height + y - bearingY
        }
    }
}


var metrics = basic[65];

var fontSize = 144;
var k = fontSize / unit_per_em;


let x = 0;
let y = 0;

let a = new Glyph(65, 144);
let b = new Glyph(66, 144);
let c = new Glyph(67, 144);

a.draw(ctx);
b.translate = [a.bounds().right, 0];
b.draw(ctx);
c.translate = [b.bounds().right, 0];
c.draw(ctx);


ctx.strokeStyle = 'transparent';

// - bearingY b/c the coordinate system if flipped
//ctx.strokeRect(x + bearingX, y - bearingY, width, height);
//ctx.strokeRect(x, y - bearingY, advance, height);


// a^2 + b^2 = c^2

let eqn = {
    type: 'equation',
    left: {
        type: 'expression',
        terms: [
            {
                type: 'power',
                base: {
                    type: 'literal',
                    value: 'a'
                },
                exponent: {
                    type: 'literal',
                    value: '2'
                }
            },
            {
                type: 'literal',
                value: '+'
            },
            {
                type: 'power',
                base: {
                    type: 'literal',
                    value: 'b'
                },
                exponent: {
                    type: 'literal',
                    value: '2'
                }
            }
        ]
    },
    right: {
        type: 'expression',
        terms: [
            {
                type: 'power',
                base: {
                    type: 'literal',
                    value: 'b'
                },
                exponent: {
                    type: 'literal',
                    value: '2'
                }
            }
        ]
    }
};



// have traverse return a layout at each level in the recursion
let traverse = function(node) {
    if (node.type === 'literal') {
        console.log(`literal: ${node.value}`);
    } else if (node.type === 'equation') {
        let left = traverse(node.left);
        let right = traverse(node.right);
    }
};

