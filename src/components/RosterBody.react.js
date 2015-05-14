var React = require('react');
var ThreadStore = require('../stores/ThreadStore');
var UnreadThreadStore = require('../stores/UnreadThreadStore');
var VoxImplantStore = require('../stores/VoxImplantStore');
var ChatThreadActionCreators = require('../actions/ChatThreadActionCreators');
var VoxImplant = require('voximplant-websdk');

function getStateFromStores() {
  return {
    threads: ThreadStore.getAllChrono(),
    currentThreadID: ThreadStore.getCurrentID(),
    unreadCount: UnreadThreadStore.getCount(),
    rosterReceived: ThreadStore.rosterReceived()
  }; 
}

var RosterItem = React.createClass({

	getInitialState: function() {
    	return getStateFromStores(); 
  	},

	_onClick: function() {
		ChatThreadActionCreators.clickThread(this.props.id);		
	},
 
	render: function() {
		var unreadCount, 
			className = this.props.className,
			userName = this.props.name,
			userId = this.props.id;
		if (this.props.unreadCount > 0) unreadCount = <span className="badge">{this.props.unreadCount}</span>;
		switch (this.props.currentStatus) {
			case VoxImplant.UserStatuses.Offline:
				className += " offline";
				break;

			case VoxImplant.UserStatuses.Online:
				className += " online";
				break;

			case VoxImplant.UserStatuses.DND:
				className += " dnd";
				break;

			case VoxImplant.UserStatuses.Away:
				className += " away";
				break;				
		}		
		userId = userId.substring(0, userId.indexOf('@'));
		if (userId.length > 20) userId = userId.substring(0,17) + '...';
		if (typeof userName != 'undefined') if (userName.length > 20) userName = userName.substring(0,17) + '...';

		return <a href="javascript:void(0);" className={className} key={this.props.id} onClick={this._onClick}>
					<span className="user-icon"><span className="glyphicon glyphicon-user"></span></span> <span className="user-name">{userName}</span> 
					&nbsp;(<span className="user-id">{userId}</span>) {unreadCount}
				</a>;
	}
});
 
var RosterBody = React.createClass({

	getInitialState: function() {
    	return getStateFromStores();
  	},

	componentDidMount: function() {
    	ThreadStore.addChangeListener(this._onChange);
    	UnreadThreadStore.addChangeListener(this._onChange);
  	},

  	componentWillUnmount: function() {
    	ThreadStore.removeChangeListener(this._onChange);
    	UnreadThreadStore.removeChangeListener(this._onChange);
  	},  	  	

  	createRosterItem: function(item) {
  		var className = "roster-item",
  			unreadCount,
  			currentStatus; 
  		if (this.state.currentThreadID == item.id) className += " selected";
  		unreadCount = UnreadThreadStore.getCountByThread(item.id);
  		currentStatus = ThreadStore.getCurrentStatus(item.id);
		return <RosterItem 
					id={item.id} 
					name={item.name} 
					className={className} 
					ref={"rosteritem-"+item.id} 
					key={"key-"+item.id}
					unreadCount={unreadCount}
					currentStatus={currentStatus} />;  
	},

	render: function() {
		var content;
		if (this.state.rosterReceived) content = this.state.threads.map(this.createRosterItem);
		else content = <div className="pluswrap">
    					<div className="plus">
      					Loading...
    					</div>
  					</div>; 
		return <div className="roster-body">
				{content}
				</div>; 
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = RosterBody;