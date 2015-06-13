let Variable = require('./variable');
let Expression = require('./expression');

class Constraint {
    constructor(left, comp, right) {
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

        left.terms.forEach(t => this.expr.add(t.coeff, t.variable));
        right.terms.forEach(t => this.expr.add(-t.coeff, t.variable));

        this.expr.collectLikeTerms();
        this.comp = comp;
    }

    isSatisfied() {
        // this might be too small
        var epsilon = Number.EPSILON;

        switch (this.comp) {
            case "==": return Math.abs(this.expr.value()) < epsilon;
        }

        throw new Error("invalid comparison operator");
    }

    isSatisfiable() {
        if (this.isSatisfied()) {
            return true;
        } else {
            return this.expr.freeVariables().length > 0;
        }
        // if x = 50, y = 20 and both are fixed and the constraint is
        // x == y, well then, we can't satisfy it
    }

    satisfy() {
        if (!this.isSatisfiable()) {
            throw new Error("constraint cannot be satified");
        }

        if (this.comp !== "==") {
            throw new Error("can't process inequalities yet");
        }


        let freeVars = this.expr.freeVariables();
        if (freeVars.length != 1) {
            throw new Error("constraint is satisfiable, " +
                "but this library doesn't know how to do it yet");
        }

        let freeVariable = freeVars[0];
        let remainingTerm = null;
        let result = 0;
        this.expr.terms.forEach(t => {
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

    variables() {
        return this.expr.variables();
    }

    toString() {
        return `${this.expr} == 0`;
    }
}

module.exports = Constraint;
