'use strict';

(function () {
  var form = document.querySelector('.ad-form');
  var titleOffer = form.querySelector('#title');
  var typeOffer = form.querySelector('#type');
  var priceOffer = form.querySelector('#price');
  var timeInOffer = form.querySelector('#timein');
  var timeOutOffer = form.querySelector('#timeout');
  var roomsOffer = form.querySelector('#room_number');
  var capacityOffer = form.querySelector('#capacity');
  var submitForm = form.querySelector('.ad-form__submit');
  var formFieldset = form.querySelectorAll('fieldset');
  var adressField = form.querySelector('#address');
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var mainPinStartX = Math.round(mainPin.offsetLeft + mainPin.offsetWidth / 2);
  var mainPinStartY = Math.round(mainPin.offsetTop + mainPin.offsetHeight / 2);

  var MIN_PRICE_BUNGALO = 0;
  var MIN_PRICE_FLAT = 1000;
  var MIN_PRICE_HOUSE = 5000;
  var MIN_PRICE_PALACE = 10000;

  var BORDER_COLOR_ERROR = '#ff6547';
  var BORDER_COLOR_CORRECT = '#d9d9d3';

  // Подстановка координат в поле адрес
  var inputAdress = function (x, y) {
    adressField.value = x + ', ' + y;
  };

  // Блокировка полей формы
  var addBlockForm = function () {
    for (var i = 0; i < formFieldset.length; i++) {
      formFieldset[i].setAttribute('disabled', 'disabled');
    }
    inputAdress(mainPinStartX, mainPinStartY);
  };

  addBlockForm();

  // Разблокировка формы
  var unblockForm = function () {
    for (var i = 0; i < formFieldset.length; i++) {
      formFieldset[i].removeAttribute('disabled');
    }
    form.classList.remove('ad-form--disabled');
  };

  // Изменение минимальной цены и подсказки в поле ввода цены в зависимости от типа жилья
  var typeSelectChangeHendler = function () {
    switch (typeOffer.value) {
      case ('bungalo'):
        priceOffer.min = MIN_PRICE_BUNGALO;
        priceOffer.placeholder = MIN_PRICE_BUNGALO;
        break;
      case ('flat'):
        priceOffer.min = MIN_PRICE_FLAT;
        priceOffer.placeholder = MIN_PRICE_FLAT;
        break;
      case ('house'):
        priceOffer.min = MIN_PRICE_HOUSE;
        priceOffer.placeholder = MIN_PRICE_HOUSE;
        break;
      default:
        priceOffer.min = MIN_PRICE_PALACE;
        priceOffer.placeholder = MIN_PRICE_PALACE;
    }
  };

  typeOffer.addEventListener('change', typeSelectChangeHendler);

  // Синхронизация времени заезда и выезда
  var timeInChangeHendler = function () {
    timeOutOffer.value = timeInOffer.value;
  };

  var timeOutChangeHendler = function () {
    timeInOffer.value = timeOutOffer.value;
  };

  timeInOffer.addEventListener('change', timeInChangeHendler);

  timeOutOffer.addEventListener('change', timeOutChangeHendler);

  // Проверка корректного значения гостей в зависимости от колличества комнат
  var checkCapacityValidate = function () {
    var rooms = roomsOffer.value;
    var capacity = capacityOffer.value;

    if (rooms === '1' && capacity !== '1') {
      capacityOffer.setCustomValidity('1 комната доступна только для одного гостя');
    } else if (rooms === '2' && (capacity === '0' || capacity === '3')) {
      capacityOffer.setCustomValidity('2 комнаты доступна для одного или двух гостей');
    } else if (rooms === '3' && (capacity === '0')) {
      capacityOffer.setCustomValidity('3 комнаты подходят для одного, двух или трех гостей');
    } else if (rooms === '100' && capacity !== '0') {
      capacityOffer.setCustomValidity('100 комнат - не для гостей');
    } else {
      capacityOffer.setCustomValidity('');
    }
  };

  // Проверка значений полей и вывод информации об ошибке
  var checkFields = [titleOffer, priceOffer, capacityOffer];

  var checkRequiredInputs = function (fields) {
    for (var i = 0; i < fields.length; i++) {
      if (fields[i].checkValidity() === false) {
        fields[i].style.borderColor = BORDER_COLOR_ERROR;
      } else {
        fields[i].style.borderColor = BORDER_COLOR_CORRECT;
      }
    }
  };

  var adFormSubmitClickHandler = function () {
    checkCapacityValidate();
    checkRequiredInputs(checkFields);
  };

  submitForm.addEventListener('click', adFormSubmitClickHandler);

  window.form = {
    addBlockForm: addBlockForm,
    unblockForm: unblockForm,
    inputAdress: inputAdress
  }
})();
