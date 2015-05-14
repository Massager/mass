var VoxImplantActionCreators = require('../actions/VoxImplantActionCreators');
var VoxImplantAPIUtils = require('./VoxImplantAPIUtils');

module.exports = {

  getAllMessages: function(username) {
    var rawMessages = JSON.parse(localStorage.getItem(username+'_messages'));
    VoxImplantActionCreators.receiveAll(rawMessages);
  },

  createMessage: function(message, threadName, username) {
    var rawMessages = JSON.parse(localStorage.getItem(username+'_messages'));
    var timestamp = Date.now();
    var threadID = message.threadID || ('t_' + Date.now());
    var id = VoxImplantAPIUtils.sendInstantMessage(threadID, message.text);
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(message.text));
    message.text = div.innerHTML;
    var createdMessage = {
      id: id,
      threadID: threadID,
      threadName: threadName,
      authorName: message.authorName,
      text: message.text,
      timestamp: timestamp
    };
    if (rawMessages == null) rawMessages = [];
    rawMessages.push(createdMessage);
    localStorage.setItem(username+'_messages', JSON.stringify(rawMessages));    

    // simulate success callback
    setTimeout(function() {
      VoxImplantActionCreators.receiveCreatedMessage(createdMessage);
    }, 0);
  }

};
