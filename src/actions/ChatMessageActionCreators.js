var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var ChatWebAPIUtils = require('../utils/ChatWebAPIUtils');
var ChatMessageUtils = require('../utils/ChatMessageUtils');
var VoxImplantAPIUtils = require('../utils/VoxImplantAPIUtils');
var VoxImplant = require('voximplant-websdk');

var ActionTypes = ChatConstants.ActionTypes;

module.exports = {

  createMessage: function(text, currentThreadID, authorName, username) {
  	VoxImplantAPIUtils.setChatState(currentThreadID, VoxImplant.ChatStateType.Active);
    ChatAppDispatcher.dispatch({
      type: ActionTypes.CREATE_MESSAGE,
      text: text,
      currentThreadID: currentThreadID
    });
    var message = ChatMessageUtils.getCreatedMessageData(text, currentThreadID, authorName);
    ChatWebAPIUtils.createMessage(message, currentThreadID, username);
  },

  markMessageAsRead: function(message) {
    VoxImplantAPIUtils.setMessageStatus(message.threadID, message.id); 
    setTimeout(function() {
      ChatAppDispatcher.dispatch({
        type: ActionTypes.MESSAGE_READ,
        id: message.id,
        threadID: message.threadID
      });
    }, 0);
  }

};