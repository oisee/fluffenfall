var React = require("react");
var ReactRouter = require("react-router");

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
//var hashHistory = ReactRouter.hashHistory;

var History = require("history");
var UseRouterHistory = ReactRouter.useRouterHistory;
var CreateHashHistory = History.createHashHistory;
var appHistory = UseRouterHistory(CreateHashHistory)({ queryKey: false });

var Base = require('./components/Base.jsx');
var Page1 = require('./components/Page1.jsx');
var Page2 = require('./components/Page2.jsx');

var Routes = (
  <Router history={appHistory}>
    <Route path="/" component={Base}>
      <Route path="/page1" component={Page1}></Route>
      <Route path="/page2" component={Page2}></Route>
    </Route>
  </Router>
);

module.exports = Routes;
