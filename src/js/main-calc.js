"use strict";
'use strict';

var calc = function () {

	var _init = function _init() {
		var calc = $('.calc');

		calc.each(function () {
			var calcItem = $(this);
			var sumSlider = $(this).find('.sum-slider');
			var sumValue = 5000;
			var termSlider = $(this).find('.term-slider');
			var termValue = 5;
			var sumInput = $(this).find('.sum-value-input');
			var tooltipItem = $(this).find('.calc__tooltip');
			var termInput = $(this).find('.term-value-input');
			var termTypeInput = $(this).find('.termType-value-input');
			var sumInfo = $(this).find('.calc__sumInfo');
			var termPostfix = $(this).find('.calc__termPostfix');
			var resultTerm = $(this).find('.result-term');
			var resultSum = $(this).find('.result-sum');
			var promocodeLink = $(this).find('.calc__promocodeLink');
			var promocodeInput = $(this).find('.calc__promocodeInput');
			var pensionCheckbox = $(this).find('.pension');
			var pensionCheckboxValue = pensionCheckbox.prop('checked');
			var newClientCheckbox = $(this).find('.newClient');
			var newClientValue = newClientCheckbox.prop('checked');
			var maxSum = 70000;
			var sumPostfix = ' ₽';

			changeDate(termValue);

			noUiSlider.create(sumSlider[0], {
				start: sumValue,
				step: 100000,
				range: {
					'min': [1000, 1000],
					'50%': [30000, 1000],
					'max': [maxSum]
				},
				pips: {
					mode: 'values',
					values: [1000, 30000, maxSum],
					density: 10,
					stepped: false,
					format: wNumb({
						decimals: 0,
						thousand: ' '
					})
				},
				tooltips: [true],
				format: wNumb({
					decimals: 0,
					thousand: ' ',
					postfix: ''
				}),
				connect: [true, false]
			});

			sumSlider[0].noUiSlider.on('update', function (values, handle) {
				var sumSliderValueInput = calcItem.find('.sum-value-input');
				var result = +values[handle].replace(/\D+/g, '');
				calcItem.find('.noUi-value-large').first().addClass('first');
				calcItem.find('.noUi-value-large').last().addClass('last');
				sumSliderValueInput.val(values[handle]);
				sumValue = result;

				setTimeout(function () {
					calculate(sumValue, termValue, pensionCheckboxValue, newClientValue);
					autoToggleSum(sumSlider, termSlider);
				}, 100);
			});

			sumInput.on('change', function () {
				var value = $(this).val();
				value = +value.replace(/\D+/g, '');
				sumSlider[0].noUiSlider.set(value);
			});

			termInput.on('change', function () {
				var value = $(this).val();
				value = +value.replace(/\D+/g, '');
				termSlider[0].noUiSlider.set(value);
			});

			noUiSlider.create(termSlider[0], {
				start: termValue,
				step: 1,
				range: {
					'min': [1, 1],
					'50%': [30, 10],
					'51%': [40, 2],
					'max': [48]
				},
				pips: {
					mode: 'values',
					values: [1, 30, 30, 48],
					density: 10,
					stepped: false,
					format: wNumb({
						decimals: 0,
						thousand: ' ',
						postfix: ' недель'
					})
				},
				tooltips: [true],
				format: wNumb({
					decimals: 0,
					thousand: ' '
				}),
				connect: [true, false]
			});

			termSlider[0].noUiSlider.on('update', function (values, handle) {
				var termSliderValueInput = calcItem.find('.term-value-input');
				var result = +values[handle].replace(/\D+/g, '');
				calcItem.find('.term-slider .noUi-pips .noUi-value-large').first().addClass('first').text('1 день');
				calcItem.find('.term-slider .noUi-pips .noUi-value-large').eq(1).text('10 недель');
				calcItem.find('.term-slider .noUi-pips .noUi-value-large').last().addClass('last').text('18 недель');
				termSliderValueInput.val(values[handle]);
				termValue = result;

				if (result > 30) {
					termPostfix.text('недель');
					termSliderValueInput.val(result - 30);
					termTypeInput.val('недель');
				} else {
					termPostfix.text('дней');
					termTypeInput.val('дней');
				}

				termInput.css('padding-right', termPostfix.outerWidth() + 5 + 'px');

				changeDate(termValue);
				setTimeout(function () {
					calculate(sumValue, termValue, pensionCheckboxValue, newClientValue);
					autoToggleTerm(sumSlider, termSlider);
				}, 100);
			});

			$('#modal-calc').on('show.bs.modal', function (e) {
				setTimeout(function () {
					termInput.css('padding-right', termPostfix.outerWidth() + 5 + 'px');
				}, 100);
			});

			$(window).on('load resize', function() {
				termInput.css('padding-right', termPostfix.outerWidth() + 5 + 'px');
			});

			pensionCheckbox.on('change', function () {
				pensionCheckboxValue = $(this).prop('checked');

				setTimeout(function () {
					calculate(sumValue, termValue, pensionCheckboxValue, newClientValue);
					autoToggleTerm(sumSlider, termSlider);
				}, 100);
			});

			newClientCheckbox.on('change', function () {
				newClientValue = $(this).prop('checked');

				setTimeout(function () {
					calculate(sumValue, termValue, pensionCheckboxValue, newClientValue);
					autoToggleTerm(sumSlider, termSlider);
				}, 100);
			});

			function calculate(sumValue, termValue, pensionCheckboxValue, newClientValue) {
				var sum = sumValue;
				var term = termValue;
				var percent = 1;
				var pension = pensionCheckboxValue;
				var newClient = newClientValue;

				if (term > 30) {
					term = (term - 30) * 7;
				}

				if (sum <= 30000) {
					percent = 0.0199;
				}

				if (pension == true) {
					percent = 0.0169;
				}

				if (sum > 30000) {
					percent = 0.0076;
				}

				if (newClient == true) {
					if (sum > 30000) {
						sumInfo.fadeIn();
					} else {
						sumInfo.fadeOut();
					}
				} else {
					sumInfo.fadeOut();
				}

				tooltip();

				var result = sum + sum * percent * term;

				var moneyFormat = wNumb({
					thousand: ' ',
					decimals: 0,
					postfix: sumPostfix
				});

				result = moneyFormat.to(result);
				resultSum.text(result);
			}

			function changeDate(result) {
				if (result > 30) {
					result = (result - 30) * 7;
				}

				moment.locale('ru');
				moment().format('LL');
				var date = moment().add(result, 'd').format('LL');
				resultTerm.html(date);
			}

			function autoToggleSum(sumSlider, termSlider) {
				var sum = +sumSlider[0].noUiSlider.get().replace(/\D+/g, '');
				var term = +termSlider[0].noUiSlider.get().replace(/\D+/g, '');

				if (sum > 30000 && term < 31) {
					termSlider[0].noUiSlider.set(38);
				}
				if (sum < 30000 && term > 30) {
					termSlider[0].noUiSlider.set(30);
				}
			}

			function autoToggleTerm(sumSlider, termSlider) {
				var sum = +sumSlider[0].noUiSlider.get().replace(/\D+/g, '');
				var term = +termSlider[0].noUiSlider.get().replace(/\D+/g, '');

				if (term < 30 && sum > 30000) {
					sumSlider[0].noUiSlider.set(30000);
				}
				if (term > 30 && sum < 31000) {
					sumSlider[0].noUiSlider.set(31000);
				}
			}

			promocodeLink.on('click', function (e) {
				e.preventDefault();
				promocodeInput.fadeToggle().find('input').val('');
			});

			function tooltip() {
				var sum = +sumSlider[0].noUiSlider.get().replace(/\D+/g, '');

				if (sum > 30000) {
					if (!sumInput.hasClass('active')) {
						sumInput.tooltipster({
							maxWidth: 300,
							zIndex: '9999999999',
							onlyOne: true,
							trigger: 'custom',
							interactive: true,
							delay: 0,
							autoClose: false
						}).tooltipster('content', tooltipItem.text()).tooltipster('open').addClass('active');

						$('.tooltipster-content').on('click', function () {
							sumInput.tooltipster('close');
						});
					}
				} else {
					if (sumInput.hasClass('tooltipstered')) {
						sumInput.tooltipster('close').removeClass('active');
					}
				}
			}
		});
	};

	return {
		init: function init() {
			_init();
		}
	};
}();

$(function () {
	calc.init();
});

