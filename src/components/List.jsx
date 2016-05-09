var React = require('react');
var ListItem = require('./ListItem.jsx');

var ingridients = [
    {
        "id": 1,
        "text": "ham"
    }, {
        "id": 2,
        "text": "spam"
    }, {
        "id": 3,
        "text": "ham"
    }
];

var List = React.createClass({
    render: function() {
        var listItems = ingridients.map(function(item) {
            return <ListItem key={item.id} ingridient={item.text}/>;
        });
        return (<ul>{listItems}</ul>);
    }
});

module.exports = List;
