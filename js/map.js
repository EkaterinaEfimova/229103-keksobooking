'use strict';

(function () {
  // Переменные для поиска элементов в разметке и создание массивов
  var pinsLocationElement = document.querySelector('.map__pins');
  var map = document.querySelector('.map');
  
  var cadrTemplateElement = document.querySelector('template').content.querySelector('.map__card');
  var mapFiltersContainerElement = map.querySelector('.map__filters-container');
  var featuresListElement = cadrTemplateElement.querySelector('.popup__features');
  var photosListElement = cadrTemplateElement.querySelector('.popup__photos');
  var typeElement = cadrTemplateElement.querySelector('.popup__type');


  var PHOTO_WIDTH = 45;
  var PHOTO_HEIGHT = 40;

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var offers = [];



  // Удаление потомков
  var deleteChildElement = function (parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    return parent;
  };

  // Вывод типа жилья
  var identifyHousingType = function (ad) {
    switch (ad.offer.type) {
      case 'flat':
        typeElement.textContent = 'Квартира';
        break;
      case 'bungalo':
        typeElement.textContent = 'Бунгало';
        break;
      case 'house':
        typeElement.textContent = 'Дом';
        break;
      default:
        typeElement.textContent = 'Дворец';
    }
  };

  // Заполнение родительского элемента дочерними
  var fillParentElement = function (items, tag, Classname, parentElement) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < items.length; i++) {
      var item = document.createElement(tag);
      item.className = Classname;
      fragment.appendChild(item);
    }
    parentElement.appendChild(fragment);
  };

  // Заполнение списка преимуществ
  var fillFeaturesListElement = function (ad, features) {
    deleteChildElement(featuresListElement);
    fillParentElement(features, 'li', 'popup__feature', featuresListElement);
    for (var i = 0; i < features.length; i++) {
      var newFeaturesClass = 'popup__feature--' + features[i];
      featuresListElement.children[i].classList.add(newFeaturesClass);
    }
  };

  // Заполнение списка фотографий
  var fillPhotosListElement = function (ad, photos) {
    deleteChildElement(photosListElement);
    fillParentElement(photos, 'img', 'popup__photo', photosListElement);
    for (var i = 0; i < photos.length; i++) {
      photosListElement.children[i].src = photos[i];
      photosListElement.children[i].width = PHOTO_WIDTH;
      photosListElement.children[i].height = PHOTO_HEIGHT;
    }
  };

  // Создание DOM-элемента окна с описанием объявления
  var createAdPopupElement = function (ad) {
    var adPopupElement = cadrTemplateElement.cloneNode(true);
    adPopupElement.querySelector('.popup__title').textContent = ad.offer.title;
    adPopupElement.querySelector('.popup__text--address').textContent = ad.offer.address;
    adPopupElement.querySelector('.popup__text--price').textContent = ad.offer.price + ' ₽/ночь';
    adPopupElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    adPopupElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    adPopupElement.querySelector('.popup__description').textContent = ad.offer.description;
    adPopupElement.querySelector('.popup__avatar').src = ad.src;
    return adPopupElement;
  };

  var renderAdPopupElement = function (ad) {
    deleteOldPopup();
    identifyHousingType(ad);
    fillFeaturesListElement(ad, ad.offer.features);
    fillPhotosListElement(ad, ad.offer.photos);
    map.insertBefore(createAdPopupElement(ad), mapFiltersContainerElement);
  };

  // Функция для проверки активности карты
  var checkMapActive = function () {
    return !map.classList.contains('map--faded');
  };

  // Разблокировка карты
  var activeMap = function () {
    map.classList.remove('map--faded');
  };

  var dataSuccessHandler = function (offers) {
    window.render.fillMap(offers);
  };

  // Перевод страницы в активное состояние и добавление похожих объявлений
  var activePage = function () {
    window.form.unblockForm();
    activeMap();
    window.backend.downloadData(dataSuccessHandler, window.backend.errorHandler);
  };


  // Функция для удаления созданной карточки объявления
  var deleteOldPopup = function () {
    var previousCard = map.querySelector('.map__card');

    if (previousCard) {
      map.removeChild(previousCard);
      deleteActiveClass();
    }
  };

  // Открытие попапа
  map.addEventListener('click', function (evt) {

    var target;
    if (evt.target.classList.contains('map__pin')) {
      target = evt.target.querySelector('.popuper');
      deleteActiveClass();
    } else {
      target = evt.target;
    }
    if (target.classList.contains('popuper')) {
      deleteOldPopup();
      renderAdPopupElement(target);
      target.parentNode.classList.add('map__pin--active');
    }
  });

  map.addEventListener('click', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      var target;
      if (evt.target.classList.contains('map__pin')) {
        target = evt.target.querySelector('.popuper');

      } else {
        target = evt.target;
      }
      if (target.classList.contains('popuper')) {
        deleteOldPopup();
        renderAdPopupElement(target);
        target.parentNode.classList.add('map__pin--active');
      }
    }
  });

  // Удаление класса map__pin--active у меток
  var deleteActiveClass = function () {
    var activePin = map.querySelector('.map__pin--active');

    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  // Удаление пинов
  var deletePin = function () {
    var pinsElements = pinsLocationElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pinsElements.length; i++) {
      pinsLocationElement.removeChild(pinsElements[i]);
    }
  };

  // Закрытие попапа
  map.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('popup__close')) {
      deleteOldPopup();
      deleteActiveClass();
    }
  });

  map.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      deleteOldPopup();
      deleteActiveClass();
    }
  });

  window.map = {
    checkMapActive: checkMapActive,
    activePage: activePage,
    deleteOldPopup: deleteOldPopup,
    deletePin: deletePin,
    deleteChildElement: deleteChildElement
  };
})();
