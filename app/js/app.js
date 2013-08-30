angular.module('hd.experiments', ['hd.incomeCalculator', 'hd.intro', 'ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/intro', {templateUrl: 'partials/intro.html', controller: 'IntroController'});
    $routeProvider.when('/income-calculator', {templateUrl: 'partials/income-calculator.html', controller: 'IncomeCalculatorController'});
    $routeProvider.otherwise({redirectTo: '/intro'});
  }]);
