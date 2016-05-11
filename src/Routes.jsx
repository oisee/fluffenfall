var React = require("react");
var ReactRouter = require("react-router");

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRedirect = ReactRouter.IndexRedirect;
//var hashHistory = ReactRouter.hashHistory;

var History = require("history");
var UseRouterHistory = ReactRouter.useRouterHistory;
var CreateHashHistory = History.createHashHistory;
var appHistory = UseRouterHistory(CreateHashHistory)({ queryKey: false });

var Base = require('./components/Base.jsx');
var FluffenfallPage = require('./components/FluffenfallPage.jsx');
var EffectronPage = require('./components/EffectronPage.jsx');
var AboutPage = require('./components/AboutPage.jsx');

var Routes = (
  <Router history={appHistory}>
    <Route path="/" component={Base}>
      <IndexRedirect to="/fluffenfall" />
      <Route path="/fluffenfall" component={FluffenfallPage}></Route>
      <Route path="/effectron" component={EffectronPage}></Route>
      <Route path="/about" component={AboutPage}></Route>
    </Route>
  </Router>
);

module.exports = Routes;
