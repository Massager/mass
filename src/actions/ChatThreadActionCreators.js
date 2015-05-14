var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var VoxImplantAPIUtils = require('../utils/VoxImplantAPIUtils');
var VoxImplant = require('voximplant-websdk');

var ActionTypes = ChatConstants.ActionTypes;

module.exports = {

  clickThread: function(threadID) {
    ChatAppDispatcher.dispatch({
      type: ActionTypes.CLICK_THREAD,
      threadID: threadID
    });
  },

  changeThreadInput: function(input, threadID, notifyServer) {
    if (notifyServer) VoxImplantAPIUtils.setChatState(threadID, VoxImplant.ChatStateType.Composing);
  	ChatAppDispatcher.dispatch({
  		type: ActionTypes.THREAD_INPUT_UPDATE,
  		threadID: threadID,
  		input: input
  	});
  },

  inputChangeTimeout: function(threadID) {
    VoxImplantAPIUtils.setChatState(threadID, VoxImplant.ChatStateType.Paused);  
  },

  deleteConversation: function(threadID) {
    ChatAppDispatcher.dispatch({
      type: ActionTypes.DELETE_CONVERSATION,
      threadID: threadID,
    });
  }

};