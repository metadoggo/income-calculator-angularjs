'use strict';

angular.module('hd.incomeCalculator', [])
	.controller('IncomeCalculatorController', ['$scope', '$http', 'incomeCalculatorProvider', function ($scope, $http, incomeCalculatorProvider) {
		$scope.results = [];

		$scope.paymentTerms = ['Annually', 'Monthly', 'Weekly', 'Daily', 'Hourly'];

		$scope.infoFormData = {
			paymentTerm: $scope.paymentTerms[0],
			amount: 32000,
			hoursPerDay: 8,
			daysPerWeek: 5,
			daysHoliday: 33,
			repayStudentLoan: false
		};

		$http.get('data/tax-data.json').success(function (data) {
			var i = data.years.length;
			while (i--) {
				var taxYear = data.years[i];
				if (taxYear.label === data.default.year) {
					$scope.taxYear = taxYear;
					break;
				}
			}
			$scope.taxData = data;
		});

		$scope.removeResultAt = function (index) {
			$scope.results.splice(index, 1);
		}

		$scope.calculateForYear = function (result, taxYear) {
			$scope.taxYear = taxYear;
			result.data = result.service.calculate(taxYear);
		}

		$scope.calculate = function () {
			var workingDaysPerYear = ($scope.infoFormData.daysPerWeek * 52) - $scope.infoFormData.daysHoliday,
				workingHoursPerYear = workingDaysPerYear * $scope.infoFormData.hoursPerDay,
				annualSalary, service;

			switch ($scope.infoFormData.paymentTerm) {
				case $scope.paymentTerms[1]:
					annualSalary = $scope.infoFormData.amount * 12;
					break;
				case $scope.paymentTerms[2]:
					annualSalary = $scope.infoFormData.amount * 52;
					break;
				case $scope.paymentTerms[3]:
					annualSalary = $scope.infoFormData.amount * workingDaysPerYear;
					break;
				case $scope.paymentTerms[4]:
					annualSalary = $scope.infoFormData.amount * workingHoursPerYear;
					break;
				default:
					annualSalary = $scope.infoFormData.amount;
					break;
			}

			service = incomeCalculatorProvider(annualSalary, $scope.infoFormData.repayStudentLoan);

			$scope.results.push({
				paymentTerm: $scope.infoFormData.paymentTerm,
				grossSalary: $scope.infoFormData.amount,
				hoursPerDay: $scope.infoFormData.hoursPerDay,
				daysPerWeek: $scope.infoFormData.daysPerWeek,
				daysHoliday: $scope.infoFormData.daysHoliday,
				repayStudentLoan: $scope.infoFormData.repayStudentLoan,
				annualSalary: annualSalary,
				daysWorked: workingDaysPerYear,
				hoursWorked: workingHoursPerYear,
				service: service,
				data: service.calculate($scope.taxYear)
			});
		};
	}])

	.provider('incomeCalculatorProvider', [function () {
		'uses strict';

		var WEEKS_PER_YEAR = 52;

		var STUDENT_LOAN_THRESHOLD = 15000;
		var STUDENT_LOAN_RATE = 0.09;


		this.$get = [function () {
			return function (grossSalary, repayStudentLoan) {
				var getIncomeTax = function (taxBands) {
						var grossIncome = grossSalary;
						var remainingIncome = 0;
						var totalIncomeTax = 0;

						for (var i = 0, j = taxBands.length; i < j; i++) {
							var incomeTaxBand = taxBands[i];
							if (grossIncome >= incomeTaxBand.limit && incomeTaxBand.limit > 0) {
								totalIncomeTax += (incomeTaxBand.limit - remainingIncome) * incomeTaxBand.rate;
								if (incomeTaxBand.rate === 0) {
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
					},

					getNationalInsurance = function (niBands) {
						var remainingIncome = grossSalary / WEEKS_PER_YEAR;
						var totalNi = 0;
						var currentNiBand;
						var nextNiBand;
						var i = niBands.length;
						while (i-- > 1) {
							currentNiBand = niBands[i];
							nextNiBand = niBands[i - 1];
							if (remainingIncome > nextNiBand.limit) {
								totalNi += (remainingIncome - nextNiBand.limit) * currentNiBand.rate;
							}
							remainingIncome = Math.min(remainingIncome, nextNiBand.limit);
						}
						return totalNi * WEEKS_PER_YEAR;
					},

					getStudentLoan = function () {
						if (repayStudentLoan) {
							var remainingIncome = grossSalary - STUDENT_LOAN_THRESHOLD;
							if (remainingIncome > 0) {
								return (remainingIncome * STUDENT_LOAN_RATE) | 0;
							}
						}
						return 0;
					},

					results = {};

				return {
					calculate: function (taxData) {
						if (results[taxData.label]) {
							return results[taxData.label]
						} else {
							var result = {
								tax: getIncomeTax(taxData.tax),
								ni: getNationalInsurance(taxData.ni)
							}
							result.deductions = result.tax + result.ni;
							if (repayStudentLoan) {
								result.studentLoan = getStudentLoan();
								result.deductions += result.studentLoan;
							}
							result.netIncome = grossSalary - result.deductions;
							results[taxData.label] = result;
							return result;
						}
					}
				}
			}
		}];

	}])
;
