'use strict';

// Исходные данные и константы
var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var СHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];

var AVATAR_MIN = 1;
var AVATAR_MAX = 8;
var START_AVATAR_SRC = 'img/avatars/user';
var END_AVATAR_SRC = '.png';
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOM_MIN = 1;
var ROOM_MAX = 5;
var GUESTS_MIN = 1;
var GUESTS_MAX = 10;
var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var NUMBER_OFFERS = 8;

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var PHOTO_WIDTH = 45;
var PHOTO_HEIGHT = 40;

var avatarIndexArr = [];
var offers = [];

// Переменные для поиска элементов в разметке и создание массивов
var mapsElement = document.querySelector('.map');
var pinsLocationElement = document.querySelector('.map__pins');
var pinTemplateElement = document.querySelector('template').content.querySelector('.map__pin');
var cadrTemplateElement = document.querySelector('template').content.querySelector('.map__card');
var mapFiltersContainerElement = mapsElement.querySelector('.map__filters-container');
var featuresListElement = cadrTemplateElement.querySelector('.popup__features');
var photosListElement = cadrTemplateElement.querySelector('.popup__photos');
var typeElement = cadrTemplateElement.querySelector('.popup__type');

// Создание активного режима карты
var getActiveStatus = function () {
  mapsElement.classList.remove('map--faded');
};

// Вывод случайного числа от min до max
var randomInteger = function (min, max) {
  var random = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(random);
};

// Перетасовка массива
var getRandomArr = function (arr) {
  for (var i = arr.length; i > 0; --i) {
    var j = Math.floor(Math.random() * i);
    var x = arr[--i];
    arr[i] = arr[j];
    arr[j] = x;
  }
  return arr;
};

// Создание числового массива от min до max
var getNumArr = function (min, max) {
  var arr = [];
  for (var i = min; i <= max; i++) {
    arr.push(i);
  };
  return arr
};

// Вызов случайного элемента из массива
var getRandomIndex = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Создание массива произвольной длины на базе исходного массива
var getRandomLengthArr = function (arr) {
  var newArr = [];
  var newArrLength = randomInteger(1, arr.length);
  for (var i = 0; i < newArrLength; i++) {
    newArr[i] = arr[i];
  }
  return newArr;
};

// Создание массива индексов, перетасованных в случайном порядке
var getRandomIndexArr = function (arr) {
  return getRandomArr(getNumArr(1, arr.length));
};

// Создание массива с номерами аватарок
var getAvatarArr = function () {
  return getNumArr(AVATAR_MIN, AVATAR_MAX);
};

// Создание массива со случайным порядком аватарок
var getRandomAvatarArr = function () {
  return getAvatarArr(avatarIndexArr);
};

// Создание адреса аватарок
var createAvatarAdress = function (i) {
  var avatarPhoto = getRandomAvatarArr();
  var avatarNumber = avatarPhoto[i];
  if (avatarNumber < 10) {
    avatarNumber = '0' + avatarNumber
  }
  return START_AVATAR_SRC + avatarNumber + END_AVATAR_SRC;
};

// Создание массива объявлений
var getOfferInfo = function () {
  var newOffer = [];
  var offerTitle = getRandomArr(TITLE);

  for (var i = 0; i < NUMBER_OFFERS; i++) {
    var locationX = randomInteger(LOCATION_X_MIN, LOCATION_X_MAX);
    var locationY = randomInteger(LOCATION_Y_MIN, LOCATION_Y_MAX);
    var randomOffer = {
      author: {
        avatar: createAvatarAdress(i)
      },
      offer: {
        title: offerTitle[i],
        addres: locationX + ', ' + locationY,
        price: randomInteger(PRICE_MIN, PRICE_MAX),
        type: getRandomIndex(TYPE),
        rooms: randomInteger(ROOM_MIN, ROOM_MAX),
        guests: randomInteger(GUESTS_MIN, GUESTS_MAX),
        checkin: getRandomIndex(СHECKIN),
        checkout: getRandomIndex(CHECKOUT),
        features: getRandomLengthArr(FEATURES),
        description: '',
        photos: getRandomArr(PHOTOS)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
    newOffer.push(randomOffer);
  };
  return newOffer;
};

// Создание DOM-элемента метки на карте
var createPinElement = function (pin) {
  var pinElement = pinTemplateElement.cloneNode(true);
  var pinAvatarElement = pinElement.querySelector('img');
  pinElement.style.left = pin.location.x - (PIN_WIDTH / 2) + 'px';
  pinElement.style.top = pin.location.y - PIN_HEIGHT + 'px';
  pinAvatarElement.src = pin.author.avatar;
  pinAvatarElement.alt = pin.offer.title;
  return pinElement;
}

// Заполнение карты DOM-элементами на основе массива объявлений
var fillMap = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < offers.length; i++) {
    fragment.appendChild(createPinElement(offers[i]));
    pinsLocationElement.appendChild(fragment);
  };
};

// Удаление потомков
var deleteChildElement = function (parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  return parent;
};

// Вывод типа жилья
var identifyHousingType = function (ad) {
  if (ad.offer.type === 'flat') {
    typeElement.textContent = 'Квартира';
  } else if (ad.offer.type === 'bungalo') {
    typeElement.textContent = 'Бунгало';
  } else if (ad.offer.type === 'house') {
    typeElement.textContent = 'Дом';
  } else {
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
  adPopupElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + offers[1].offer.guests + ' гостей';
  adPopupElement.querySelector('.popup__text--time').textContent = 'Заезд после' + ad.offer.checkin + ', выезд до' + ad.offer.checkout;
  adPopupElement.querySelector('.popup__description').textContent = ad.offer.description;
  adPopupElement.querySelector('.popup__avatar').src = ad.author.avatar;
  return adPopupElement;
};

var renderAdPopapElement = function (ad) {
  identifyHousingType(ad);
  fillFeaturesListElement(ad, ad.offer.features);
  fillPhotosListElement(ad, ad.offer.photos);
  mapsElement.insertBefore(createAdPopupElement(ad), mapFiltersContainerElement);
};

// Точка входа в программу
var create = function () {
  getActiveStatus();
  offers = getOfferInfo();
  fillMap();
  renderAdPopapElement(offers[1]);
};

create();
