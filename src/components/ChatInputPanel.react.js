var React = require('react');
var ChatMessageActionCreators = require('../actions/ChatMessageActionCreators');
var ChatThreadActionCreators = require('../actions/ChatThreadActionCreators');
var ThreadStore = require('../stores/ThreadStore');
var VoxImplantStore = require('../stores/VoxImplantStore');

var ENTER_KEY_CODE = 13;
var input_ts, 
	typing = false;

function getStateFromStores() {
  return {
    thread: ThreadStore.getCurrent()
  };
}

var ChatInputPanel = React.createClass({

	propTypes: {
    	threadID: React.PropTypes.string.isRequired
  	},	

  	getInitialState: function() {
    	return getStateFromStores();
  	},

  	componentDidMount: function() {
		ThreadStore.addChangeListener(this._onChange);
		React.findDOMNode(this.refs.input).focus();
	},

	componentWillUnmount: function() {
		clearTimeout(input_ts);
		typing = false;
		ThreadStore.removeChangeListener(this._onChange);
	},

	render: function() {
		return <div className="chat-input">
					<textarea
				        className="message-composer"
				        name="message"
				        value={this.state.thread.input}
				        onChange={this._onInputChange}
				        onKeyDown={this._onKeyDown}
				        ref="input" />
				</div>;
	}, 

	_onInputChange: function(event, value) {
		var update;
		clearTimeout(input_ts);		
		if (!typing) {
			typing = true;
			update = true;
		} else update = false;		
		ChatThreadActionCreators.changeThreadInput(event.target.value, this.state.thread.id, update);
		input_ts = setTimeout(this._stopTyping, 3000);
  	},

  	_onChange: function() {  	
		this.setState(getStateFromStores());	
  		React.findDOMNode(this.refs.input).focus();
  	},

  	_onKeyDown: function(event) {  		
	    if (event.keyCode === ENTER_KEY_CODE) {
	    	clearTimeout(input_ts);
  			typing = false;
			event.preventDefault();
			var text = React.findDOMNode(this.refs.input).value.trim(); 
			if (text) {
				ChatMessageActionCreators.createMessage(text, this.props.threadID, VoxImplantStore.getDisplayName(), VoxImplantStore.getUserName());
			}
	    }
  	},

  	_stopTyping: function() {
  		typing = false;
  		ChatThreadActionCreators.inputChangeTimeout(this.state.thread.id);
  	}

});

module.exports = ChatInputPanel;