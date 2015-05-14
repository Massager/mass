var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var ChatMessageUtils = require('../utils/ChatMessageUtils');
var VoxImplantStore = require('../stores/VoxImplantStore');
var VoxImplant = require('voximplant-websdk');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = ChatConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _currentID = null,
	_threads = {},
	_rosterReceived = false;

function _removeItemById(id) {
	delete _threads[id];
}

function _addItem(id, name) {
	_threads[id] = {
	    id: id,
	    name: name,
	    lastMessage: null,
	    input: '',
	    currentStatus: VoxImplant.UserStatuses.Offline,
	    chatState: VoxImplant.ChatStateType.Inactive
	};
}

var ThreadStore = assign({}, EventEmitter.prototype, {

	init: function(rawMessages) {
		if (rawMessages == null) return;
		if (rawMessages.length == 0) return;
	    rawMessages.forEach(function(message) {
	      var threadID = message.threadID;
	      var thread = _threads[threadID];
	      if (thread && thread.lastTimestamp > message.timestamp) {
	        return;
	      }
	      _threads[threadID] = {
	        id: threadID,
	        name: message.threadName,
	        lastMessage: ChatMessageUtils.convertRawMessage(message, _currentID, true),
	        input: '',
	        currentStatus: VoxImplant.UserStatuses.Offline,
	        chatState: VoxImplant.ChatStateType.Inactive
	      };
	    }, this);

	    if (!_currentID) {
	      var allChrono = this.getAllChrono();
	      _currentID = allChrono[0].id;
	    }

	    _threads[_currentID].lastMessage.isRead = true;
  	},

	getRoster: function() {
		return _roster;
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

	/**
	* @param {string} id
	*/
	get: function(id) {
		return _threads[id];
	},

	getAll: function() {
		return _threads;
	},

	getAllChrono: function() {
		var orderedThreads = [];
		for (var id in _threads) {
		  var thread = _threads[id];
		  orderedThreads.push(thread);
		}
		orderedThreads.sort(function(a, b) {
		  if (a.lastMessage == null) return 1;
		  if (b.lastMessage == null) return -1;

		  if (a.lastMessage.date < b.lastMessage.date) {
		    return 1;
		  } else if (a.lastMessage.date > b.lastMessage.date) {
		    return -1;
		  }
		  return 0;
		});
		return orderedThreads;
	},

	getCurrentID: function() {
		return _currentID;
	},

	getCurrent: function() {
		return this.get(this.getCurrentID()); 
	},

	updateWithRosterData: function(roster) {
		for (var i=0; i < roster.length; i++) {
			if (typeof _threads[roster[i].id] == 'undefined') {
				_threads[roster[i].id] = {
					id: roster[i].id,
					name: roster[i].name,
					lastMessage: null,
					input: "",
					currentStatus: VoxImplant.UserStatuses.Offline,
					chatState: VoxImplant.ChatStateType.Inactive
				};
			} else {
				_threads[roster[i].id].name = roster[i].name;
			}
		}
	},

	getAuthorName: function(id) {
		return _threads[id].name;
	},

	getCurrentStatus: function(id) {
		return _threads[id].currentStatus;	
	},

	rosterReceived: function() {
		return _rosterReceived;
	}

});

ThreadStore.dispatchToken = ChatAppDispatcher.register(function(action) {

	ChatAppDispatcher.waitFor([
    	VoxImplantStore.dispatchToken
  	]);

	switch(action.type) {

		case ActionTypes.CLICK_THREAD:
			_currentID = action.threadID;
			if (_threads[_currentID].lastMessage != null) _threads[_currentID].lastMessage.isRead = true;
			ThreadStore.emitChange();
			break;

		case ActionTypes.SET_CHAT_VISIBLE:
			if (typeof _threads[_currentID] != 'undefined') if (_threads[_currentID].lastMessage != null) {
				_threads[_currentID].lastMessage.isRead = true;
			}
			ThreadStore.emitChange();
			break;

		case ActionTypes.ROSTER_RECEIVED:
			ThreadStore.updateWithRosterData(action.data);
			_rosterReceived = true;
			ThreadStore.emitChange();
			break;

		case ActionTypes.RECEIVE_RAW_MESSAGES:
			ThreadStore.init(action.rawMessages);
			ThreadStore.emitChange();
			break;

		case ActionTypes.THREAD_INPUT_UPDATE:
			_currentID = action.threadID;
			_threads[_currentID].input = action.input;
			ThreadStore.emitChange();
			break;

		case ActionTypes.CREATE_MESSAGE:
			_currentID = action.currentThreadID;
			_threads[_currentID].input = '';
			ThreadStore.emitChange();
			break;

		case ActionTypes.RECEIVE_RAW_CREATED_MESSAGE:
		    var rawMessage = action.rawMessage,
		    	message = {
		    		authorName: VoxImplantStore.getDisplayName(),
		    		id: rawMessage.id,
		    		isRead: false,
		    		text: rawMessage.text,
		    		threadID: rawMessage.threadID,
		    		date: new Date(rawMessage.timestamp)
		    	};
			_threads[message.threadID].lastMessage = message;			
			ThreadStore.emitChange();
			break;

		case ActionTypes.RECEIVE_MESSAGE:
			var message = {
				id: action.id,
				authorName: ThreadStore.getAuthorName(action.threadId),
				text: action.message,
				threadID: action.threadId,
				isRead: false,
				date: new Date(Date.now())
			};
			_threads[message.threadID].lastMessage = message;			
			ThreadStore.emitChange();
			break;

		case ActionTypes.CHAT_STATE_UPDATE:
			_threads[action.threadId].chatState = action.state;
			ThreadStore.emitChange();
			break;

		case ActionTypes.ROSTER_PRESENCE_UPDATE:
			_threads[action.threadId].currentStatus = action.status;
			if (action.status == VoxImplant.UserStatuses.Offline) {
				_threads[action.threadId].chatState = VoxImplant.ChatStateType.Paused;
			}
			ThreadStore.emitChange();
			break;

		case ActionTypes.CONNECTION_CLOSED:
			_threads = {};
			ThreadStore.emitChange();
			break;

		case ActionTypes.ROSTER_ITEM_CHANGE:			
			if (action.event_type == VoxImplant.RosterItemEvent.Removed) _removeItemById(action.threadId);
			else if (action.event_type == VoxImplant.RosterItemEvent.Added) _addItem(action.threadId, action.name);
			ThreadStore.emitChange();
			break;

		default:
		  // do nothing
	}

});

module.exports = ThreadStore;