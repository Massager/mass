var React = require('react');
var ChatTopPanel = require('./ChatTopPanel.react.js');
var ChatBody = require('./ChatBody.react.js');
var ChatInputPanel = require('./ChatInputPanel.react.js');
var ThreadStore = require('../stores/ThreadStore');

function getStateFromStores() {
  return {
    thread: ThreadStore.getCurrent()
  };
}

var Chat = React.createClass({

	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		ThreadStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		ThreadStore.removeChangeListener(this._onChange);
	},

	render: function() {
		var threadID, chatInput;
		if (typeof this.state.thread != 'undefined') {
			threadID = this.state.thread.id;
			chatInput = <ChatInputPanel threadID={threadID} />;
		}
		return <div className="chat">
					<ChatTopPanel />
					<ChatBody />
					{chatInput}
				</div>;
	},

	_onChange: function() {
    	this.setState(getStateFromStores());
  	}
});

module.exports = Chat;