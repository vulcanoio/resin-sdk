
/**
 * @module resin.auth
 */

(function() {
  var errors, request, token;

  errors = require('resin-errors');

  request = require('resin-request');

  token = require('resin-token');


  /**
   * @summary Return current logged in username
   * @public
   * @function
   *
   * @description This will only work if you used {@link module:resin.auth.login} to log in.
   *
   * @returns {Promise<String|undefined>} username
   *
   * @example
   * resin.auth.whoami().then (username) ->
   * 	if not username?
   * 		console.log('I\'m not logged in!')
   * 	else
   * 		console.log("My username is: #{username}")
   */

  exports.whoami = function(callback) {
    return token.getUsername().nodeify(callback);
  };


  /**
   * @summary Authenticate with the server
   * @protected
   * @function
   *
   * @description You should use {@link module:resin.auth.login} when possible,
   * as it takes care of saving the token and username as well.
   *
   * Notice that if `credentials` contains extra keys, they'll be discarted
   * by the server automatically.
   *
   * @param {Object} credentials - in the form of username, password
   * @param {String} credentials.username - the username
   * @param {String} credentials.password - the password
   *
   * @returns {Promise<String>} session token
   *
   * @example
   * resin.auth.authenticate(credentials).then (token) ->
   * 	console.log("My token is: #{token}")
   */

  exports.authenticate = function(credentials, callback) {
    return request.send({
      method: 'POST',
      url: '/login_',
      data: credentials
    }).get('body').nodeify(callback);
  };


  /**
   * @summary Login to Resin.io
   * @public
   * @function
   *
   * @description If the login is successful, the token is persisted between sessions.
   *
   * @param {Object} credentials - in the form of username, password
   * @param {String} credentials.username - the username
   * @param {String} credentials.password - the password
   *
   * @returns {Promise}
   *
   * @example
   * resin.auth.login(credentials)
   */

  exports.login = function(credentials, callback) {
    return exports.authenticate(credentials).then(token.set).nodeify(callback);
  };


  /**
   * @summary Login to Resin.io with a token
   * @public
   * @function
   *
   * @description Login to resin with a session token instead of with credentials.
   *
   * @param {String} token - the auth token
   * @returns {Promise}
   *
   * @example
   * resin.auth.loginWithToken(token)
   */

  exports.loginWithToken = function(authToken, callback) {
    return token.set(authToken).nodeify(callback);
  };


  /**
   * @summary Check if you're logged in
   * @public
   * @function
   *
   * @returns {Promise<Boolean>} is logged in
   *
   * @example
   * resin.auth.isLoggedIn().then (isLoggedIn) ->
   * 	if isLoggedIn
   * 		console.log('I\'m in!')
   * 	else
   * 		console.log('Too bad!')
   */

  exports.isLoggedIn = function(callback) {
    return token.has().nodeify(callback);
  };


  /**
   * @summary Get current logged in user's token
   * @public
   * @function
   *
   * @description This will only work if you used {@link module:resin.auth.login} to log in.
   *
   * @returns {Promise<String>} session token
   *
   * @example
   * resin.auth.getToken().then (token) ->
   * 	console.log(token)
   */

  exports.getToken = function(callback) {
    return token.get().then(function(savedToken) {
      if (savedToken == null) {
        throw new errors.ResinNotLoggedIn();
      }
      return savedToken;
    }).nodeify(callback);
  };


  /**
   * @summary Get current logged in user's id
   * @public
   * @function
   *
   * @description This will only work if you used {@link module:resin.auth.login} to log in.
   *
   * @param {module:resin.auth~getUserIdCallback} callback - callback
   * @returns {Promise<Number>} user id
   *
   * @example
   * resin.auth.getUserId().then (userId) ->
   * 	console.log(userId)
   */

  exports.getUserId = function(callback) {
    return token.getUserId().then(function(id) {
      if (id == null) {
        throw new errors.ResinNotLoggedIn();
      }
      return id;
    }).nodeify(callback);
  };


  /**
   * @summary Logout from Resin.io
   * @public
   * @function
   *
   * @returns {Promise}
   *
   * @example
   * resin.auth.logout()
   */

  exports.logout = function(callback) {
    return token.remove().nodeify(callback);
  };


  /**
   * @summary Register to Resin.io
   * @public
   * @function
   *
   * @param {Object} [credentials={}] - in the form of username, password and email
   * @param {String} credentials.username - the username
   * @param {String} credentials.password - the password
   * @param {String} credentials.email - the email
   *
   * @returns {Promise<String>} session token
   *
   * @example
   * resin.auth.register
   * 	username: 'johndoe'
   * 	password: 'secret'
   * 	email: 'johndoe@gmail.com'
   * .then (token) ->
   * 	console.log(token)
   */

  exports.register = function(credentials, callback) {
    if (credentials == null) {
      credentials = {};
    }
    return request.send({
      method: 'POST',
      url: '/user/register',
      data: credentials
    }).get('body').nodeify(callback);
  };

}).call(this);
