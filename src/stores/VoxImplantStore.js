var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var VoxImplant = require('voximplant-websdk');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = ChatConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _data = {
  sdk_initialized: false,
  connected_to_vox: false,
  authorized: false,
  connection_failure_reason: '',
  currentStatus: VoxImplant.UserStatuses.Offline,
  username: null,
  displayName: null,
  reconnect: false
};

var VoxImplantStore = assign({}, EventEmitter.prototype, {

	getData: function() {
		return _data;
	},

	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	/**
	* @param {function} callback
	*/
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback); 
	},

	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback); 
	},

	getUserName: function() {
		return _data.username;
	},

	getDisplayName: function() {
		return _data.displayName;
	}

});

VoxImplantStore.dispatchToken = ChatAppDispatcher.register(function(action) {
	switch(action.type) {

		case ActionTypes.SDK_INITIALIZED:
			_data.sdk_initialized = true;
			VoxImplantStore.emitChange();
			break;

		case ActionTypes.CONNECTION_ESTABLISHED:
			_data.connected_to_vox = true;
			VoxImplantStore.emitChange();
			break;

		case ActionTypes.CONNECTION_FAILED:
			_data.connection_failure_reason = "Connection can't be established";
			VoxImplantStore.emitChange();
			break; 

		case ActionTypes.LOGIN:
			_data.username = action.username;
			VoxImplantStore.emitChange();
			break;

		case ActionTypes.CONNECTION_CLOSED:
			_data.connected_to_vox = false;
			_data.authorized = false;
			_data.username = null;
			_data.displayName = null;
			_data.currentStatus = VoxImplant.UserStatuses.Offline;
			_data.reconnect = true;
			VoxImplantStore.emitChange();
			break;

		case ActionTypes.AUTH_RESULT:
			if (action.data.result === true) {
				_data.authorized = true;
				_data.currentStatus = VoxImplant.UserStatuses.Online;
				_data.displayName = action.data.displayName;				
			} else {
				_data.auth_code = action.data.code;				
			}
			VoxImplantStore.emitChange();
			break;

		case ActionTypes.ROSTER_RECEIVED:
			_data.roster = action.data;
			VoxImplantStore.emitChange();
			break;

		case ActionTypes.SELF_PRESENCE_CHANGE:
			_data.currentStatus = action.status;
			VoxImplantStore.emitChange();
			break;

		default:
		  // do nothing
	}

});

module.exports = VoxImplantStore;