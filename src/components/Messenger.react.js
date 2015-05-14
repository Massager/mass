var React = require('react');
var Roster = require('./Roster.react.js');
var Chat = require('./Chat.react.js');
var NotificationActionCreators = require('../actions/NotificationActionCreators');

var Messenger = React.createClass({

	componentDidMount: function() { 
		var permissionLevel = notify.permissionLevel(),
			permissionsGranted = (permissionLevel === notify.PERMISSION_GRANTED);

		if (permissionLevel === notify.PERMISSION_DEFAULT) {            
            notify.requestPermission(function() {
                permissionLevel = notify.permissionLevel();
                permissionsGranted = (permissionLevel === notify.PERMISSION_GRANTED);
                NotificationActionCreators.notificationsEnabled();        
            });
        }
		
	},

	render: function() {
		return <div className="messengerChrome">
					<Roster ref="roster" />
					<Chat ref="chat" />
				</div>;
	}

});

module.exports = Messenger;
