var React = require('react');
var RosterTopPanel = require('./RosterTopPanel.react.js');
var RosterBody = require('./RosterBody.react.js');
var MessageStore = require('../stores/MessageStore');
var ThreadStore = require('../stores/ThreadStore');
var UnreadThreadStore = require('../stores/UnreadThreadStore');

function getStateFromStores() { 
  return {
    threads: ThreadStore.getAllChrono(),
    currentThreadID: ThreadStore.getCurrentID(),
    unreadCount: UnreadThreadStore.getCount()
  };
}

var Roster = React.createClass({

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

	render: function() {
		return <div className="roster">
					<RosterTopPanel />
					<RosterBody ref="roster" />
				</div>; 
	},

	_onChange: function() {
    	this.setState(getStateFromStores());
  	}
});

module.exports = Roster;