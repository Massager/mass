module.exports = {

  convertRawMessage: function(rawMessage, currentThreadID, isRead) {
    return {
      id: rawMessage.id,
      threadID: rawMessage.threadID,
      authorName: rawMessage.authorName,
      date: new Date(rawMessage.timestamp),
      text: rawMessage.text,
      isRead: ((rawMessage.threadID === currentThreadID) && !Visibility.hidden()) || isRead === true
    };
  },

  getCreatedMessageData: function(text, currentThreadID, authorName) {
    var timestamp = Date.now();
    return {
      id: 'm_' + timestamp,
      threadID: currentThreadID,
      authorName: (typeof authorName != 'undefined'?authorName:'Me'), // hard coded for the example
      date: new Date(timestamp),
      text: text,
      isRead: true
    };
  }

};
