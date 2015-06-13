let Variable = require('./variable');

class Expression {
    constructor(coeff = 0, variable = null) {
        this.terms = [];
        // TODO: create a Term object
        this.terms.push({ coeff, variable });
    }

    add(coeff, variable) {
        this.terms.push({ coeff, variable });
        return this;
    }

    sub(coeff, variable) {
        this.terms.push({ coeff: -coeff, variable });
        return this;
    }

    value() {
        var sum = 0;
        this.terms.forEach(t => {
            if (t.variable) {
                sum += t.coeff * t.variable.value;
            } else {
                sum += t.coeff;
            }
        });
        return sum;
    }

    freeVariables() {
        return this.terms.filter(t => {
            return t.variable && !t.variable.value
        }).map(t => t.variable);
    }

    variables() {
        return new Set(this.terms.filter(t => t.variable).map(t => t.variable));
    }

    collectLikeTerms() {
        let constant = { coeff: 0, variable: null };
        let terms = new WeakMap();
        let variables = [];

        this.terms.forEach(t => {
            if (t.variable) {
                if (!terms.has(t.variable)) {
                    terms.set(t.variable, { coeff: 0, variable: t.variable });
                    variables.push(t.variable);
                }
                let term = terms.get(t.variable);
                term.coeff += t.coeff;
            } else {
                constant.coeff += t.coeff;
            }
        });

        this.terms = variables.map(v => terms.get(v));
        this.terms.push(constant);
    }

    toString() {
        return this.terms.map(t => `${t.coeff} * ${t.variable}`).join(" + ");
    }
    // TODO: collect_like_terms
}

module.exports = Expression;
