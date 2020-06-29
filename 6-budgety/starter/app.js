var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (total) {
        if (total > 0) {
            this.percentage = Math.round(this.value / total * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var total = 0;
        data.allItems[type].forEach(function (cur) {
            total += cur.value;
        });
        data.totals[type] = total;
    };

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: 0,
    };

    return {
        addItem: function (type, description, value) {
            var newItem, ID;
            ID = data.allItems[type].length > 0 ? data.allItems[type][data.allItems[type].length - 1].id + 1 : 0;
            if (type === 'inc') {
                newItem = new Income(ID, description, value);
            } else {
                newItem = new Expense(ID, description, value);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteItem: function (type, ID) {
            var ids, index;
            ids = data.allItems[type].map(function (item) {
                return item.id;
            });
            index = ids.indexOf(ID);
            if (index != -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function () {
            calculateTotal('inc');
            calculateTotal('exp');
            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }
        },
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (item) {
                item.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (item) {
                return item.getPercentage();
            });
            return allPerc;
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                perc: data.percentage,
            }
        },
        testing: function () {
            console.log(data);
        }
    }

})();


var UIController = (function () {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incLabel: '.budget__income--value',
        expLabel: '.budget__expenses--value',
        percLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
    }

    var formatNumber = function (n, type) {
        var num, numSplit, int, dec, sign;
        num = Math.abs(n).toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3)
        }
        dec = numSplit[1];
        sign = type === 'inc' ? '+' : '-';
        return sign + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
            }
        },
        clearInputs: function () {
            var inputs;
            inputs = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            inputs.forEach(function (cur, i, arr) {
                cur.value = '';
            });
            inputs[0].focus();
        },
        addListItem: function (obj, type) {
            var html, newHtml, element;

            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">-1/div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = html
                .replace('%id%', obj.id)
                .replace('%description%', obj.description)
                .replace('%value%', formatNumber(obj.value, type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function (itemID) {
            var item = document.getElementById(itemID);
            item.parentNode.removeChild(item);
        },
        displayBudget: function (b) {
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(b.budget, b.budget >= 0? 'inc': 'exp');
            document.querySelector(DOMStrings.incLabel).textContent = formatNumber(b.totalInc, 'inc');
            document.querySelector(DOMStrings.expLabel).textContent = formatNumber(b.totalExp, 'exp');

            if (b.perc > 0) {
                document.querySelector(DOMStrings.percLabel).textContent = b.perc + '%';
            } else {
                document.querySelector(DOMStrings.percLabel).textContent = '---';
            }
        },
        displayPercentages: function (percentages) {
            var expItems = document.querySelectorAll(DOMStrings.expensesPercLabel);

            nodeListForEach(expItems, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },
        displayMonth: function() {
            var now, months, month, year;
            now = new Date();
            month = now.getMonth()
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        changedType: function() {
            var fields;
            fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );

            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },
        getDOMStrings: function () {
            return DOMStrings;
        }
    }

})();


var app = (function (bc, uic) {

    var setupEvents = function () {
        var DOM = uic.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', addItem);
        document.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || event.which === 13) {
                addItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', deleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', uic.changedType);
    }

    var updateBudget = function () {
        bc.calculateBudget();
        uic.displayBudget(bc.getBudget());
    };

    var updatePercentages = function () {
        bc.calculatePercentages();
        uic.displayPercentages(bc.getPercentages());
    }

    // Add a new item into the budget and the ui
    var addItem = function () {
        var input, newItem;
        input = uic.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            newItem = bc.addItem(input.type, input.description, input.value);
            uic.addListItem(newItem, input.type);
            uic.clearInputs();
            updateBudget();
            updatePercentages();
        }
    };

    var deleteItem = function (e) {
        var itemID, splitID, type, ID;
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            bc.deleteItem(type, ID);
            uic.deleteListItem(itemID);
            updateBudget();
            updatePercentages();
        }
    };

    return {
        init: function () {
            uic.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                perc: 0,
            });
            uic.displayMonth();
            setupEvents();
            console.log('init');
        }
    }

})(budgetController, UIController);

app.init();
