var React = require('react');
var ThreadStore = require('../stores/ThreadStore');
var VoxImplant = require('voximplant-websdk');

function getStateFromStores() {
  return {
    thread: ThreadStore.getCurrent()
  };
}

var ChatTopPanel = React.createClass({

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
		var threadName,
			userIcon,
			presence;
		if (typeof this.state.thread != 'undefined') {
			if (typeof this.state.thread.name != 'undefined') {
				threadName = this.state.thread.name;
				if (threadName.length > 20) threadName = threadName.substring(0, 17) + '...';
				userIcon = <span className="user-icon"><span className="glyphicon glyphicon-user"></span></span>;
				var status = ThreadStore.getCurrentStatus(this.state.thread.id);
				switch (status) {
					case VoxImplant.UserStatuses.Offline:
						presence = <span className="label label-default">Offline</span>;
						break;

					case VoxImplant.UserStatuses.Online:
						presence = <span className="label label-success">Online</span>;
						break;

					case VoxImplant.UserStatuses.DND:
						presence = <span className="label label-danger">Don not disturb</span>;
						break;

					case VoxImplant.UserStatuses.Away:
						presence = <span className="label label-warning">Away</span>;
						break;				
				}
			}
		}
		return <div className="chat-top">	
					<div className="name">{userIcon} <h3>{threadName}</h3> {presence}</div>			
				</div>;
	},

	_onChange: function() {
    	this.setState(getStateFromStores());
  	}
});

module.exports = ChatTopPanel;