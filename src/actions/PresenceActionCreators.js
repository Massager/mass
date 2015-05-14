var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var VoxImplantAPIUtils = require('../utils/VoxImplantAPIUtils'); 

var ActionTypes = ChatConstants.ActionTypes;

module.exports = {
	selfPresenceChange: function(status) {
		VoxImplantAPIUtils.setPresenceStatus(status);
		ChatAppDispatcher.dispatch({
			type: ActionTypes.SELF_PRESENCE_CHANGE,
			status: status
		});
	}
};