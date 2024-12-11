angular.module('advancedCalculatorApp', [])
  .controller('CalculatorController', function($scope) {
    $scope.display = '';
    $scope.history = [];
    $scope.mode = 'basic';
    $scope.isDarkTheme = false;
    $scope.memory = 0;

    $scope.basicButtons = [
      { label: 'MC', value: 'MC', class: 'memory' }, { label: 'MR', value: 'MR', class: 'memory' }, { label: 'M+', value: 'M+', class: 'memory' }, { label: 'M-', value: 'M-', class: 'memory' },
      { label: '7', value: '7' }, { label: '8', value: '8' }, { label: '9', value: '9' }, { label: '/', value: '/', class: 'operator' },
      { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' }, { label: '*', value: '*', class: 'operator' },
      { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '-', value: '-', class: 'operator' },
      { label: '0', value: '0' }, { label: '.', value: '.' }, { label: '=', value: '=', class: 'equals' }, { label: '+', value: '+', class: 'operator' },
      { label: 'C', value: 'C', class: 'clear' }, { label: '±', value: 'negate', class: 'function' }, { label: '%', value: 'percent', class: 'function' }, { label: '√', value: 'sqrt', class: 'function' }
    ];

    $scope.scientificButtons = [
      { label: 'sin', value: 'sin', class: 'function' }, { label: 'cos', value: 'cos', class: 'function' }, { label: 'tan', value: 'tan', class: 'function' }, { label: 'log', value: 'log', class: 'function' },
      { label: '(', value: '(', class: 'operator' }, { label: ')', value: ')', class: 'operator' }, { label: '^', value: '^', class: 'operator' }, { label: '√', value: 'sqrt', class: 'function' },
      { label: 'π', value: 'pi', class: 'function' }, { label: 'e', value: 'e', class: 'function' }, { label: '!', value: 'factorial', class: 'function' }, { label: 'ln', value: 'ln', class: 'function' },
      { label: 'sin⁻¹', value: 'asin', class: 'function' }, { label: 'cos⁻¹', value: 'acos', class: 'function' }, { label: 'tan⁻¹', value: 'atan', class: 'function' }, { label: '10^x', value: 'pow10', class: 'function' }
    ].concat($scope.basicButtons);

    $scope.currentButtons = $scope.basicButtons;

    $scope.setMode = function(mode) {
      $scope.mode = mode;
      if (mode === 'basic' || mode === 'scientific') {
        $scope.currentButtons = mode === 'basic' ? $scope.basicButtons : $scope.scientificButtons;
      }
      // Reset specific calculator inputs when changing modes
      if (mode === 'matrix') {
        $scope.matrixA = [[0, 0], [0, 0]];
        $scope.matrixB = [[0, 0], [0, 0]];
        $scope.matrixResult = [];
      } else if (mode === 'graphing') {
        $scope.graphEquation = '';
      } else if (mode === 'equation') {
        $scope.equationToSolve = '';
        $scope.equationSolution = '';
      } else if (mode === 'statistics') {
        $scope.dataSet = [];
        $scope.statisticsResult = {};
      } else if (mode === 'factorial') {
        $scope.factorialNumber = 0;
        $scope.factorialResult = '';
      } else if (mode === 'scientific-notation') {
        $scope.scientificNotationInput = '';
        $scope.scientificNotationResult = '';
      }
    };

    $scope.handleInput = function(value) {
      switch(value) {
        case 'C':
          $scope.display = '';
          break;
        case '=':
          $scope.calculate();
          break;
        case 'MC':
          $scope.memory = 0;
          break;
        case 'MR':
          $scope.display = $scope.memory.toString();
          break;
        case 'M+':
          $scope.memory += parseFloat($scope.display) || 0;
          break;
        case 'M-':
          $scope.memory -= parseFloat($scope.display) || 0;
          break;
        case 'negate':
          $scope.display = (-parseFloat($scope.display)).toString();
          break;
        case 'percent':
          $scope.display = (parseFloat($scope.display) / 100).toString();
          break;
        case 'sqrt':
          $scope.display = Math.sqrt(parseFloat($scope.display)).toString();
          break;
        case 'factorial':
          $scope.display = factorial(parseFloat($scope.display)).toString();
          break;
        case 'sin':
        case 'cos':
        case 'tan':
        case 'asin':
        case 'acos':
        case 'atan':
        case 'log':
        case 'ln':
          $scope.display = Math[value](parseFloat($scope.display)).toString();
          break;
        case 'pow10':
          $scope.display = Math.pow(10, parseFloat($scope.display)).toString();
          break;
        case 'pi':
          $scope.display += Math.PI.toString();
          break;
        case 'e':
          $scope.display += Math.E.toString();
          break;
        default:
          $scope.display += value;
      }
    };

    function factorial(n) {
      if (n === 0 || n === 1) return 1;
      return n * factorial(n - 1);
    }

    $scope.calculate = function() {
      try {
        let result = math.evaluate($scope.display);
        $scope.history.unshift($scope.display + ' = ' + result);
        $scope.display = result.toString();
      } catch (error) {
        $scope.display = 'Error';
      }
    };

    $scope.clearHistory = function() {
      $scope.history = [];
    };

    $scope.toggleTheme = function() {
      $scope.isDarkTheme = !$scope.isDarkTheme;
    };

    // Financial calculator functions
    $scope.calculateCompoundInterest = function() {
      let P = parseFloat($scope.principal);
      let r = parseFloat($scope.rate) / 100;
      let t = parseFloat($scope.time);
      let n = parseFloat($scope.compound);
      let amount = P * Math.pow((1 + r/n), n*t);
      let interest = amount - P;
      $scope.financialResult = {
        totalAmount: amount.toFixed(2),
        interestEarned: interest.toFixed(2)
      };
    };

    $scope.calculateLoanPayment = function() {
      let P = parseFloat($scope.loanAmount);
      let r = (parseFloat($scope.loanRate) / 100) / 12;
      let n = parseFloat($scope.loanTerm) * 12;
      let payment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      let totalInterest = (payment * n) - P;
      $scope.financialResult = {
        monthlyPayment: payment.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        totalPayment: (P + totalInterest).toFixed(2)
      };
    };

    // Unit conversion functions
    $scope.conversionType = 'length';
    $scope.fromUnit = 'm';
    $scope.toUnit = 'km';
    $scope.fromValue = 0;
    $scope.conversionResult = '';

    $scope.getUnits = function(type) {
      switch(type) {
        case 'length':
          return ['m', 'km', 'cm', 'mm', 'in', 'ft', 'yd', 'mi'];
        case 'weight':
          return ['g', 'kg', 'mg', 'lb', 'oz'];
        case 'temperature':
          return ['°C', '°F', 'K'];
        case 'volume':
          return ['L', 'mL', 'gal', 'qt', 'pt', 'cup'];
        case 'area':
          return ['m²', 'km²', 'cm²', 'mm²', 'in²', 'ft²', 'yd²', 'acre', 'ha'];
      }
    };

    $scope.convert = function() {
      try {
        let fromValue = parseFloat($scope.fromValue);
        let result;
        if ($scope.conversionType === 'temperature') {
          result = convertTemperature(fromValue, $scope.fromUnit, $scope.toUnit);
        } else {
          result = math.unit(fromValue, $scope.fromUnit).to($scope.toUnit).toNumber();
        }
        $scope.conversionResult = result.toFixed(4) + ' ' + $scope.toUnit;
      } catch (error) {
        $scope.conversionResult = 'Error: Invalid conversion';
      }
    };

    function convertTemperature(value, fromUnit, toUnit) {
      if (fromUnit === toUnit) return value;
      if (fromUnit === '°C' && toUnit === '°F') return (value * 9/5) + 32;
      if (fromUnit === '°F' && toUnit === '°C') return (value - 32) * 5/9;
      if (fromUnit === '°C' && toUnit === 'K') return value + 273.15;
      if (fromUnit === 'K' && toUnit === '°C') return value - 273.15;
      if (fromUnit === '°F' && toUnit === 'K') return (value - 32) * 5/9 + 273.15;
      if (fromUnit === 'K' && toUnit === '°F') return (value - 273.15) * 9/5 + 32;
    }

    // Matrix Calculator
    $scope.matrixA = [[0, 0], [0, 0]];
    $scope.matrixB = [[0, 0], [0, 0]];
    $scope.matrixResult = [];

    $scope.matrixOperation = function(operation) {
      switch(operation) {
        case 'add':
          $scope.matrixResult = math.add($scope.matrixA, $scope.matrixB);
          break;
        case 'subtract':
          $scope.matrixResult = math.subtract($scope.matrixA, $scope.matrixB);
          break;
        case 'multiply':
          $scope.matrixResult = math.multiply($scope.matrixA, $scope.matrixB);
          break;
        case 'inverse':
          try {
            $scope.matrixResult = math.inv($scope.matrixA);
          } catch (e) {
            $scope.matrixResult = "Error: Matrix is not invertible";
          }
          break;
        case 'determinant':
          $scope.matrixResult = math.det($scope.matrixA);
          break;
      }
    };

    // Graphing Calculator
    $scope.graphEquation = '';
    $scope.plotGraph = function() {
      const expr = math.compile($scope.graphEquation);
      const xValues = math.range(-10, 10, 0.1).toArray();
      const yValues = xValues.map(x => expr.evaluate({x: x}));
      
      // Use a graphing library like Chart.js or Plotly.js to render the graph
      // This is a placeholder for the actual graphing implementation
      console.log('Plotting graph for:', $scope.graphEquation);
      console.log('X values:', xValues);
      console.log('Y values:', yValues);
    };

    // Equation Solver
    $scope.equationToSolve = '';
    $scope.solveEquation = function() {
      try {
        const solution = math.solve($scope.equationToSolve, 'x');
        $scope.equationSolution = solution;
      } catch (e) {
        $scope.equationSolution = "Error: Unable to solve equation";
      }
    };

    // Statistics Calculator
    $scope.dataSet = [];
    $scope.calculateStatistics = function() {
      $scope.statisticsResult = {
        mean: math.mean($scope.dataSet),
        median: math.median($scope.dataSet),
        mode: math.mode($scope.dataSet),
        standardDeviation: math.std($scope.dataSet),
        variance: math.variance($scope.dataSet)
      };
    };

    // Factorial Calculator
    $scope.factorialNumber = 0;
    $scope.calculateFactorial = function() {
      try {
        $scope.factorialResult = math.factorial($scope.factorialNumber);
      } catch (e) {
        $scope.factorialResult = "Error: Invalid input for factorial";
      }
    };

    // Scientific Notation Converter
    $scope.scientificNotationInput = '';
    $scope.convertScientificNotation = function() {
      try {
        const number = math.evaluate($scope.scientificNotationInput);
        $scope.scientificNotationResult = {
          decimal: number.toFixed(10),
          scientific: number.toExponential(5)
        };
      } catch (e) {
        $scope.scientificNotationResult = "Error: Invalid input";
      }
    };
  });

