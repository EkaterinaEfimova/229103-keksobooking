'use strict';

(function () {

  var URL_DOWNLOAD_DATA = 'https://js.dump.academy/keksobooking/data';
  var URL_UPLOAD_DATA = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 15000;
  var ESC_KEYCODE = 27;

  var HttpResponseCodes = {
    SUCCESS: 200,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  };

  var createXHR = function (loadHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case HttpResponseCodes.NOT_FOUND:
          errorHandler('Ресурс не найден');
          break;
        case HttpResponseCodes.SUCCESS:
          loadHandler(xhr.response);
          break;
        case HttpResponseCodes.SERVER_ERROR:
          errorHandler('Ошибка сервера');
          break;
        default:
          errorHandler('Неизвестный статус ответа: ' + xhr.status);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler('Ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Время запроса истекло.');
    });

    return xhr;
  };

  var downloadData = function (loadHandler, errorHandler) {
    var xhr = createXHR(loadHandler, errorHandler);
    xhr.open('GET', URL_DOWNLOAD_DATA);
    xhr.send();
  };

  var uploadData = function (data, loadHandler, errorHandler) {
    var xhr = createXHR(loadHandler, errorHandler);
    xhr.open('POST', URL_UPLOAD_DATA);
    xhr.send(data);
  };

  var errorHandler = function (errorMessage) {

    var message = document.createElement('div');
    message.style = 'z-index: 300; margin: 0 auto; background-color: white; color: black';
    message.style.display = 'flex';
    message.style.justifyContent = 'center';
    message.style.alignItems = 'center';
    message.style.position = 'fixed';
    message.style.width = '400px';
    message.style.minHeight = '200px';
    message.style.border = '2px solid black';
    message.style.borderRadius = '10px';
    message.style.left = 'calc(50% - 200px)';
    message.style.top = 'calc(50% - 100px)';
    message.style.fontSize = '20px';

    message.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', message);

    var closeErrorEsc = function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        closeError();
      }
    };

    var closeError = function () {
      document.body.removeChild(message);
      document.removeEventListener('keydown', closeErrorEsc);
      document.removeEventListener('click', closeError);
    };

    document.addEventListener('keydown', closeErrorEsc);
    document.addEventListener('click', closeError);
  };

  window.backend = {
    downloadData: downloadData,
    uploadData: uploadData,
    errorHandler: errorHandler
  };

})();
