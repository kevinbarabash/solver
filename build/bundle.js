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

	var r1 = {
	    x: new Variable(),
	    y: new Variable(),
	    w: new Variable(),
	    h: new Variable()
	};

	var r2 = {
	    x: new Variable(),
	    y: new Variable(),
	    w: new Variable(),
	    h: new Variable()
	};

	// these two expressions don't share any variables
	r1.cx = new Expression(1, r1.x).add(0.5, r1.w);
	r1.cy = new Expression(1, r1.y).add(0.5, r1.h);
	r2.cx = new Expression(1, r2.x).add(0.5, r2.w);
	r2.cy = new Expression(1, r2.y).add(0.5, r2.h);

	var solver = new Solver();
	solver.addConstraint(new Constraint(r1.w, '==', 175));
	solver.addConstraint(new Constraint(r1.h, '==', 125));
	solver.addConstraint(new Constraint(r2.w, '==', 225));
	solver.addConstraint(new Constraint(r2.h, '==', 75));

	var gap = 25;
	r1.bottom = new Expression(1, r1.y).add(1, r1.h).add(gap);

	solver.addConstraint(new Constraint(r2.y, '==', r1.bottom));
	solver.addConstraint(new Constraint(r1.cx, '==', r2.cx));

	var cx_cn = solver.addConstraint(new Constraint(r1.cx, '==', 300));
	var cy_cn = solver.addConstraint(new Constraint(r1.cy, '==', 200));

	solver.solve();

	Object.keys(r1).forEach(function (id) {
	    console.log('' + id + ' = ' + r1[id].value);
	});

	document.body.style.backgroundColor = 'gray';
	document.body.style.margin = 0;

	var canvas = document.createElement('canvas');
	canvas.width = 1000;
	canvas.height = 700;
	canvas.style.backgroundColor = 'white';
	document.body.appendChild(canvas);

	var ctx = canvas.getContext('2d');

	var draw = function draw(x, y) {
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

	var down = false;
	document.addEventListener('mousedown', function (e) {
	    down = true;
	});

	document.addEventListener('mousemove', function (e) {
	    if (down) {
	        ctx.clearRect(0, 0, canvas.width, canvas.height);

	        cx_cn.update(r1.cx, '==', e.pageX);
	        cy_cn.update(r1.cy, '==', e.pageY);

	        solver.solve();

	        draw(e.pageX, e.pageY);
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
	    function Variable() {
	        var value = arguments[0] === undefined ? 0 : arguments[0];

	        _classCallCheck(this, Variable);

	        Object.assign(this, { value: value });
	        this.id = id++;
	    }

	    _createClass(Variable, [{
	        key: "toString",
	        value: function toString() {
	            return "[v" + this.id + ":" + this.value + "]";
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
	    function Expression() {
	        var coeff = arguments[0] === undefined ? 0 : arguments[0];
	        var variable = arguments[1] === undefined ? null : arguments[1];

	        _classCallCheck(this, Expression);

	        this.terms = [];
	        // TODO: create a Term object
	        this.terms.push({ coeff: coeff, variable: variable });
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
	        key: "value",
	        value: function value() {
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
	    }, {
	        key: "freeVariables",
	        value: function freeVariables() {
	            return this.terms.filter(function (t) {
	                return t.variable && !t.variable.value;
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

	            if (left instanceof Variable) {
	                left = new Expression(1, left);
	            } else if (Number.isFinite(left)) {
	                left = new Expression(left);
	            }
	            if (right instanceof Variable) {
	                right = new Expression(1, right);
	            } else if (Number.isFinite(right)) {
	                right = new Expression(right);
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
	                    return Math.abs(this.expr.value()) < epsilon;
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
	                    throw new Error("unable to solve all constraints");
	                }
	                totalSatisfiedCount += satisfiedCount;
	            };

	            while (totalSatisfiedCount < constraintCount) {
	                _loop();
	            }
	        }
	    }]);

	    return Solver;
	})();

	module.exports = Solver;

/***/ }
/******/ ]);