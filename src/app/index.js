'use strict';

var app = angular.module('visaguas', ['ui.router']);

require('./config')(app);
require('./services')(app);
require('./controllers')(app);
require('./directives')(app);
require('./filters')(app);

angular.bootstrap(document, ['visaguas']);

require('./ui')();