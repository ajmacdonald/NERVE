class AbstractModel {
    /**
     * Create a new abstract model.  If delegate is provided then all listener
     * adds and notifies are performed on the delegate listener collection.
     * @param {type} delegate
     * @returns {nm$_AbstractModel.AbstractModel}
     */
    constructor(delegate = null) {
        if (delegate === null) {
            this.delegate = this;
            this.abstractModelListeners = [];
        } else {
            this.delegate = delegate.delegate;
        }
    }

    getDelegate(){
        return this.delegate;
    }
    
    addListener(listener) {
        if (typeof listener !== "object"){
            throw new Error("invalid AbstractModel listener type: " + typeof listener);
        }
        this.delegate.abstractModelListeners.push(listener);
    }

    /**
     * Call as notifyListeners(methodName, [methodArgument0, ... methodArgumentN])
     * @param {type} method
     * @returns {undefined}
     */
    async notifyListeners(method) {
        console.log("EVENT " + this.delegate.constructor.name + " " + method);

        Array.prototype.shift.apply(arguments);
        window.lastEvent = {
            method: method,
            args: arguments,
            source: this,
            listeners: []
        };
        AbstractModel.events.push(window.lastEvent);

        for (let listener of this.delegate.abstractModelListeners) {
            if (listener[method]){
                console.log(" + " + listener.constructor.name + " " + method);
                window.lastEvent.listeners.push(listener.constructor.name);       
                await listener[method].apply(listener, arguments);
            }
        }
    }
}

AbstractModel.events = [];
module.exports = AbstractModel;