'use strict';

(function () {

  var MIN_PRICE = 10000;
  var MAX_PRICE = 50000;

  var mapFilters = document.querySelector('.map__filters');
  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRooms = mapFilters.querySelector('#housing-rooms');
  var housingGuests = mapFilters.querySelector('#housing-guests');
  var housingFeatures = mapFilters.querySelectorAll('.map__checkbox');

  var filterType = function (pin) {
    return housingType.value === 'any' || pin.offer.type === housingType.value;
  };

  var filterPrice = function (pin) {

    switch (housingPrice.value) {
      case 'low':
        return pin.offer.price <= MIN_PRICE;
      case 'middle':
        return pin.offer.price >= MIN_PRICE && pin.offer.price <= MAX_PRICE;
      case 'high':
        return pin.offer.price >= MAX_PRICE;
      default:
        return pin;
    }
  };

  var filterRooms = function (pin) {
    return housingRooms.value === 'any' || pin.offer.rooms === parseInt(housingRooms.value, 10);
  };

  var filterGuests = function (pin) {
    return housingGuests.value === 'any' || pin.offer.guests === parseInt(housingGuests.value, 10);
  };

  var filterFeatures = function (pin) {

    for (var i = 0; i < housingFeatures.length; i++) {
      if (housingFeatures[i].checked && pin.offer.features.indexOf(housingFeatures[i].value) < 0) {
        return false;
      }
    }
    return true;
  };

  var data = [];

  var filteredPins = function () {
    var newPins = data.slice();
    var filters = newPins.filter(filterType).filter(filterPrice).filter(filterRooms).filter(filterGuests).filter(filterFeatures);

    window.render.deletePins();
    window.map.deleteOldPopup();
    window.render.fillMap(filters);
  };

  var onFiltersChange = function () {
    window.util.debounce(filteredPins, window.util.DEBOUNCE_INTERVAL);
  };

  mapFilters.addEventListener('change', onFiltersChange);

})();
