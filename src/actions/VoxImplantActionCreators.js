var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');

var ActionTypes = ChatConstants.ActionTypes;

module.exports = {

	receiveAll: function(rawMessages) {
	    ChatAppDispatcher.dispatch({
	      type: ActionTypes.RECEIVE_RAW_MESSAGES,
	      rawMessages: rawMessages
	    });
  	},

	receiveCreatedMessage: function(createdMessage) {
		ChatAppDispatcher.dispatch({
		  type: ActionTypes.RECEIVE_RAW_CREATED_MESSAGE,
		  rawMessage: createdMessage
		});
	},

	messageReceived: function(uri, message, id) {		
		ChatAppDispatcher.dispatch({
			type: ActionTypes.RECEIVE_MESSAGE,
			id: id,
			threadId: uri,
		  	message: message
		});
	},

	messageDelivered: function(uri, message_id) {
		ChatAppDispatcher.dispatch({
			type: ActionTypes.MESSAGE_DELIVERED,
			id: message_id,
			threadId: uri
		});
	},

	messageRead: function(uri, message_id) {
		ChatAppDispatcher.dispatch({
			type: ActionTypes.MESSAGE_READ,
			id: message_id,
			threadId: uri
		});
	},

	messageStored: function(uri, message_id) {
		ChatAppDispatcher.dispatch({
			type: ActionTypes.MESSAGE_STORED,
			id: message_id,
			threadId: uri
		});
	},

	connectionEstablished: function() {
		ChatAppDispatcher.dispatch({
			type: ActionTypes.CONNECTION_ESTABLISHED
		});
	},

	connectionClosed: function() {
		ChatAppDispatcher.dispatch({
			type: ActionTypes.CONNECTION_CLOSED
		});
	},

	sdkReady: function() {
		ChatAppDispatcher.dispatch({
			type: ActionTypes.SDK_INITIALIZED
		});
	},

	login:function(username) {
		ChatAppDispatcher.dispatch({
			type: ActionTypes.LOGIN,
			username: username
		});		
	},

	authResult: function(event) {
		ChatAppDispatcher.dispatch({
			type: ActionTypes.AUTH_RESULT,
			data: event
		});
	},

	rosterRecieved: function(roster) {
		ChatAppDispatcher.dispatch({
			type: ActionTypes.ROSTER_RECEIVED,
			data: roster
		});
	},

	rosterPresenceUpdate: function(id, status) {
		ChatAppDispatcher.dispatch({
			type: ActionTypes.ROSTER_PRESENCE_UPDATE,
			threadId: id,
			status: status 
		});
	},

	rosterItemChange: function(id, type, name) {
		ChatAppDispatcher.dispatch({
			type: ActionTypes.ROSTER_ITEM_CHANGE,
			threadId: id,
			event_type: type,
			name: name
		});
	},

	chatStateUpdate: function(id, state) {
		ChatAppDispatcher.dispatch({
			type: ActionTypes.CHAT_STATE_UPDATE,
			threadId: id,
			state: state
		});
	},

	setChatVisible: function() {
		ChatAppDispatcher.dispatch({
			type: ActionTypes.SET_CHAT_VISIBLE
		});
	}

};