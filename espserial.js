
class EspSerial {
	constructor(opts) {
		this.opts = {baudRate: 115200, endLine: "\r\n", charset: "utf8"};
		// apply options
		Object.assign(this.opts, opts);
		this.active = false;
		this.port = null
		this.writer = null;
		this.reader = null;
		this.textDecoder = new TextDecoder(this.opts.charset);
		this.textEncoder = new TextEncoder(this.opts.charset);
		// callbacks
		this.onOpen = null;
		this.onClose = null;
		this.onDisconnect = null;
		this.onError = null;
		this.onRead = null;
		this.onReadText = null;
	}
	
	// event handler for callbacks
	doEvent(name, params){
		if (typeof this[name] === "function")
			this[name](params);
	}
		
	// open serial port method
	async open(opts) {
		// apply options
		Object.assign(this.opts, opts);
		if (navigator.serial) {
			try {
				// request serial port (user must select)
				this.port = await navigator.serial.requestPort();
				// try to open serial port
				await this.port.open(this.opts);
				let _this = this;
				this.port.ondisconnect = (evt) => { _this.doEvent("onDisconnect"); _this.close(); };
				this.active = true;
				// call open callback
				this.doEvent("onOpen");
				// start to recieve data from serial port
				this.closeReadLoop =  this.doRead();
			} catch (error) {
				// error on open serial port
				this.doEvent("onError", error);
			}
		} else {
			this.doEvent("onError", "Web Serial not supported");
		}
	}

	// recieve data from serial method
	async doRead() {
		while (this.port.readable && this.active) {
			this.reader = this.port.readable.getReader();
			try {
				while (true) {
					const {value, done} = await this.reader.read();
					if (done)
						break;
					// reading incoming data
					// call on read callback
					this.doEvent("onRead", value);
					// decode data to text & call on read text callback
					this.doEvent("onReadText", this.textDecoder.decode(value));
				}
			} catch (error) {
				// readable stream error
				this.doEvent("onError", error);
			} finally {
				this.reader.releaseLock();
			}
		}
	}
	
	// write to serial port method
	async write(data) {
		if (this.port.writable && this.active) {
			this.writer = this.port.writable.getWriter();
			await this.writer.write(data);
			this.writer.releaseLock();
		}
	}

	// write to serial port method
	async writeText(text) {
		await this.write(this.textEncoder.encode(text));
	}

	// close serial port method
	async close() {
		if (this.active) {
			this.active = false;
			if (this.port.readable)
				this.reader.cancel();
			try {
				await this.closeReadLoop;			
				await this.port.close();
			} catch (error) {
				this.doEvent("onError", error);
			}
			this.doEvent("onClose");
		}
	}
}
