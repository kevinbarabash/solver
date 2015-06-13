var id = 0;

class Variable {
    constructor(value = 0) {
        Object.assign(this, { value });
        this.id = id++;
    }

    toString() {
        return `[v${this.id}:${this.value}]`;
    }

    // TODO: global look up based on id
}

module.exports = Variable;
