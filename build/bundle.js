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

	'use strict';

	var Variable = __webpack_require__(1);
	var Expression = __webpack_require__(2);
	var Constraint = __webpack_require__(3);
	var Solver = __webpack_require__(4);
	var Rect = __webpack_require__(5);
	var Layout = __webpack_require__(6);

	var layout1 = Layout.createFraction(300, 100, 200, 75);
	var layout2 = Layout.createFraction(150, 50, 225, 40);

	var solver = new Solver();

	var bounds1 = layout1.bounds();
	var bounds2 = layout2.bounds();
	// TODO: provide a getter for the layout's "origin"

	var r1 = new Rect('r1');
	var r2 = new Rect('r2');

	console.log(bounds1);
	console.log(bounds2);

	solver.addConstraint(new Constraint(r1.w, '==', bounds1.right - bounds1.left));
	solver.addConstraint(new Constraint(r1.h, '==', bounds1.bottom - bounds1.top));

	solver.addConstraint(new Constraint(r2.w, '==', bounds2.right - bounds2.left));
	solver.addConstraint(new Constraint(r2.h, '==', bounds2.bottom - bounds2.top));

	// x, y is the "origin" of the layouts
	// TODO: that needs to be made more clear
	var left2 = new Expression(1, r2.x).sub(0.5, r2.w);
	var right1 = new Expression(1, r1.x).add(0.5, r1.w);

	solver.addConstraint(new Constraint(left2, '==', right1));
	solver.addConstraint(new Constraint(left2, '==', 0));

	solver.solve();

	solver.constraints.forEach(function (cn) {
	    console.log(cn.isSatisfied());
	});

	console.log(r1.toString());
	console.log(r2.toString());

	layout1.translation[0] = r1.x.value;
	layout2.translation[0] = r2.x.value;

	document.body.style.backgroundColor = 'gray';
	document.body.style.margin = 0;

	var canvas = document.createElement('canvas');
	canvas.width = 1000;
	canvas.height = 700;
	canvas.style.backgroundColor = 'white';
	document.body.appendChild(canvas);

	var ctx = canvas.getContext('2d');
	ctx.translate(500, 350);

	var draw = function draw(x, y) {
	    ctx.setTransform(1, 0, 0, 1, 0, 0);
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    ctx.translate(500, 350);

	    ctx.strokeStyle = 'black';

	    ctx.beginPath();
	    ctx.moveTo(-250, 0);
	    ctx.lineTo(255, 0);
	    ctx.moveTo(0, -250);
	    ctx.lineTo(0, 250);
	    ctx.stroke();

	    layout1.draw(ctx);
	    layout2.draw(ctx);

	    ctx.beginPath();
	    ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
	    ctx.fillStyle = 'black';
	    ctx.fill();
	};

	draw(0, 0);

	var down = false;
	document.addEventListener('mousedown', function (e) {
	    down = true;
	});

	document.addEventListener('mousemove', function (e) {
	    if (down) {
	        var x = e.pageX - 500;
	        var y = e.pageY - 350;

	        // TODO: create a small example showing updates
	        // don't need to update these constraints
	        // infact for glyph layout1 we'll only have static constraints
	        //cx_cn.update(bar.cx, "==", x);
	        //cy_cn.update(bar.cy, "==", y);
	        //solver1.solve();

	        //layout1.translation = [x, y];

	        draw(x, y);
	    }
	});

	document.addEventListener('mouseup', function (e) {
	    if (down) {
	        down = false;
	    }
	});

/***/ },
/* 1 */
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Variable = __webpack_require__(1);

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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Variable = __webpack_require__(1);
	var Expression = __webpack_require__(2);

	var Constraint = (function () {
	    function Constraint(left, comp, right) {
	        _classCallCheck(this, Constraint);

	        this.update(left, comp, right);
	    }

	    _createClass(Constraint, [{
	        key: 'update',
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
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Variable = __webpack_require__(1);

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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Rect = __webpack_require__(5);
	var Expression = __webpack_require__(2);
	var Solver = __webpack_require__(4);
	var Constraint = __webpack_require__(3);

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

/***/ }
/******/ ]);