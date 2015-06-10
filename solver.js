var x, y;

// solve with traditional matrix math
// x + y = 2;
// x - y = 1;

// y == x => x - y = 0
// y == x + 5 => x - y + 5 = 0
// y == 2*x + 5 => 2*x - y + 5 = 0

// TODO: collect like terms
var cns = [
    [
        { co: 2, id: 'x' },
        { co: -1, id: 'y' },
        { co: 5 },
        { co: -7 }
    ]
];

var values = {
    x: 5
};

// expressions + equation (constraints)

// cx = x + 0.5 * w;  => x + 0.5 * w - cx = 0;
// cy = y + 0.5 * h;  => y + 0.5 * h - cy = 0;

// we don't have to solve these, we know what the values are
// w = 100;
// h = 25;
// cx = 50;
// cy = 50;

cns = [
    [ { co: 1, id: 'x' }, { co: 0.5, id: 'w' }, { co: -1, id: 'cx' } ],
    [ { co: 1, id: 'y' }, { co: 0.5, id: 'h' }, { co: -1, id: 'cy' } ]
];

values = {
    w: 50,
    h: 25,
    cx: 50,
    cy: 50
};

var isSolvable = function(cn) {
    var unkwowns = 0;
    cn.forEach(function (term) {
        if (term.hasOwnProperty('id')) {
            if (!values.hasOwnProperty(term.id)) {
                unkwowns++;
            }
        }
    });
    return unkwowns <= 1;
};

var findSolvableVariable = function(cn) {
    var result = null;
    cn.forEach(function (term) {
        if (term.hasOwnProperty('id')) {
            if (!values.hasOwnProperty(term.id)) {
                result = term;
            }
        }
    });
    return result;
};

// really we should just be passing in the id
// we can determine if there are any terms with the id
var solveForVariable = function(cn, solnVar) {
    var result = 0;
    // filter + sum
    // TODO: solve inequalities in a similar way, but using range math
    cn.forEach(function (term) {
        if (term.hasOwnProperty('id')) {
            if (values.hasOwnProperty(term.id)) {
                result += term.co * values[term.id];
            }
        } else {
            // constant term
            result += term.co;
        }
    });
    // TODO: verify that solnVar is part of cn
    result = result / -solnVar.co;
    // update values;
    // we should check if the value already exists
    // if it does, and the value is different then error?
    values[solnVar.id] = result;
    return result;
};

// TODO: get a list of unknowns
// TODO: re-run the procedure until the number of unknowns goes to zero on
// is the same number of two consecutive runs
cns.forEach(function (cn) {
    //console.log(cn);
    //console.log("isSolvable?", isSolvable(cn));
    //console.log("var to solve for:", findSolvableVariable(cn));
    var solnVar = findSolvableVariable(cn);
    var soln = solveForVariable(cn, solnVar);
    console.log(solnVar.id + " = " + soln);
});
