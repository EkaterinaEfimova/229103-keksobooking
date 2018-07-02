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
  var resetButton = form.querySelector('.ad-form__reset');
  var successSendForm = document.querySelector('.success');
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var mainPinStartX = Math.round(mainPin.offsetLeft + mainPin.offsetWidth / 2);
  var mainPinStartY = Math.round(mainPin.offsetTop + mainPin.offsetHeight / 2);
  var mainPinCoordStartX = 537;
  var mainPinCoordStartY = 375;

  var MIN_PRICE_BUNGALO = 0;
  var MIN_PRICE_FLAT = 1000;
  var MIN_PRICE_HOUSE = 5000;
  var MIN_PRICE_PALACE = 10000;

  var BORDER_COLOR_ERROR = '#ff6547';
  var BORDER_COLOR_CORRECT = '#d9d9d3';

  var ESC_KEYCODE = 27;

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
  var typeSelectChangeHandler = function () {
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

  typeOffer.addEventListener('change', typeSelectChangeHandler);

  // Синхронизация времени заезда и выезда
  var timeInChangeHandler = function () {
    timeOutOffer.value = timeInOffer.value;
  };

  var timeOutChangeHandler = function () {
    timeInOffer.value = timeOutOffer.value;
  };

  timeInOffer.addEventListener('change', timeInChangeHandler);

  timeOutOffer.addEventListener('change', timeOutChangeHandler);

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
      fields[i].style.borderColor = !fields[i].checkValidity() ? BORDER_COLOR_ERROR : BORDER_COLOR_CORRECT;
    }
  };

  var formSubmitClickHandler = function () {
    checkCapacityValidate();
    checkRequiredInputs(checkFields);
  };

  submitForm.addEventListener('click', formSubmitClickHandler);

  // Кнопка сброса
  var resetClickHandler = function () {
    form.reset();

    map.classList.add('map--faded');
    form.classList.add('ad-form--disabled');
    window.map.deletePin();
    window.map.deleteOldPopup();
    typeSelectChangeHandler();
    mainPin.style.left = mainPinCoordStartX + 'px';
    mainPin.style.top = mainPinCoordStartY + 'px';

  };

  resetButton.addEventListener('click', resetClickHandler);

  // Отправка формы
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    document.addEventListener('keydown', closeSuccessEsc);
    document.addEventListener('click', closeSuccess);

    window.backend.uploadData(new FormData(form), function () {
      successSendForm.classList.remove('hidden');

      resetClickHandler();

    }, window.backend.errorHandler);

  });

  var closeSuccessEsc = function (evtClose) {
    if (evtClose.keyCode === ESC_KEYCODE) {
      closeSuccess();
    }
  };

  var closeSuccess = function () {
    successSendForm.classList.add('hidden');
    document.removeEventListener('keydown', closeSuccessEsc);
    document.removeEventListener('click', closeSuccess);
  };

  window.form = {
    addBlockForm: addBlockForm,
    unblockForm: unblockForm,
    inputAdress: inputAdress
  };
})();
