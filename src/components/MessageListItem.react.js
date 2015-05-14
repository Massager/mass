var React = require('react');
var ThreadStore = require('../stores/ThreadStore');
var VoxImplantStore = require('../stores/VoxImplantStore');
var ChatMessageActionCreators = require('../actions/ChatMessageActionCreators');
var ChatThreadActionCreators = require('../actions/ChatThreadActionCreators');
var ChatConstants = require('../constants/ChatConstants');
var Emojify = require('emojify.js');

var ReactPropTypes = React.PropTypes;
var MessageStatusTypes = ChatConstants.MessageStatusTypes;

var MessageListItem = React.createClass({

  propTypes: {
    message: ReactPropTypes.object
  },

  componentDidMount: function() {
    var message = this.props.message;
    if (message.threadID == ThreadStore.getCurrentID() 
        && typeof(message.currentStatus) == 'undefined'
        && !Visibility.hidden()) {
      // not my message and threadId 
      ChatMessageActionCreators.markMessageAsRead(message);
    }
    Emojify.run(React.findDOMNode(this.refs['message-'+this.props.key]));
  },

  componentWillUpdate: function() {
    var message = this.props.message;
    if (message.threadID == ThreadStore.getCurrentID() 
        && typeof(message.currentStatus) == 'undefined'
        && !Visibility.hidden()) {
      // not my message and threadId 
      ChatMessageActionCreators.markMessageAsRead(message);
    }   
  },

  render: function() {
    var message = this.props.message,
        className="message-list-item";
    if (typeof message.currentStatus != 'undefined') {
      switch(message.currentStatus) {
        case MessageStatusTypes.DELIVERED:
          className += " delivered";
          break;

        case MessageStatusTypes.SENDING:
          className += " sending";
          break;

        case MessageStatusTypes.READ:
          className += " read";
          break;

        case MessageStatusTypes.STORED:
          className += " stored";
          break;

      }
    }
    return (
      <li className={className}>
        <h5 className="message-author-name">{message.authorName}</h5>
        <div className="message-time">
          {message.date.toLocaleTimeString()}
        </div>
        <div className="message-text" ref={'message-'+this.props.key} dangerouslySetInnerHTML={{__html: this.urlify(message.text)}}></div>
      </li>
    );
  },

  urlify: function(text) {
    //var div = document.createElement("div");
    //div.innerHTML = text;
    //text = div.textContent || div.innerText || "";
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    })
  }


});

module.exports = MessageListItem;
