var React = require('react');
var PresenceActionCreators = require('../actions/PresenceActionCreators');
var VoxImplantStore = require('../stores/VoxImplantStore');
var VoxImplant = require('voximplant-websdk');


function getStateFromStores() {
  return {
    data: VoxImplantStore.getData()
  };
}

var UserPresence = React.createClass({

	componentDidMount: function() {
		_this = this;
		$('.selectpicker').selectpicker();
		$('.selectpicker').on('change', function(){
		    var selected = $(this).find("option:selected").val();
		    if (typeof _this.props.onChange == 'function') {
		    	_this.props.onChange(selected);
		    }
		});
	},

	render: function() {
		var currentStatus = this.props.currentStatus;
		return <select className="selectpicker" value={currentStatus}>
    				<option data-content="<span class='label label-success'>Online</span>" value={VoxImplant.UserStatuses.Online}>Online</option>
    				<option data-content="<span class='label label-warning'>Away</span>" value={VoxImplant.UserStatuses.Away}>Away</option>
   					<option data-content="<span class='label label-danger'>Do not disturb</span>" value={VoxImplant.UserStatuses.DND}>Do not disturb</option>
  				</select>;
	}
});

var RosterTopPanel = React.createClass({

	getInitialState: function() {
    	return getStateFromStores();
  	},

  	componentDidMount: function() {
  		VoxImplantStore.addChangeListener(this._onChange);
  	},

  	componentWillUnmount: function() {
  		VoxImplantStore.removeChangeListener(this._onChange);
  	},

	render: function() {
		var currentStatus = this.state.data.currentStatus,
			username = this.state.data.username,
			displayName = this.state.data.displayName;
		return <div className="roster-top">
		<h3>{displayName}</h3>
		<UserPresence currentStatus={currentStatus} onChange={this._onPresenceChange} />
		</div>;
	},

	_onPresenceChange: function(status) {
		PresenceActionCreators.selfPresenceChange(status);
	},

	_onChange:function() {
		if (!this.isMounted()) {
			return;
		}
		this.setState(getStateFromStores());
	}
});

module.exports = RosterTopPanel;