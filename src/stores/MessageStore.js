var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var ChatMessageUtils = require('../utils/ChatMessageUtils');
var ThreadStore = require('../stores/ThreadStore');
var VoxImplantStore = require('../stores/VoxImplantStore');
// I know this is ugly for FLUX
var ChatThreadActionCreators = require('../actions/ChatThreadActionCreators');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = ChatConstants.ActionTypes;
var MessageStatusTypes = ChatConstants.MessageStatusTypes;
var CHANGE_EVENT = 'change';

var _messages = {},
	_notifications = false;

function _addMessages(rawMessages) {
  if (rawMessages == null) return;
  rawMessages.forEach(function(message) {
    if (!_messages[message.id]) {
      _messages[message.id] = ChatMessageUtils.convertRawMessage(
        message,
        ThreadStore.getCurrentID(),
        true
      );
      _messages[message.id].currentStatus = MessageStatusTypes.READ;
    }
  });  
}

function _addMessage(threadId, rawMessage, id) {
	var name = ThreadStore.getAuthorName(threadId);
	message = {
		id: id,
		threadID: threadId,
		threadName: name,
		authorName: name,
		timestamp: Date.now(),
		text: rawMessage
	};
	if (!_messages[id]) {
		var username = VoxImplantStore.getUserName();
		var rawMessages = JSON.parse(localStorage.getItem(username+'_messages'));
		if (rawMessages == null) rawMessages = [];
		rawMessages.push(message);
    	localStorage.setItem(username+'_messages', JSON.stringify(rawMessages));    

		_messages[id] = ChatMessageUtils.convertRawMessage(
        	message,
			ThreadStore.getCurrentID()
      );	
	}
}

function _markMessage(threadID, id, status) {
	if (typeof _messages[id] != 'undefined') _messages[id].currentStatus = status;
}

function _markAllInThreadRead(threadID) {
  for (var id in _messages) {
    if (_messages[id].threadID === threadID) {
      _messages[id].isRead = true;
    }
  }
  var rawMessages = JSON.parse(localStorage.getItem('messages'));
  for (var id in rawMessages) {
    if (rawMessages[id].threadID === threadID) {
      rawMessages[id].isRead = true;
    }
  }
  localStorage.setItem('messages', JSON.stringify(rawMessages)); 
}

function _removeAllThreadMessages(threadID) {
	for (var id in _messages) {
    	if (_messages[id].threadID === threadID) delete _messages[id];
  	}
  	var rawMessages = JSON.parse(localStorage.getItem('messages'));

	for (var id in rawMessages) {
		if (rawMessages[id].threadID === threadID) delete rawMessages[id];
	}
	localStorage.setItem('messages', JSON.stringify(rawMessages)); 
}

var rev = "fwd";

window.titlebar = function(val) {
	var msg  = "You have new messages... ",
		res = " ",
		speed = 100,
		pos = val,
		le = msg.length;

    if(rev == "fwd") {
        if(pos < le) {
        	pos = pos+1;
        	scroll = msg.substr(0,pos);
        	document.title = scroll;
        	window.titleTimer = window.setTimeout("titlebar("+pos+")",speed);
        } else {
        	rev = "bwd";
        	window.titleTimer = window.setTimeout("titlebar("+pos+")",speed);
        }
    }
    else{
        if(pos > 0) {
        	pos = pos-1;
        	var ale = le-pos;
        	scrol = msg.substr(ale,le);
        	document.title = scrol;
        	window.titleTimer = window.setTimeout("titlebar("+pos+")",speed);
        } else {
        	rev = "fwd";
        	window.titleTimer = window.setTimeout("titlebar("+pos+")",speed);
        }    
    }
}

var MessageStore = assign({}, EventEmitter.prototype, {

	init: function() {
		var permissionLevel = notify.permissionLevel(),
			permissionsGranted = (permissionLevel === notify.PERMISSION_GRANTED);

		if (permissionLevel === notify.PERMISSION_GRANTED) {
        	_notifications = true;
        }        
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

	get: function(id) {
		return _messages[id];
	},

	getAll: function() {
		return _messages;
	},

	/**
	* @param {string} threadID
	*/
	getAllForThread: function(threadID) {
		var threadMessages = [];
		for (var id in _messages) {
		  if (_messages[id].threadID === threadID) {
		    threadMessages.push(_messages[id]);
		  }
		}
		threadMessages.sort(function(a, b) {
		  if (a.date < b.date) {
		    return -1;
		  } else if (a.date > b.date) {
		    return 1;
		  }
		  return 0;
		});
		return threadMessages;
	},

	getAllForCurrentThread: function() {
		return this.getAllForThread(ThreadStore.getCurrentID());
	},

	getAuthorName: function(id) {
		return this.get(id).authorName;
	},

	notificationsEnabled: function() {
		return _notifications;
	},

	getAllUnreadCount: function() {
		var count = 0;
		for (var id in _messages) {
		  if (!_messages[id].isRead) {
		    count++;
		  }
		}
		return count;	
	}

});

MessageStore.dispatchToken = ChatAppDispatcher.register(function(action) {

	switch(action.type) {

		case ActionTypes.AUTH_RESULT:
			if (action.data.result === true) {
				MessageStore.init();
			}
			MessageStore.emitChange();
			break;
 
		case ActionTypes.CLICK_THREAD:
			ChatAppDispatcher.waitFor([ThreadStore.dispatchToken]);
			_markAllInThreadRead(ThreadStore.getCurrentID());
			MessageStore.emitChange();
			break;

		case ActionTypes.SET_CHAT_VISIBLE:
			_markAllInThreadRead(ThreadStore.getCurrentID());
			MessageStore.emitChange();
			break;


		case ActionTypes.RECEIVE_RAW_CREATED_MESSAGE:			
		    var rawMessage = action.rawMessage,
		    	message = {
		    		authorName: VoxImplantStore.getDisplayName(),
		    		id: rawMessage.id,
		    		isRead: true,
		    		text: rawMessage.text,
		    		threadID: rawMessage.threadID,
		    		date: new Date(rawMessage.timestamp),
		    		currentStatus: MessageStatusTypes.SENDING 
		    	};

			_messages[message.id] = message;
			MessageStore.emitChange();
			break;

		case ActionTypes.MESSAGE_DELIVERED:
			_markMessage(action.threadID, action.id, MessageStatusTypes.DELIVERED);
			MessageStore.emitChange();
			break;

		case ActionTypes.MESSAGE_READ:
			_markMessage(action.threadID, action.id, MessageStatusTypes.READ);
			MessageStore.emitChange();
			break;

		case ActionTypes.MESSAGE_STORED:
			_markMessage(action.threadID, action.id, MessageStatusTypes.STORED);
			MessageStore.emitChange();
			break;

		case ActionTypes.RECEIVE_RAW_MESSAGES:
			_addMessages(action.rawMessages);
			ChatAppDispatcher.waitFor([ThreadStore.dispatchToken]);
			_markAllInThreadRead(ThreadStore.getCurrentID());
			MessageStore.emitChange();
			break;

		case ActionTypes.RECEIVE_MESSAGE:
			_addMessage(action.threadId, action.message, action.id);
			ChatAppDispatcher.waitFor([ThreadStore.dispatchToken]);
			if (Visibility.hidden()) {

				document.getElementById('messageSound').play();
				var notification = notify.createNotification(ThreadStore.getAuthorName(action.threadId), {
		            body: (action.message > 20?(action.message.substring(0, 20) + '...'):action.message),
		            icon: 'images/chat.ico',
		            callback: function() {
		              ChatThreadActionCreators.clickThread(action.threadId); 
		            }
		        });     
		        setTimeout(function() {notification.close();}, 4000);

		        if (typeof window.worker != 'undefined') window.worker.terminate();
	        	window.worker = new Worker('build/TitleWorker.js');
				window.worker.onmessage = function (event) {
					document.title = event.data.str;
				};        

		    }				    
			MessageStore.emitChange();
			break;		

		case ActionTypes.CONNECTION_CLOSED:
			_messages = {};
			ChatAppDispatcher.waitFor([ThreadStore.dispatchToken]);
			MessageStore.emitChange();
			break;

		case ActionTypes.ENABLE_NOTIFICATIONS:
			_notifications = true;
			MessageStore.emitChange();
			break;

		case ActionTypes.DELETE_CONVERSATION:
			_removeAllThreadMessages(action.threadID);
			MessageStore.emitChange();
			break;

		default:
		  // do nothing
	}

});

module.exports = MessageStore;