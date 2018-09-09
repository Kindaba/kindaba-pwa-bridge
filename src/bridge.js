const Event_Camera_Roll = 'cameraRoll'
const Event_Camera = 'camera'
const Event_PUSH_NOTIFICATION = 'pushNotifications'

const validateWebView = (webview) => {
    if (!webview) {
        throw new Error('Webview should be setup to use React Native Wrapper from RN side.')
    }
}

const sendToReactNative = function (event, data = {}) {
    if (!isReactNative()) return;
    window && window.postMessage({ event, data });
}

const listenToReactNative = (func) => {
    if (!isReactNative()) return;

    if (!window) {
        throw new Error('Window object not found.')
    }

    window.receivedMessageFromReactNative = (data) => {
        try {
            const parsedData = JSON.parse(data)

            func(parsedData)
        } catch (err) {
            console.warn(`Data received from React Native is not valid JSON. ${data}`)
            func(data)
        }
    }
}

const unlistenToReactNative = function () {
    if (!isReactNative()) return;

    if (!window) {
        throw new Error('Window object not found.')
    }
    delete window.receivedMessageFromReactNative
}
/* helpers methods */
const openCameraRoll = function () {
    return sendToReactNative(Event_Camera_Roll)
}

const openCamera = function () {
    return sendToReactNative(Event_Camera)
}

const isReactNative = () => {
    const isReactNative = !!(window && window.webkit
        && window.webkit.messageHandlers
        && window.webkit.messageHandlers.reactNative)

    console.warn(isReactNative)
    return isReactNative
}
/* helpers methods */


const handleMessages = (eventMap) => {
    return (e) => {
        const { event } = e.nativeEvent.data
        return eventMap[event]()
    }
}

const sendToWebView = (webview, event, data) => {
    validateWebView(webview)

    const message = JSON.stringify({
        event,
        data
    })
    webview.evaluateJavaScript(`receivedMessageFromReactNative('${message}')`);
}

module.exports = {
    Event_Camera_Roll,
    Event_Camera,
    Event_PUSH_NOTIFICATION,

    /* From PWA to React Native */
    sendToReactNative,
    listenToReactNative,
    unlistenToReactNative,
    openCamera,
    openCameraRoll,
    isReactNative,

    /* From React Native to PWA */
    handleMessages,
    sendToWebView
}