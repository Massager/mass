var VoxImplant = require('voximplant-websdk');
var VoxImplantActionCreators = require('../actions/VoxImplantActionCreators');
var vox;

module.exports = {
	init: function(config) {
		// Initialize VoxImplant
		vox = VoxImplant.getInstance();		
		vox.addEventListener(VoxImplant.Events.SDKReady, this._onSDKready.bind(this));
		vox.addEventListener(VoxImplant.Events.ConnectionEstablished, this._onConnectionEstablished.bind(this));
		vox.addEventListener(VoxImplant.Events.ConnectionClosed, this._onConnectionClosed.bind(this));
		vox.addEventListener(VoxImplant.Events.ConnectionFailed, this._onConnectionFailed.bind(this));
		vox.addEventListener(VoxImplant.Events.AuthResult, this._onAuthResult.bind(this));
		vox.addEventListener(VoxImplant.IMEvents.RosterReceived, this._onRosterReceived.bind(this));
		vox.addEventListener(VoxImplant.IMEvents.MessageReceived, this._onMessageReceived.bind(this));
		vox.addEventListener(VoxImplant.IMEvents.RosterPresenceUpdate, this._onRosterPresenceUpdate.bind(this));
		vox.addEventListener(VoxImplant.IMEvents.RosterItemChange, this._onRosterItemChange.bind(this));
		vox.addEventListener(VoxImplant.IMEvents.ChatStateUpdate, this._onChatStateUpdate.bind(this));
		vox.addEventListener(VoxImplant.IMEvents.MessageStatus, this._onMessageStatus.bind(this));
		vox.init({
			micRequired: false, 
		}); 

		Visibility.change(function (e, state) {
   			if (state == 'visible') {
   				if (typeof window.worker != 'undefined') {
					window.worker.terminate();
					document.title = "VOX IM";
				}
   				VoxImplantActionCreators.setChatVisible();   				
   			}
		});		
	},

	_log: function(str) {
		console.log(str);
	},

	_onSDKready: function() {
		this._log('VoxImplant Web SDK initialized. Version '+VoxImplant.version);
		VoxImplantActionCreators.sdkReady();
		if (vox.isRTCsupported()) {
			vox.connect();
		} else {
			setTimeout(function() {
				var el = document.getElementById('voximplantcontainer');
				el.style.minWidth = "1px";
				el.style.minHeight = "1px";
				el.style.width = "1px";
				el.style.height = "1px";
			}, 500);
			vox.connect();
		}
	},

	connect: function() {
		vox.connect();
	},

	_onConnectionEstablished: function() {	
		VoxImplantActionCreators.connectionEstablished();
	},

	_onConnectionClosed: function() {
		VoxImplantActionCreators.connectionClosed();
		setTimeout(this.connect, 2000);
	},

	_onConnectionFailed: function() {
		setTimeout(this.connect, 2000);
	},

	login: function(username, password) {			
		vox.login(username, password); 
	},

	_onAuthResult: function(event) {
		VoxImplantActionCreators.authResult(event);
	}, 

	_onRosterReceived: function(event) {
		VoxImplantActionCreators.rosterRecieved(event.roster);
	},

	sendInstantMessage: function(uri, msg) {
		return vox.sendInstantMessage(uri, msg);
	},

	_onMessageReceived: function(event) {
		vox.setMessageStatus(event.id, VoxImplant.MessageEventType.Delivered, event.message_id);
		VoxImplantActionCreators.messageReceived(event.id, event.content, event.message_id);		
	},

	setPresenceStatus: function(status, msg) {
		vox.setPresenceStatus(status, msg);
	},

	_onRosterPresenceUpdate: function(event) {
	 	VoxImplantActionCreators.rosterPresenceUpdate(event.id, event.presence);
	},

	_onRosterItemChange: function(event) {
		VoxImplantActionCreators.rosterItemChange(event.id, event.type, event.displayName);
	},

	setChatState: function(uri, status) {
		vox.setChatState(uri, status);
	},

	_onChatStateUpdate: function(event) {
		VoxImplantActionCreators.chatStateUpdate(event.id, event.state);
	},

	_onMessageStatus: function(event) {
		switch (event.type) {

			case VoxImplant.MessageEventType.Delivered:
				VoxImplantActionCreators.messageDelivered(event.id, event.message_id);
				break;

			case VoxImplant.MessageEventType.Displayed:
				VoxImplantActionCreators.messageRead(event.id, event.message_id);
				break;

			case VoxImplant.MessageEventType.Offline:
				VoxImplantActionCreators.messageStored(event.id, event.message_id)
				break;
		}

	},

	setMessageStatus: function(uri, message_id) {
		vox.setMessageStatus(uri, VoxImplant.MessageEventType.Displayed, message_id);
	}
};