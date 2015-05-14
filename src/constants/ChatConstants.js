var keyMirror = require('keymirror');

module.exports = {

	ActionTypes: keyMirror({
		SDK_INITIALIZED: null,
		CONNECTION_ESTABLISHED: null,
		CONNECTION_FAILED: null,
		CONNECTION_CLOSED: null,	
		LOGIN: null,
		AUTH_RESULT: null,	
		ROSTER_RECEIVED: null,
		SELF_PRESENCE_CHANGE: null,
		CHAT_STATE_UPDATE: null,
		CLICK_THREAD: null,
	    CREATE_MESSAGE: null,
	    RECEIVE_RAW_CREATED_MESSAGE: null,
	    RECEIVE_RAW_MESSAGES: null,
	    THREAD_INPUT_UPDATE: null,
	    RECEIVE_MESSAGE: null,
	    MESSAGE_DELIVERED: null,
	    MESSAGE_READ: null,
	    MESSAGE_STORED: null,
	    ENABLE_NOTIFICATIONS: null,
	    SET_CHAT_VISIBLE: null,
	    ROSTER_ITEM_CHANGE: null,
	    DELETE_CONVERSATION: null
	}),

	MessageStatusTypes: keyMirror({
		DELIVERED: null,
	    SENDING: null,
	    READ: null,
	    STORED: null
	}),

	ContextMenuActionTypes: keyMirror({
		DELETE_CONVERSATION: null
	})
	
};