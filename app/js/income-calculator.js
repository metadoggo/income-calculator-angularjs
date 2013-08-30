'use strict';

angular.module('hd.incomeCalculator', [])
  .controller('IncomeCalculatorController', ['$scope', function ($scope) {
    $scope.paymentTerms = [
      {
        label: 'Annually'
      },
      {
        label: 'Monthly'
      },
      {
        label: 'Weekly'
      },
      {
        label: 'Daily'
      },
      {
        label: 'Hourly'
      }
    ];
    $scope.infoFormData = {
      paymentTerm: $scope.paymentTerms[0],
      amount: 61000,
      hoursPerDay: 8,
      daysPerWeek: 5,
      daysHoliday: 33,
      repayStudentLoan: true
    }
  }])

  .provider('incomeProvider', [function () {
    'uses strict';

    var DAYS_PER_YEAR = 365;
    var MONTHS_PER_YEAR = 12;
    var WEEKS_PER_YEAR = 52;
    var DAYS_PER_WEEK = 7;

    var STUDENT_LOAN_THRESHOLD = 15000;
    var STUDENT_LOAN_RATE = 0.09;


    this.$get = [function (taxData, grossSalary, repayStudentLoan) {

      function getIncomeTax() {
        var grossIncome = grossSalary;
        var remainingIncome = 0;
        var totalIncomeTax = 0;

        for (var i = 0, j = taxData.incomeTaxBands.length; i < j; i++) {
          var incomeTaxBand = taxData.incomeTaxBands[i];
          if (grossIncome >= incomeTaxBand.limit && incomeTaxBand.limit > 0) {
            totalIncomeTax += (incomeTaxBand.limit - remainingIncome) * incomeTaxBand.rate;
            if (incomeTaxBand.rate == 0) {
              grossIncome -= incomeTaxBand.limit;
            } else {
              remainingIncome = incomeTaxBand.limit - remainingIncome;
              grossIncome -= remainingIncome;
            }
          } else {
            totalIncomeTax += grossIncome * incomeTaxBand.rate;
            grossIncome = 0;
            break;
          }
        }
        return totalIncomeTax;
      }

      function getNationalInsurance() {
        var remainingIncome = grossSalary / WEEKS_PER_YEAR;
        var totalNi = 0;
        var currentNiBand;
        var nextNiBand;
        var i = taxData.niBands.length;
        while (i-- > 1) {
          currentNiBand = taxData.niBands[i];
          nextNiBand = taxData.niBands[i - 1];
          if (remainingIncome > nextNiBand.limit) {
            totalNi += (remainingIncome - nextNiBand.limit) * currentNiBand.rate;
          }
          remainingIncome = Math.min(remainingIncome, nextNiBand.limit);
        }
        return totalNi * WEEKS_PER_YEAR;
      }

      function getStudentLoan() {
        if (repayStudentLoan) {
          var remainingIncome = grossSalary - STUDENT_LOAN_THRESHOLD;
          if (remainingIncome > 0) {
            return (remainingIncome * STUDENT_LOAN_RATE) | 0;
          }
        }
        return 0;
      }

      function getTotalDeductions() {
        return getIncomeTax() + getNationalInsurance() + getStudentLoan();
      }

      function getNetSalary() {
        return grossSalary - getTotalDeductions();
      }
    }];

  }])
;
