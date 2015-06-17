/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	//require('./examples/fractions');
	'use strict';

	__webpack_require__(9);

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Contains a set of constraints and has facilities for solving
	 * sets of constraints, including:
	 *
	 * - determine which constraints form trees (and a forest)
	 * - determine which constraints need to be solved if a
	 *   particular variable is updated (which tree is it in)
	 * - solve constraints that are solvable and update values
	 *   of variables solved for
	 * - repeat
	 *
	 * Need to figure out the following:
	 *
	 * - how do we support solving the same system multiple times
	 *   with different values, e.g. animating and object and
	 *   ensure related objects update based on constraints
	 */

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Solver = (function () {
	    function Solver() {
	        _classCallCheck(this, Solver);

	        this.constraints = [];
	    }

	    _createClass(Solver, [{
	        key: "addConstraint",
	        value: function addConstraint(cn) {
	            this.constraints.push(cn);
	            return cn;
	        }
	    }, {
	        key: "variables",
	        value: function variables() {
	            return this.constraints.reduce(function (accumulator, cn) {
	                return new Set([].concat(_toConsumableArray(accumulator), _toConsumableArray(cn.expr.variables())));
	            }, new Set());
	        }
	    }, {
	        key: "solve",
	        value: function solve() {
	            var _this = this;

	            // reset all values to undefined
	            var vars = this.variables();
	            vars.forEach(function (v) {
	                return v.value = undefined;
	            });

	            var totalSatisfiedCount = 0;
	            var constraintCount = this.constraints.length;

	            var _loop = function () {
	                var satisfiedCount = 0;

	                // we should really have some arrays that we move contraints
	                // between as they become satisfied... in some cases satisfying
	                // one constraint will actually satisfy multiple constraints
	                _this.constraints.forEach(function (cn) {
	                    if (cn.isSatisfiable()) {
	                        if (cn.expr.freeVariables().length === 1) {
	                            cn.satisfy();
	                            satisfiedCount++;
	                        }
	                    } else {
	                        throw new Error("unsatifiable constraint");
	                    }
	                });
	                if (satisfiedCount === 0) {
	                    if (_this.constraints.every(function (cn) {
	                        return cn.isSatisfied;
	                    })) {
	                        return "break";
	                    }
	                    throw new Error("unable to solve all constraints");
	                }
	                totalSatisfiedCount += satisfiedCount;
	            };

	            while (totalSatisfiedCount < constraintCount) {
	                var _ret = _loop();

	                if (_ret === "break") break;
	            }
	        }
	    }]);

	    return Solver;
	})();

	module.exports = Solver;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var id = 0;

	var Variable = (function () {
	    function Variable(name) {
	        _classCallCheck(this, Variable);

	        Object.assign(this, { name: name });
	        this.value = undefined;
	        this.id = id++;
	    }

	    _createClass(Variable, [{
	        key: "toString",
	        value: function toString() {
	            if (this.name) {
	                return "[" + this.name + ":" + this.value + "]";
	            } else {
	                return "[v" + this.id + ":" + this.value + "]";
	            }
	        }

	        // TODO: global look up based on id

	    }]);

	    return Variable;
	})();

	module.exports = Variable;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Variable = __webpack_require__(3);

	var Expression = (function () {
	    /**
	     *
	     * @param coeff
	     * @param {Expression} term
	     */

	    function Expression() {
	        var _this = this;

	        var coeff = arguments[0] === undefined ? 0 : arguments[0];
	        var term = arguments[1] === undefined ? null : arguments[1];

	        _classCallCheck(this, Expression);

	        this.terms = []; // TODO: create a Term object

	        if (term instanceof Variable || term === null) {
	            this.terms.push({ coeff: coeff, variable: term });
	        } else if (term instanceof Expression) {
	            term.terms.forEach(function (t) {
	                _this.terms.push({
	                    coeff: t.coeff * coeff,
	                    variable: t.variable
	                });
	            });
	        } else {
	            throw new Error("can't handle this kind of term");
	        }
	    }

	    _createClass(Expression, [{
	        key: "add",
	        value: function add(coeff, variable) {
	            this.terms.push({ coeff: coeff, variable: variable });
	            return this;
	        }
	    }, {
	        key: "sub",
	        value: function sub(coeff, variable) {
	            this.terms.push({ coeff: -coeff, variable: variable });
	            return this;
	        }
	    }, {
	        key: "clone",
	        value: function clone() {
	            var expr = new Expression();
	            expr.terms = [];
	            this.terms.forEach(function (t) {
	                return expr.terms.push(t);
	            });
	            return expr;
	        }
	    }, {
	        key: "freeVariables",
	        value: function freeVariables() {
	            return this.terms.filter(function (t) {
	                return t.variable && t.variable.value == undefined;
	            }).map(function (t) {
	                return t.variable;
	            });
	        }
	    }, {
	        key: "variables",
	        value: function variables() {
	            return new Set(this.terms.filter(function (t) {
	                return t.variable;
	            }).map(function (t) {
	                return t.variable;
	            }));
	        }
	    }, {
	        key: "collectLikeTerms",
	        value: function collectLikeTerms() {
	            var constant = { coeff: 0, variable: null };
	            var terms = new WeakMap();
	            var variables = [];

	            this.terms.forEach(function (t) {
	                if (t.variable) {
	                    if (!terms.has(t.variable)) {
	                        terms.set(t.variable, { coeff: 0, variable: t.variable });
	                        variables.push(t.variable);
	                    }
	                    var term = terms.get(t.variable);
	                    term.coeff += t.coeff;
	                } else {
	                    constant.coeff += t.coeff;
	                }
	            });

	            this.terms = variables.map(function (v) {
	                return terms.get(v);
	            });
	            this.terms.push(constant);
	        }
	    }, {
	        key: "toString",
	        value: function toString() {
	            return this.terms.map(function (t) {
	                return "" + t.coeff + " * " + t.variable;
	            }).join(" + ");
	        }
	        // TODO: collect_like_terms

	    }, {
	        key: "value",
	        get: function () {
	            var sum = 0;
	            this.terms.forEach(function (t) {
	                if (t.variable) {
	                    sum += t.coeff * t.variable.value;
	                } else {
	                    sum += t.coeff;
	                }
	            });
	            return sum;
	        }
	    }]);

	    return Expression;
	})();

	module.exports = Expression;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Variable = __webpack_require__(3);
	var Expression = __webpack_require__(4);

	var Constraint = (function () {
	    function Constraint(left, comp, right) {
	        _classCallCheck(this, Constraint);

	        this.update(left, comp, right);
	    }

	    _createClass(Constraint, [{
	        key: 'update',

	        // TODO: create an example with updating constraints
	        value: function update(left, comp, right) {
	            var _this = this;

	            if (Number.isFinite(left)) {
	                left = new Expression(left);
	            } else {
	                left = new Expression(1, left);
	            }

	            if (Number.isFinite(right)) {
	                right = new Expression(right);
	            } else {
	                right = new Expression(1, right);
	            }

	            this.expr = new Expression();

	            left.terms.forEach(function (t) {
	                return _this.expr.add(t.coeff, t.variable);
	            });
	            right.terms.forEach(function (t) {
	                return _this.expr.add(-t.coeff, t.variable);
	            });

	            this.expr.collectLikeTerms();
	            this.comp = comp;
	        }
	    }, {
	        key: 'isSatisfied',
	        value: function isSatisfied() {
	            // this might be too small
	            var epsilon = Number.EPSILON;

	            switch (this.comp) {
	                case '==':
	                    return Math.abs(this.expr.value) < epsilon;
	            }

	            throw new Error('invalid comparison operator');
	        }
	    }, {
	        key: 'isSatisfiable',
	        value: function isSatisfiable() {
	            if (this.isSatisfied()) {
	                return true;
	            } else {
	                return this.expr.freeVariables().length > 0;
	            }
	            // if x = 50, y = 20 and both are fixed and the constraint is
	            // x == y, well then, we can't satisfy it
	        }
	    }, {
	        key: 'satisfy',
	        value: function satisfy() {
	            if (!this.isSatisfiable()) {
	                throw new Error('constraint cannot be satified');
	            }

	            if (this.comp !== '==') {
	                throw new Error('can\'t process inequalities yet');
	            }

	            var freeVars = this.expr.freeVariables();
	            if (freeVars.length != 1) {
	                throw new Error('constraint is satisfiable, ' + 'but this library doesn\'t know how to do it yet');
	            }

	            var freeVariable = freeVars[0];
	            var remainingTerm = null;
	            var result = 0;
	            this.expr.terms.forEach(function (t) {
	                if (t.variable === freeVariable) {
	                    remainingTerm = t;
	                } else {
	                    if (t.variable) {
	                        result += t.coeff * t.variable.value;
	                    } else {
	                        result += t.coeff;
	                    }
	                }
	            });

	            freeVariable.value = result / -remainingTerm.coeff;
	        }
	    }, {
	        key: 'variables',
	        value: function variables() {
	            return this.expr.variables();
	        }
	    }, {
	        key: 'toString',
	        value: function toString() {
	            return '' + this.expr + ' == 0';
	        }
	    }]);

	    return Constraint;
	})();

	module.exports = Constraint;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Variable = __webpack_require__(3);

	var Rect = (function () {
	    function Rect(name, color) {
	        _classCallCheck(this, Rect);

	        this.x = new Variable(name + ".x");
	        this.y = new Variable(name + ".y");
	        this.w = new Variable(name + ".w");
	        this.h = new Variable(name + ".h");
	        this.color = color;
	    }

	    _createClass(Rect, [{
	        key: "draw",
	        value: function draw(ctx) {
	            ctx.fillStyle = this.color;
	            ctx.fillRect(this.x.value, this.y.value, this.w.value, this.h.value);
	        }
	    }, {
	        key: "toString",
	        value: function toString() {
	            return [this.x, this.y, this.w, this.h].map(function (v) {
	                return v.toString();
	            }).join(":");
	        }
	    }, {
	        key: "left",
	        get: function () {
	            return this.x.value;
	        }
	    }, {
	        key: "right",
	        get: function () {
	            return this.x.value + this.w.value;
	        }
	    }, {
	        key: "top",
	        get: function () {
	            return this.y.value;
	        }
	    }, {
	        key: "bottom",
	        get: function () {
	            return this.y.value + this.h.value;
	        }
	    }]);

	    return Rect;
	})();

	module.exports = Rect;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Rect = __webpack_require__(6);
	var Expression = __webpack_require__(4);
	var Solver = __webpack_require__(2);
	var Constraint = __webpack_require__(5);

	var Layout = (function () {
	    function Layout() {
	        _classCallCheck(this, Layout);

	        this.translation = [0, 0];
	        this.children = [];
	    }

	    _createClass(Layout, [{
	        key: 'addChild',
	        value: function addChild(child) {
	            this.children.push(child);
	        }
	    }, {
	        key: 'bounds',
	        value: function bounds() {
	            var inital = {
	                left: Infinity,
	                right: -Infinity,
	                top: Infinity,
	                bottom: -Infinity
	            };
	            return this.children.reduce(function (bounds, child) {
	                bounds.left = Math.min(bounds.left, child.left);
	                bounds.right = Math.max(bounds.right, child.right);
	                bounds.top = Math.min(bounds.top, child.top);
	                bounds.bottom = Math.max(bounds.bottom, child.bottom);
	                return bounds;
	            }, inital);
	        }
	    }, {
	        key: 'draw',
	        value: function draw(ctx) {
	            var bounds = this.bounds();

	            ctx.save();
	            ctx.translate.apply(ctx, _toConsumableArray(this.translation));
	            this.children.forEach(function (child) {
	                return child.draw(ctx);
	            });
	            ctx.strokeStyle = 'black';
	            ctx.strokeRect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);
	            ctx.restore();
	        }
	    }]);

	    return Layout;
	})();

	Layout.createFraction = function (num_w, num_h, den_w, den_h) {
	    var r1 = new Rect('r1', 'rgba(255,0,0,0.5)');
	    var r2 = new Rect('r2', 'rgba(0,0,255,0.5)');
	    var bar = new Rect('bar', 'rgba(0,0,0,0.5)');

	    var layout1 = new Layout();
	    layout1.addChild(r1);
	    layout1.addChild(r2);
	    layout1.addChild(bar);

	    // these two expressions don't share any variables
	    r1.cx = new Expression(1, r1.x).add(0.5, r1.w);
	    r1.cy = new Expression(1, r1.y).add(0.5, r1.h);
	    r2.cx = new Expression(1, r2.x).add(0.5, r2.w);
	    r2.cy = new Expression(1, r2.y).add(0.5, r2.h);
	    bar.cx = new Expression(1, bar.x).add(0.5, bar.w);
	    bar.cy = new Expression(1, bar.y).add(0.5, bar.h);

	    var solver1 = new Solver();
	    solver1.addConstraint(new Constraint(r1.w, '==', num_w));
	    solver1.addConstraint(new Constraint(r1.h, '==', num_h));
	    solver1.addConstraint(new Constraint(r2.w, '==', den_w));
	    solver1.addConstraint(new Constraint(r2.h, '==', den_h));
	    solver1.addConstraint(new Constraint(bar.w, '==', Math.max(num_w, den_w)));
	    solver1.addConstraint(new Constraint(bar.h, '==', 5));

	    var gap = 25;
	    var bottom = new Expression(1, r1.y).add(1, r1.h);
	    // Note: bottom is an expression, so we're creating expressions from
	    // sub expressions here
	    //let between = (new Expression(0.5, bottom)).add(0.5, r2.y);

	    solver1.addConstraint(new Constraint(r2.y, '==', bottom.clone().add(gap)));
	    solver1.addConstraint(new Constraint(r1.cx, '==', r2.cx));
	    solver1.addConstraint(new Constraint(bar.cx, '==', r1.cx));
	    solver1.addConstraint(new Constraint(r2.y, '==', new Expression(1, bar.cy).add(gap / 2)));
	    solver1.addConstraint(new Constraint(bottom, '==', new Expression(1, bar.cy).sub(gap / 2)));
	    solver1.addConstraint(new Constraint(bar.cx, '==', 0));
	    solver1.addConstraint(new Constraint(bar.cy, '==', 0));
	    solver1.solve();

	    return layout1;
	};

	module.exports = Layout;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var createCanvas = function createCanvas() {
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

	var registerDraw = function registerDraw(callback) {
	    var down = false;
	    document.addEventListener('mousedown', function (e) {
	        down = true;
	    });

	    document.addEventListener('mousemove', function (e) {
	        if (down) {
	            callback(e.pageX - 500, e.pageY - 350);
	        }
	    });

	    document.addEventListener('mouseup', function (e) {
	        if (down) {
	            down = false;
	        }
	    });
	};

	var drawAxes = function drawAxes(ctx) {
	    ctx.strokeStyle = 'black';

	    ctx.beginPath();
	    ctx.moveTo(-250, 0);
	    ctx.lineTo(255, 0);
	    ctx.moveTo(0, -250);
	    ctx.lineTo(0, 250);
	    ctx.stroke();
	};

	module.exports = {
	    createCanvas: createCanvas,
	    registerDraw: registerDraw,
	    drawAxes: drawAxes
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Variable = __webpack_require__(3);
	var Expression = __webpack_require__(4);
	var Constraint = __webpack_require__(5);
	var Solver = __webpack_require__(2);
	var Rect = __webpack_require__(6);
	var Layout = __webpack_require__(7);
	var Graphics = __webpack_require__(8);

	var basic = __webpack_require__(10);

	var ctx = Graphics.createCanvas();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.translate(200, 350);

	Graphics.drawAxes(ctx);

	ctx.font = '144px comic sans ms';

	var unit_per_em = 2048;

	var Glyph = (function () {
	    function Glyph(charcode, fontSize) {
	        _classCallCheck(this, Glyph);

	        this.translate = [0, 0];
	        this.metrics = basic[charcode];
	        this.fontSize = fontSize;
	        this.k = fontSize / unit_per_em;
	        this.char = String.fromCharCode(charcode);
	    }

	    _createClass(Glyph, [{
	        key: 'draw',
	        value: function draw(ctx) {
	            ctx.save();
	            ctx.translate.apply(ctx, _toConsumableArray(this.translate));
	            ctx.font = '' + this.fontSize + 'px comic sans ms';
	            ctx.fillText(this.char, 0, 0);
	            ctx.restore();
	        }
	    }, {
	        key: 'bounds',

	        // localBounds, parentBounds => apply transform to localBounds
	        value: function bounds() {
	            var height = this.k * this.metrics.height;
	            var bearingY = this.k * this.metrics.bearingY;
	            var advance = this.k * this.metrics.advance;
	            return {
	                left: this.translate[0],
	                top: this.translate[1] + y - bearingY,
	                right: this.translate[0] + advance,
	                bottom: this.translate[1] + height + y - bearingY
	            };
	        }
	    }]);

	    return Glyph;
	})();

	var metrics = basic[65];

	var fontSize = 144;
	var k = fontSize / unit_per_em;

	var x = 0;
	var y = 0;

	var a = new Glyph(65, 144);
	var b = new Glyph(66, 144);
	var c = new Glyph(67, 144);

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

	var eqn = {
	    type: 'equation',
	    left: {
	        type: 'expression',
	        terms: [{
	            type: 'power',
	            base: {
	                type: 'literal',
	                value: 'a'
	            },
	            exponent: {
	                type: 'literal',
	                value: '2'
	            }
	        }, {
	            type: 'literal',
	            value: '+'
	        }, {
	            type: 'power',
	            base: {
	                type: 'literal',
	                value: 'b'
	            },
	            exponent: {
	                type: 'literal',
	                value: '2'
	            }
	        }]
	    },
	    right: {
	        type: 'expression',
	        terms: [{
	            type: 'power',
	            base: {
	                type: 'literal',
	                value: 'b'
	            },
	            exponent: {
	                type: 'literal',
	                value: '2'
	            }
	        }]
	    }
	};

	// have traverse return a layout at each level in the recursion
	var traverse = function traverse(node) {
	    if (node.type === 'literal') {
	        console.log('literal: ' + node.value);
	    } else if (node.type === 'equation') {
	        var left = traverse(node.left);
	        var right = traverse(node.right);
	    }
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
		"32": {
			"width": 0,
			"height": 0,
			"advance": 612,
			"bearingX": 0,
			"bearingY": 0
		},
		"33": {
			"width": 212,
			"height": 1671,
			"advance": 487,
			"bearingX": 120,
			"bearingY": 1605
		},
		"34": {
			"width": 571,
			"height": 660,
			"advance": 869,
			"bearingX": 116,
			"bearingY": 1588
		},
		"35": {
			"width": 1674,
			"height": 1604,
			"advance": 1726,
			"bearingX": 32,
			"bearingY": 1576
		},
		"36": {
			"width": 1126,
			"height": 2117,
			"advance": 1420,
			"bearingX": 100,
			"bearingY": 1721
		},
		"37": {
			"width": 1462,
			"height": 1672,
			"advance": 1680,
			"bearingX": 147,
			"bearingY": 1642
		},
		"38": {
			"width": 1193,
			"height": 1658,
			"advance": 1340,
			"bearingX": 75,
			"bearingY": 1564
		},
		"39": {
			"width": 188,
			"height": 520,
			"advance": 795,
			"bearingX": 284,
			"bearingY": 1660
		},
		"40": {
			"width": 582,
			"height": 2038,
			"advance": 750,
			"bearingX": 114,
			"bearingY": 1606
		},
		"41": {
			"width": 582,
			"height": 2038,
			"advance": 750,
			"bearingX": 114,
			"bearingY": 1606
		},
		"42": {
			"width": 916,
			"height": 813,
			"advance": 1085,
			"bearingX": 47,
			"bearingY": 1594
		},
		"43": {
			"width": 865,
			"height": 814,
			"advance": 984,
			"bearingX": 48,
			"bearingY": 1046
		},
		"44": {
			"width": 301,
			"height": 486,
			"advance": 567,
			"bearingX": 198,
			"bearingY": 142
		},
		"45": {
			"width": 647,
			"height": 170,
			"advance": 853,
			"bearingX": 111,
			"bearingY": 631
		},
		"46": {
			"width": 248,
			"height": 248,
			"advance": 510,
			"bearingX": 143,
			"bearingY": 155
		},
		"47": {
			"width": 887,
			"height": 1719,
			"advance": 1048,
			"bearingX": 84,
			"bearingY": 1629
		},
		"48": {
			"width": 1118,
			"height": 1594,
			"advance": 1250,
			"bearingX": 61,
			"bearingY": 1555
		},
		"49": {
			"width": 643,
			"height": 1560,
			"advance": 922,
			"bearingX": 158,
			"bearingY": 1559
		},
		"50": {
			"width": 938,
			"height": 1539,
			"advance": 1250,
			"bearingX": 164,
			"bearingY": 1536
		},
		"51": {
			"width": 937,
			"height": 1572,
			"advance": 1250,
			"bearingX": 146,
			"bearingY": 1526
		},
		"52": {
			"width": 1141,
			"height": 1586,
			"advance": 1250,
			"bearingX": 48,
			"bearingY": 1560
		},
		"53": {
			"width": 1027,
			"height": 1607,
			"advance": 1250,
			"bearingX": 126,
			"bearingY": 1544
		},
		"54": {
			"width": 998,
			"height": 1628,
			"advance": 1250,
			"bearingX": 111,
			"bearingY": 1556
		},
		"55": {
			"width": 1144,
			"height": 1574,
			"advance": 1250,
			"bearingX": 70,
			"bearingY": 1508
		},
		"56": {
			"width": 1008,
			"height": 1584,
			"advance": 1250,
			"bearingX": 118,
			"bearingY": 1530
		},
		"57": {
			"width": 1044,
			"height": 1631,
			"advance": 1250,
			"bearingX": 112,
			"bearingY": 1536
		},
		"58": {
			"width": 231,
			"height": 1006,
			"advance": 612,
			"bearingX": 183,
			"bearingY": 1129
		},
		"59": {
			"width": 330,
			"height": 1318,
			"advance": 612,
			"bearingX": 81,
			"bearingY": 1124
		},
		"60": {
			"width": 608,
			"height": 867,
			"advance": 781,
			"bearingX": 19,
			"bearingY": 1061
		},
		"61": {
			"width": 781,
			"height": 723,
			"advance": 1045,
			"bearingX": 99,
			"bearingY": 999
		},
		"62": {
			"width": 678,
			"height": 939,
			"advance": 781,
			"bearingX": 58,
			"bearingY": 1125
		},
		"63": {
			"width": 909,
			"height": 1550,
			"advance": 1073,
			"bearingX": 52,
			"bearingY": 1478
		},
		"64": {
			"width": 1643,
			"height": 1770,
			"advance": 1907,
			"bearingX": 110,
			"bearingY": 1630
		},
		"65": {
			"width": 1221,
			"height": 1508,
			"advance": 1498,
			"bearingX": 131,
			"bearingY": 1478
		},
		"66": {
			"width": 1017,
			"height": 1619,
			"advance": 1291,
			"bearingX": 191,
			"bearingY": 1571
		},
		"67": {
			"width": 1113,
			"height": 1547,
			"advance": 1234,
			"bearingX": 90,
			"bearingY": 1523
		},
		"68": {
			"width": 1193,
			"height": 1655,
			"advance": 1478,
			"bearingX": 183,
			"bearingY": 1556
		},
		"69": {
			"width": 1073,
			"height": 1704,
			"advance": 1279,
			"bearingX": 140,
			"bearingY": 1605
		},
		"70": {
			"width": 1031,
			"height": 1679,
			"advance": 1243,
			"bearingX": 173,
			"bearingY": 1573
		},
		"71": {
			"width": 1276,
			"height": 1640,
			"advance": 1392,
			"bearingX": 79,
			"bearingY": 1571
		},
		"72": {
			"width": 1313,
			"height": 1637,
			"advance": 1573,
			"bearingX": 152,
			"bearingY": 1554
		},
		"73": {
			"width": 985,
			"height": 1530,
			"advance": 1119,
			"bearingX": 75,
			"bearingY": 1494
		},
		"74": {
			"width": 1202,
			"height": 1635,
			"advance": 1362,
			"bearingX": 94,
			"bearingY": 1515
		},
		"75": {
			"width": 1029,
			"height": 1641,
			"advance": 1251,
			"bearingX": 214,
			"bearingY": 1531
		},
		"76": {
			"width": 988,
			"height": 1635,
			"advance": 1128,
			"bearingX": 101,
			"bearingY": 1542
		},
		"77": {
			"width": 1619,
			"height": 1617,
			"advance": 1808,
			"bearingX": 112,
			"bearingY": 1534
		},
		"78": {
			"width": 1424,
			"height": 1630,
			"advance": 1632,
			"bearingX": 123,
			"bearingY": 1551
		},
		"79": {
			"width": 1432,
			"height": 1576,
			"advance": 1635,
			"bearingX": 116,
			"bearingY": 1515
		},
		"80": {
			"width": 905,
			"height": 1595,
			"advance": 1066,
			"bearingX": 100,
			"bearingY": 1571
		},
		"81": {
			"width": 1673,
			"height": 1953,
			"advance": 1795,
			"bearingX": 77,
			"bearingY": 1515
		},
		"82": {
			"width": 1111,
			"height": 1576,
			"advance": 1287,
			"bearingX": 117,
			"bearingY": 1541
		},
		"83": {
			"width": 1188,
			"height": 1524,
			"advance": 1420,
			"bearingX": 133,
			"bearingY": 1467
		},
		"84": {
			"width": 1347,
			"height": 1526,
			"advance": 1392,
			"bearingX": 116,
			"bearingY": 1518
		},
		"85": {
			"width": 1234,
			"height": 1543,
			"advance": 1509,
			"bearingX": 155,
			"bearingY": 1503
		},
		"86": {
			"width": 1181,
			"height": 1615,
			"advance": 1331,
			"bearingX": 145,
			"bearingY": 1535
		},
		"87": {
			"width": 1957,
			"height": 1622,
			"advance": 2129,
			"bearingX": 139,
			"bearingY": 1526
		},
		"88": {
			"width": 1338,
			"height": 1605,
			"advance": 1482,
			"bearingX": 68,
			"bearingY": 1521
		},
		"89": {
			"width": 1196,
			"height": 1591,
			"advance": 1301,
			"bearingX": 29,
			"bearingY": 1521
		},
		"90": {
			"width": 1314,
			"height": 1560,
			"advance": 1420,
			"bearingX": 68,
			"bearingY": 1509
		},
		"91": {
			"width": 526,
			"height": 1937,
			"advance": 771,
			"bearingX": 176,
			"bearingY": 1520
		},
		"92": {
			"width": 838,
			"height": 1665,
			"advance": 1126,
			"bearingX": 177,
			"bearingY": 1524
		},
		"93": {
			"width": 526,
			"height": 1937,
			"advance": 771,
			"bearingX": 176,
			"bearingY": 1520
		},
		"94": {
			"width": 823,
			"height": 524,
			"advance": 1190,
			"bearingX": 198,
			"bearingY": 1646
		},
		"95": {
			"width": 1358,
			"height": 188,
			"advance": 1284,
			"bearingX": -35,
			"bearingY": -157
		},
		"96": {
			"width": 428,
			"height": 483,
			"advance": 1139,
			"bearingX": 149,
			"bearingY": 1661
		},
		"97": {
			"width": 962,
			"height": 1110,
			"advance": 1048,
			"bearingX": 51,
			"bearingY": 1044
		},
		"98": {
			"width": 966,
			"height": 1617,
			"advance": 1215,
			"bearingX": 153,
			"bearingY": 1575
		},
		"99": {
			"width": 864,
			"height": 1126,
			"advance": 1052,
			"bearingX": 105,
			"bearingY": 1063
		},
		"100": {
			"width": 997,
			"height": 1640,
			"advance": 1203,
			"bearingX": 103,
			"bearingY": 1594
		},
		"101": {
			"width": 996,
			"height": 1091,
			"advance": 1122,
			"bearingX": 87,
			"bearingY": 1045
		},
		"102": {
			"width": 866,
			"height": 1759,
			"advance": 1041,
			"bearingX": 75,
			"bearingY": 1599
		},
		"103": {
			"width": 952,
			"height": 1588,
			"advance": 1087,
			"bearingX": 58,
			"bearingY": 1024
		},
		"104": {
			"width": 933,
			"height": 1664,
			"advance": 1183,
			"bearingX": 145,
			"bearingY": 1602
		},
		"105": {
			"width": 268,
			"height": 1503,
			"advance": 574,
			"bearingX": 179,
			"bearingY": 1498
		},
		"106": {
			"width": 674,
			"height": 2093,
			"advance": 826,
			"bearingX": -18,
			"bearingY": 1496
		},
		"107": {
			"width": 913,
			"height": 1645,
			"advance": 1106,
			"bearingX": 163,
			"bearingY": 1604
		},
		"108": {
			"width": 229,
			"height": 1652,
			"advance": 561,
			"bearingX": 174,
			"bearingY": 1609
		},
		"109": {
			"width": 1391,
			"height": 1234,
			"advance": 1591,
			"bearingX": 121,
			"bearingY": 1110
		},
		"110": {
			"width": 882,
			"height": 1163,
			"advance": 1072,
			"bearingX": 124,
			"bearingY": 1092
		},
		"111": {
			"width": 895,
			"height": 1096,
			"advance": 1077,
			"bearingX": 77,
			"bearingY": 1037
		},
		"112": {
			"width": 889,
			"height": 1680,
			"advance": 1095,
			"bearingX": 119,
			"bearingY": 1099
		},
		"113": {
			"width": 883,
			"height": 1621,
			"advance": 1065,
			"bearingX": 60,
			"bearingY": 1065
		},
		"114": {
			"width": 779,
			"height": 1121,
			"advance": 984,
			"bearingX": 139,
			"bearingY": 1054
		},
		"115": {
			"width": 871,
			"height": 1202,
			"advance": 997,
			"bearingX": 41,
			"bearingY": 1142
		},
		"116": {
			"width": 841,
			"height": 1461,
			"advance": 965,
			"bearingX": 65,
			"bearingY": 1397
		},
		"117": {
			"width": 866,
			"height": 1146,
			"advance": 1065,
			"bearingX": 109,
			"bearingY": 1066
		},
		"118": {
			"width": 908,
			"height": 1096,
			"advance": 996,
			"bearingX": 62,
			"bearingY": 1056
		},
		"119": {
			"width": 1270,
			"height": 1123,
			"advance": 1401,
			"bearingX": 76,
			"bearingY": 1041
		},
		"120": {
			"width": 1090,
			"height": 1149,
			"advance": 1209,
			"bearingX": 61,
			"bearingY": 1105
		},
		"121": {
			"width": 1028,
			"height": 1619,
			"advance": 1066,
			"bearingX": -4,
			"bearingY": 1040
		},
		"122": {
			"width": 918,
			"height": 1133,
			"advance": 1102,
			"bearingX": 122,
			"bearingY": 1056
		},
		"123": {
			"width": 691,
			"height": 2009,
			"advance": 750,
			"bearingX": 6,
			"bearingY": 1625
		},
		"124": {
			"width": 178,
			"height": 2077,
			"advance": 863,
			"bearingX": 353,
			"bearingY": 1715
		},
		"125": {
			"width": 691,
			"height": 2009,
			"advance": 750,
			"bearingX": 6,
			"bearingY": 1625
		},
		"126": {
			"width": 1043,
			"height": 467,
			"advance": 1224,
			"bearingX": 100,
			"bearingY": 934
		}
	}

/***/ }
/******/ ]);