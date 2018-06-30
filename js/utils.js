'use strict';

(function () {
  // Вывод случайного числа от min до max
  var randomInteger = function (min, max) {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
  };

  // Перетасовка массива
  var shuffleArr = function (arr) {
    for (var i = arr.length; i > 0; --i) {
      var j = Math.floor(Math.random() * i);
      var x = arr[--i];
      arr[i] = arr[j];
      arr[j] = x;
    }
    return arr;
  };

  // Создание числового массива от min до max
  var createNumArr = function (min, max) {
    var arr = [];
    for (var i = min; i <= max; i++) {
      arr.push(i);
    }
    return arr;
  };

  // Вызов случайного элемента из массива
  var getRandomIndex = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // Создание массива произвольной длины на базе исходного массива
  var createRandomLengthArr = function (arr) {
    var newArr = [];
    var newArrLength = randomInteger(1, arr.length);
    for (var i = 0; i < newArrLength; i++) {
      newArr[i] = arr[i];
    }
    return newArr;
  };

  window.utils = {
  	randomInteger: randomInteger,
  	shuffleArr: shuffleArr,
  	createNumArr: createNumArr,
  	getRandomIndex: getRandomIndex,
  	createRandomLengthArr: createRandomLengthArr
  };
})();
