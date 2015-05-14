var React = require('react/addons');
var VoxImplantStore = require('../stores/VoxImplantStore');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var LoginForm = React.createClass({

	getInitialState: function() {
		return { 
			reconnect: VoxImplantStore.getData().reconnect,
			username: '',
			password: '',
			error: false 
		};
	},

	onSubmit: function(event) {
		event.preventDefault();
		this.setState({ 
			reconnect: this.state.reconnect,
			username: this.state.username,
			password: this.state.password,
			error: false 
		});
		if (typeof this.props.onSubmit != 'undefined') {
			var username = React.findDOMNode(this.refs.username).value.trim(),
				password = React.findDOMNode(this.refs.password).value.trim();
			if (this.refs.remember.getDOMNode().checked) {
				this._setCookie('username', username);
				this._setCookie('password', password);
			} else {
				this._deleteCookie('username');
				this._deleteCookie('password');
			}
			this.props.onSubmit(username, password); 
		}		 
	},

	componentWillMount: function() {
		var username = this._getCookie('username'),
			password = this._getCookie('password');
		if (username != '' && password != '') {
			this.setState({
				reconnect: this.state.reconnect,
				username: username,
				password: password,
				error: false
			});
		}
	},

	componentDidMount: function() {		
		if (this.state.reconnect && this.state.username != "" && this.state.password != "") this.props.onSubmit(this.state.username, this.state.password); 
		React.findDOMNode(this.refs.username).focus();
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.error) {
			this._deleteCookie('username');
			this._deleteCookie('password');
			this.setState({ 
				reconnect: this.state.reconnect,
				username: this.state.username,
				password: this.state.password,
				error: true 
			});
		}
	},

	render: function() {		
		var error, rememberChecked = false; 
		if (this.state.username != '' && this.state.password != '') rememberChecked = true; 
		if (this.state.error === true) error = <div className="alert alert-danger" role="alert" ref="loginError" key="loginError">Wrong username or password specified</div>;
		return (
			<div>
				<form className="form-signin" onSubmit={this.onSubmit}>
					<ReactCSSTransitionGroup transitionName="example">
					{error}
					</ReactCSSTransitionGroup>
			        <h2 className="form-signin-heading">Please sign in</h2>
			        <label htmlFor="inputUsername" className="sr-only">Username</label>
			        <input type="username" id="inputUsername" className="form-control" placeholder="Username" ref="username" defaultValue={this.state.username} required autofocus />
			        <label htmlFor="inputPassword" className="sr-only">Password</label>
			        <input type="password" id="inputPassword" className="form-control" placeholder="Password" ref="password" defaultValue={this.state.password} required />
			        <div className="checkbox">
			          <label>
			            <input type="checkbox" value="remember-me" ref="remember" defaultChecked={rememberChecked} /> Remember me
			          </label>
			        </div>
			        <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
			    </form>
			</div>
		);
	},

	_setCookie: function(cname, cvalue, exdays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+d.toGMTString();
	    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
	},

	_getCookie: function(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
	    }
	    return "";
	},

	_deleteCookie: function(cname) {
		document.cookie = cname+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
	}
});

module.exports = LoginForm;