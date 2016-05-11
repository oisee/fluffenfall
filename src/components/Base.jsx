var React = require("react");

var Base = React.createClass({

  render: function() {
    return (
      <div className="container">
        <ul className="nav nav-tabs nav-justified">
          <li><a href="#/fluffenfall">fluffenfall</a></li>
          <li><a href="#/effectron">effectron</a></li>
          <li><a href="#/about">about</a></li>
          </ul>
        {this.props.children}
      </div>
    )
  }
});

module.exports = Base;
