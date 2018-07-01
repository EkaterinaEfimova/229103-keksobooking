'use strict';

(function () {
  // Создание перетаскивания главной метки
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var COORD_Y_MIN = 130;
  var COORD_Y_MAX = 630;
  var PIN_ARROW_HEIGTH = 22;

  var coordXMin = 0;
  var coordXMax = map.offsetWidth - mainPin.offsetWidth;
  var coordYMin = COORD_Y_MIN - mainPin.offsetHeight - PIN_ARROW_HEIGTH;
  var coordYMax = COORD_Y_MAX - mainPin.offsetHeight - PIN_ARROW_HEIGTH;

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var coordPinX = mainPin.offsetLeft - shift.x;
      var coordPinY = mainPin.offsetTop - shift.y;

      if (coordPinX > coordXMin && coordPinX < coordXMax) {
        mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      }

      if (coordPinY > coordYMin && coordPinY < coordYMax) {
        mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      }

      var mainPinCoordX = Math.round(coordPinX + mainPin.offsetWidth / 2);
      var mainPinCoordY = Math.round(coordPinY + mainPin.offsetHeight + PIN_ARROW_HEIGTH);

      window.form.inputAdress(mainPinCoordX, mainPinCoordY);
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      if (!window.map.checkMapActive()) {
        window.map.activePage();
      }

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
})();
