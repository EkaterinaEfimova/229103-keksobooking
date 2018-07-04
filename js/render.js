'use strict';

(function () {
  var pinsLocationElement = document.querySelector('.map__pins');
  var pinTemplateElement = document.querySelector('template').content.querySelector('.map__pin');
  var NUMBER_PIN = 5;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var data;
    // Создание DOM-элемента метки на карте
  var createPinElement = function (pin) {
    var pinElement = pinTemplateElement.cloneNode(true);
    var pinAvatarElement = pinElement.querySelector('img');
    pinElement.style.left = pin.location.x - (PIN_WIDTH / 2) + 'px';
    pinElement.style.top = pin.location.y - PIN_HEIGHT + 'px';
    pinAvatarElement.src = pin.author.avatar;
    pinAvatarElement.alt = pin.offer.title;
    pinAvatarElement.classList.add('popuper');
    pinAvatarElement.offer = pin.offer;

    return pinElement;
  };

  // Заполнение карты DOM-элементами на основе массива объявлений
  var fillMap = function (data) {
    var fragment = document.createDocumentFragment();
    //var maxOffers = data.length > NUMBER_PIN ? NUMBER_PIN : data.length;

    for (var i = 0; i < data.length; i++) {
      fragment.appendChild(createPinElement(data[i]));
    }

    pinsLocationElement.appendChild(fragment);
    
  };

  // Удаление пинов
  var deletePins = function () {
    var buttons = pinsLocationElement.querySelectorAll('button');

    for (var j = 1; j < buttons.length; j++) {
      pinsLocationElement.removeChild(buttons[j]);
    }
  };

  window.render = {
    fillMap: fillMap,
    deletePins: deletePins
  };
})();
