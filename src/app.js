/**
* Entry point
* don't forget to replace appname and accname in name attribute of the App
*/
var React = require('react');
window.React = React; // export for http://fb.me/react-devtools
var VoxImplantAPIUtils = require('./utils/VoxImplantAPIUtils');
var VoxImplantStore = require('./stores/VoxImplantStore');
var LoginForm = require('./components/LoginForm.react');
var Messenger = require('./components/Messenger.react');
var ChatWebAPIUtils = require('./utils/ChatWebAPIUtils');
var VoxImplantActionCreators = require('./actions/VoxImplantActionCreators');

VoxImplantAPIUtils.init();

var App = React.createClass({
	getInitialState: function() {
    	return VoxImplantStore.getData();
  	},

	componentDidMount: function() {
		VoxImplantStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		VoxImplantStore.removeChangeListener(this._onChange); 
	},

	componentWillUpdate: function(nextProps, nextState) {
		if (this.state.username == null && nextState.username != null) {
			ChatWebAPIUtils.getAllMessages(nextState.username);
		}
	},

	render: function() {
		var content;
		if (!this.state.sdk_initialized || (this.state.sdk_initialized && !this.state.connected_to_vox)) {
			content = <div className="pluswrap">
    					<div className="plus">
      					Loading...
    					</div>
  					</div>;
		} else if (!this.state.authorized) {
			content = <LoginForm error={this.state.auth_code} onSubmit={this._onSubmit} ref="loginForm" />;
		} else {			
			content = <Messenger />;
		}
		return <div className="app-container">{content}</div>;
	}, 

	_onSubmit: function(username, password) { 
		if (!this.state.reconnect) VoxImplantActionCreators.login(username+'@'+this.props.name, password);
		VoxImplantAPIUtils.login(username+'@'+this.props.name, password);		
	},

	_onChange: function() {
    	this.setState(VoxImplantStore.getData());
  	}
}); 

React.render(
  <App name="appname.accname.voximplant.com" />,
  document.getElementById('application')
);
