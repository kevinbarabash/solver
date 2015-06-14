var id = 0;

class Variable {
    constructor(name) {
        Object.assign(this, { name });
        this.value = undefined;
        this.id = id++;
    }

    toString() {
        if (this.name) {
            return `[${this.name}:${this.value}]`;
        } else {
            return `[v${this.id}:${this.value}]`;
        }
    }

    // TODO: global look up based on id
}

module.exports = Variable;
