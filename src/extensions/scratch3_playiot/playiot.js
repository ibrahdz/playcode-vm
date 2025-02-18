const Serial = require('../../io/serial.js')

class PlayIoT {
    constructor (runtime, extensionId) {
        this._runtime = runtime
		this._extensionId = extensionId
		this._serial = null
		this._runtime.registerPeripheralExtension(extensionId, this)
		this.reset = this.reset.bind(this)
		this._onConnect = this._onConnect.bind(this)
		this._onMessage = this._onMessage.bind(this)
		this._pollValues = this._pollValues.bind(this)
    this.message = null
    this._messageObj = null
	}
    
    scan () {
        if(this._serial) this._serial.disconnectPeripheral()
        this._serial = new Serial(
            this._runtime, 
            this._extensionId,
            this._onConnect,
            this._onMessage
        )
    }
    
    connect (id) {
        if (this._serial) this._serial.connectPeripheral(id)
    }

	disconnect () {
		if (this._serial) {
			this._serial.disconnectPeripheral()
			// this.reset();
		}
	}

	reset () { }

	isConnected () {
		if(this._serial) {
			return this._serial.connected
		} else return false
	} 
    
    _onConnect () { }
    _pollValues () { }
    
    _onMessage (value) {
        this.message = value
        //Vulnerabilidad complicada
        try {
            this._messageObj = JSON.parse(value)
            this.potentiometer = this._messageObj.potentiometer
            this.buttonA = this._messageObj.button14
            this.buttonB = this._messageObj.button15
            this.joyx = this._messageObj.joyx
            this.joyx = this._messageObj.joyx
        } catch (e) {
            this._messageObj = {
                error: "Error al parsear el mensaje"
            }  
        }
    }
    isBtnPressedA = () => {
        try {
            return this.buttonA === 1;
        } catch (error) {
            console.error("Error checking buttonA:", error);
            return false; // Default fallback value
        }
    };

    isBtnPressedB = () => {
        try {
            return this.buttonB === 1;
        } catch (error) {
            console.error("Error checking buttonB:", error);
            return false; // Default fallback value
        }
    };
}
module.exports = PlayIoT
