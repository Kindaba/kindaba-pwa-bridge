export const Event_Camera_Roll = 'cameraRoll'
export const Event_Camera = 'camera'
export const Event_RECEIVE_NOTIFICATION = 'pushNotifications'

export default class RnativeWrapper {
    constructor(webview = null) {
        this.events = {}
        this.webview = webview
    }

    static test = function () {
        console.log('test')
    }

    static sendToReactNative = function (event, data = {}) {
        window && window.postMessage({ event, data });
    }

    static listenToReactNative = function (func) {
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

    static unlistenToReactNative = function () {
        if (!window) {
            throw new Error('Window object not found.')
        }
        delete window.receivedMessageFromReactNative
    }

    /* helpers methods */
    static openCameraRoll = function () {
        return RnativeWrapper.sendToRN(Event_Camera_Roll)
    }

    static openCamera = function () {
        return RnativeWrapper.sendToRN(Event_Camera)
    }
    /* helpers methods */

    validateWebView = () => {
        if (!this.webview) {
            throw new Error('Webview should be setup to use React Native Wrapper from RN side.')
        }
    }

    registerEvent = (event, func) => {
        this.validateWebView()

        this.events[event] = func
        return this
    }

    handleMessages = (event) => {
        this.validateWebView()

        const { action } = e.nativeEvent.data
        return this.events[action]()
    }

    sendToWebView = (event, data) => {
        this.validateWebView()
        const message = JSON.stringify({
            event,
            data
        })
        this.webview.evaluateJavaScript(`receivedMessageFromReactNative('${message}')`);
    }
}