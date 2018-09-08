"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Event_RECEIVE_NOTIFICATION = exports.Event_Camera = exports.Event_Camera_Roll = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Event_Camera_Roll = 'cameraRoll';
exports.Event_Camera_Roll = Event_Camera_Roll;
var Event_Camera = 'camera';
exports.Event_Camera = Event_Camera;
var Event_RECEIVE_NOTIFICATION = 'pushNotifications';
exports.Event_RECEIVE_NOTIFICATION = Event_RECEIVE_NOTIFICATION;

var RnativeWrapper = function RnativeWrapper() {
  var _this = this;

  var webview = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  _classCallCheck(this, RnativeWrapper);

  _defineProperty(this, "validateWebView", function () {
    if (!_this.webview) {
      throw new Error('Webview should be setup to use React Native Wrapper from RN side.');
    }
  });

  _defineProperty(this, "registerEvent", function (event, func) {
    _this.validateWebView();

    _this.events[event] = func;
    return _this;
  });

  _defineProperty(this, "handleMessages", function (event) {
    _this.validateWebView();

    var action = e.nativeEvent.data.action;
    return _this.events[action]();
  });

  _defineProperty(this, "sendToWebView", function (event, data) {
    _this.validateWebView();

    var message = JSON.stringify({
      event: event,
      data: data
    });

    _this.webview.evaluateJavaScript("receivedMessageFromReactNative('".concat(message, "')"));
  });

  this.events = {};
  this.webview = webview;
};

exports.default = RnativeWrapper;

_defineProperty(RnativeWrapper, "test", function () {
  console.log('test');
});

_defineProperty(RnativeWrapper, "sendToReactNative", function (event) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  window && window.postMessage({
    event: event,
    data: data
  });
});

_defineProperty(RnativeWrapper, "listenToReactNative", function (func) {
  if (!window) {
    throw new Error('Window object not found.');
  }

  window.receivedMessageFromReactNative = function (data) {
    try {
      var parsedData = JSON.parse(data);
      func(parsedData);
    } catch (err) {
      console.warn("Data received from React Native is not valid JSON. ".concat(data));
      func(data);
    }
  };
});

_defineProperty(RnativeWrapper, "unlistenToReactNative", function () {
  if (!window) {
    throw new Error('Window object not found.');
  }

  delete window.receivedMessageFromReactNative;
});

_defineProperty(RnativeWrapper, "openCameraRoll", function () {
  return RnativeWrapper.sendToRN(Event_Camera_Roll);
});

_defineProperty(RnativeWrapper, "openCamera", function () {
  return RnativeWrapper.sendToRN(Event_Camera);
});
