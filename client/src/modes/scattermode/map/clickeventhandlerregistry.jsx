
class ClickEventHandlerRegistry {
    #handlers = {};

    registerClickEventHandler = (type, handler) => {
        this.#handlers[type] = handler;
    }

    callHandler = (type, ...args) => {
        if (this.#handlers[type]) {
            this.#handlers[type](...args);
        }
    }
}