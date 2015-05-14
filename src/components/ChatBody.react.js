var React = require('react');
var MessageStore = require('../stores/MessageStore');
var ThreadStore = require('../stores/ThreadStore');
var MessageListItem = require('./MessageListItem.react');
var ChatConstants = require('../constants/ChatConstants');
var ChatThreadActionCreators = require('../actions/ChatThreadActionCreators');
var VoxImplant = require('voximplant-websdk');
var Favico = require('favico.js'); 

var favicon = new Favico({
    animation: 'popFade'
});

var ContextMenuActionTypes = ChatConstants.ContextMenuActionTypes;

function getStateFromStores() {
  return {
    messages: MessageStore.getAllForCurrentThread(),
    thread: ThreadStore.getCurrent(),
    unreadCount: MessageStore.getAllUnreadCount()
  };
}

function getMessageListItem(message) {
  return (
    <MessageListItem
      key={message.id}
      message={message} />
  );
}

var ChatBody = React.createClass({

	getInitialState: function() {
    	return getStateFromStores();
  },

  	componentDidMount: function() {
  		$(this.refs.messageListContainer.getDOMNode()).contextmenu({
		  target:'#context-menu', 
		  onItem: function(context,e) {
		    // execute on menu item selection
		    switch ($(e.target).attr('data-action')) {
		    	case ContextMenuActionTypes.DELETE_CONVERSATION:
		    		ChatThreadActionCreators.deleteConversation(this.state.thread.id);
		    		break;
		    }
		  }.bind(this)
		});
	    this._scrollToBottom();
	    MessageStore.addChangeListener(this._onChange);
	    ThreadStore.addChangeListener(this._onChange);
  	},

	componentWillUnmount: function() {
		MessageStore.removeChangeListener(this._onChange);
		ThreadStore.removeChangeListener(this._onChange);
	},

	componentWillUpdate: function(nextProps, nextState) {
  		if (nextState.unreadCount != this.state.unreadCount) {		
			favicon.badge(nextState.unreadCount);			
		}
		/**
		* Not required probably if we are sure in Visibility API
		*/
		if (nextState.unreadCount == 0) {
			if (typeof window.worker != 'undefined') {
				window.worker.terminate();
				document.title = "VOX IM";
			}
		}
  	},

	render: function() {
		var messageListItems = this.state.messages.map(getMessageListItem);
		var chatState;
		if (typeof this.state.thread != 'undefined') {
			if (this.state.thread.chatState == VoxImplant.ChatStateType.Composing) {
				chatState = (
					<li className="message-list-item">
			        	<h5 className="message-author-name">{this.state.thread.name} is typing...</h5>
			      	</li>
				);
			}
		}
		return <div className="chat-body" ref="messageListContainer" data-toggle="context">
					<ul className="message-list" ref="messageList">
          				{messageListItems}
          				{chatState}
        			</ul>
				</div>;
	},

	componentDidUpdate: function() {
		this._scrollToBottom();
	},

	_scrollToBottom: function() {
		var div = this.refs.messageListContainer.getDOMNode(),
			ul = this.refs.messageList.getDOMNode();
		ul.scrollTop = ul.scrollHeight;
		div.scrollTop = div.scrollHeight;
	},

	/**
	* Event handler for 'change' events coming from the MessageStore
	*/
	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = ChatBody;