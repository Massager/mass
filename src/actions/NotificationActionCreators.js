var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');

var ActionTypes = ChatConstants.ActionTypes;

module.exports = {
	notificationsEnabled: function(status) {
		ChatAppDispatcher.dispatch({
			type: ActionTypes.ENABLE_NOTIFICATIONS
		});
	}
};