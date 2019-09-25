function eval() {
    // Do not use eval!!!
    return;
}

const operators = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => { if (y) {
                        return x / y;
                     }
                     throw new Error("TypeError: Devision by zero.");
                   }
};

function operatorPriority (op) {
    switch (op) {
        case "*":
        case "/":
          return 3;
        case "-":
        case "+":
          return 2;
        case "(":
          return 1;
    }

    return 0;
}

function getReversePolishNotation(expr) {
    let tmp = "";
    let tokenArr = [];
    let indexTokenArr = -1;
    let prevTokenNum = false;
    let RPN_arr = [];
    let stack = [];

    // Разбиваем входную строку на массив токенов
    for (let i = 0; i < expr.length; i++) {
        tmp = expr[i];

        if (tmp === " ") {
            continue;
        }

        if ((tmp === "0") || (Number(tmp))) {
            if (prevTokenNum) {
                tokenArr[indexTokenArr] += tmp;
            } else {
                prevTokenNum = true;
                tokenArr[++indexTokenArr] = tmp;
            }
        } else {
            if (prevTokenNum) {
                prevTokenNum = false;
            }
            tokenArr[++indexTokenArr] = tmp;
        }
    }

    // Из массива токенов с инфиксной записью получаем массив токенов в постфиксной записи
    // (т.н. Обратную Польскую Запись)
    for (let token of tokenArr) {

        if (token == ")") {
            let prev_op = stack.pop();

            while ((prev_op) && (prev_op !== "(")) {
                RPN_arr.push(prev_op);

                prev_op = stack.pop();
            }

            if (prev_op !== "(") {
                throw new Error("ExpressionError: Brackets must be paired");
            }

        } else if (token == "(") {
            stack.push(token);

        } else if (token in operators) {
            let op_priority = operatorPriority(token);

            let prev_op = stack.pop();

            while (prev_op) {

                if (operatorPriority(prev_op) >= op_priority) {
                    RPN_arr.push(prev_op);

                } else {
                    stack.push(prev_op);
                    break;
                }

                prev_op = stack.pop();
            }

            stack.push(token);

        } else if ((token === "0") || (Number(token))) {
            RPN_arr.push(token);

        } else {
            throw new Error("Wrong expression!");
        }
    }

    let prev_op = stack.pop();

    while (prev_op) {
        if (prev_op === "(") {
            throw new Error("ExpressionError: Brackets must be paired");
        }
        RPN_arr.push(prev_op);

        prev_op = stack.pop();
    }
 
    return RPN_arr;
}

let evaluate = (PRN_arr) => {
    let stack = [];
    
    for (let token of PRN_arr) {
        if (token in operators) {
            let [y, x] = [stack.pop(), stack.pop()];
            stack.push(operators[token](x, y));
        } else {
            stack.push(parseFloat(token));
        }
    }

    return stack.pop();
};

function expressionCalculator(expr) {
    let PRN_arr = getReversePolishNotation(expr);
    
    return evaluate(PRN_arr);
}

module.exports = {
    expressionCalculator
}