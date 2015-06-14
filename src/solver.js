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

class Solver {
    constructor() {
        this.constraints = [];
    }

    addConstraint(cn) {
        this.constraints.push(cn);
        return cn;
    }

    variables() {
        return this.constraints.reduce((accumulator, cn) =>
            new Set([...accumulator, ...cn.expr.variables()]), new Set());
    }

    solve() {
        // reset all values to undefined
        let vars = this.variables();
        vars.forEach(v => v.value = undefined);

        let totalSatisfiedCount = 0;
        let constraintCount = this.constraints.length;

        while (totalSatisfiedCount < constraintCount) {
            let satisfiedCount = 0;

            // we should really have some arrays that we move contraints
            // between as they become satisfied... in some cases satisfying
            // one constraint will actually satisfy multiple constraints
            this.constraints.forEach(cn => {
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
                if (this.constraints.every(cn => cn.isSatisfied)) {
                    break;
                }
                throw new Error("unable to solve all constraints");
            }
            totalSatisfiedCount += satisfiedCount;
        }
    }
}

module.exports = Solver;
