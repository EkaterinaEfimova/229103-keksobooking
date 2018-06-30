'use strict';

(function () {
  var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var СHECKIN = ['12:00', '13:00', '14:00'];
  var CHECKOUT = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var TYPE = ['palace', 'flat', 'house', 'bungalo'];

  var AVATAR_MIN = 1;
  var AVATAR_MAX = 8;
  var START_AVATAR_SRC = 'img/avatars/user';
  var END_AVATAR_SRC = '.png';
  var START_PHOTO_SRC = 'http://o0.github.io/assets/images/tokyo/hotel';
  var END_PHOTO_SRC = '.jpg';
  var MIN_PHOTO = 1;
  var MAX_PHOTO = 3;
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


  var avatarIndexArr = [];
  var offers = [];

  // Создание массива с номерами аватарок
  var createAvatarArr = function () {
    return window.utils.createNumArr(AVATAR_MIN, AVATAR_MAX);
  };

  // Создание массива со случайным порядком аватарок
  var getRandomAvatarArr = function () {
    return createAvatarArr(avatarIndexArr);
  };

  // Создание адреса аватарок
  var createAvatarAdress = function (i) {
    var avatarPhoto = getRandomAvatarArr();
    var avatarNumber = avatarPhoto[i] < 10 ? (START_AVATAR_SRC + '0' + avatarPhoto[i] + END_AVATAR_SRC) : (START_AVATAR_SRC + avatarPhoto[i] + END_AVATAR_SRC);
    return avatarNumber;
  };

  // Создание массива изображений
  var createPhotoArr = function () {
    var offerPhotos = [];
    for (var j = MIN_PHOTO; j <= MAX_PHOTO; j++) {
      offerPhotos.push(START_PHOTO_SRC + j + END_PHOTO_SRC);
    }
    return offerPhotos;
  };

  // Создание массива объявлений
  var createOfferInfo = function () {
    var newOffer = [];
    var offerTitle = window.utils.shuffleArr(TITLE);

    for (var i = 0; i < NUMBER_OFFERS; i++) {
      var locationX = window.utils.randomInteger(LOCATION_X_MIN, LOCATION_X_MAX);
      var locationY = window.utils.randomInteger(LOCATION_Y_MIN, LOCATION_Y_MAX);
      var randomOffer = {
        author: {
          avatar: createAvatarAdress(i)
        },
        offer: {
          title: offerTitle[i],
          address: locationX + ', ' + locationY,
          price: window.utils.randomInteger(PRICE_MIN, PRICE_MAX),
          type: window.utils.getRandomIndex(TYPE),
          rooms: window.utils.randomInteger(ROOM_MIN, ROOM_MAX),
          guests: window.utils.randomInteger(GUESTS_MIN, GUESTS_MAX),
          checkin: window.utils.getRandomIndex(СHECKIN),
          checkout: window.utils.getRandomIndex(CHECKOUT),
          features: window.utils.createRandomLengthArr(FEATURES),
          description: '',
          photos: window.utils.shuffleArr(createPhotoArr())
        },
        location: {
          x: locationX,
          y: locationY
        }
      };
      newOffer.push(randomOffer);
    }
    return newOffer;
  };

  window.createOffer = {
  	createOfferInfo: createOfferInfo
  };
})();
