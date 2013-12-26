//Code Snippet from blog post: OAuth with Worklight & Cordova ChildBrowser Plugin, http://wp.me/p2lwuh-2j

//Helper function. turn #a=b&b=c to {a:'b', b: 'c'}
var parametersFromUrl = function(url) {
  var result = {};
  //Remove everything up to where the parameters start. could be after # or after ?
  url = url.substr(url.indexOf('?') + 1).substr(url.indexOf('#') + 1)
  //Replace html escape characters
  url = url.replace(/%23/g, '#').replace(/%26/g, '&').replace(/%3D/g, '=');

  var parameters = url.split('&');
  
  for(var i = 0;  i < parameters.length; i++) {
    var parameter = parameters[i].split('=');
    result[parameter[0]] = parameter[1];
  }
  return result;
}

function authenticateLinkedIn(apiKey, secret, onSuccess, onFailure) {
  //Signature object to pass to OAuthSimple. When we get responses from LinkedIn server,
  //we'll keep adding properties to this oauthSignature object
  var signatures = { consumer_key: apiKey, shared_secret: secret };
  var simple = new OAuthSimple();
  
  //OAuth step 1: Get our request token
  //once request token is fetched, go to step 2
  function getRequestToken() {
    //Build requestURL using OAuthSimple
    var result = simple.reset().sign({
      action: 'POST',
      path: 'https://api.linkedin.com/uas/oauth/requestToken',
      signatures: signatures
    });
    //Make request
    jQuery.ajax({
      url: result.signed_url,
      type: 'POST',
      success: function(data) {
        //Add the parameters LinkedIn gave back to us to our signatures object,
        //for the next step
        jQuery.extend(signatures, parametersFromUrl(data));
        childBrowserAuthenticate();
      },
      error: function() {
        onFailure('Failed to get request token.');
      }
    });
  };

  //Step 2: Open childBrowser and let user authenticate our app on linkedin.com, then go to step 3
  function childBrowserAuthenticate() {
    //Install ChildBrowser (this should be done elsewhere)
    ChildBrowser.install();
    var childBrowser = window.plugins.childBrowser;
    var browserUrl = simple.reset().sign({
      path: signatures['xoauth_request_auth_url']
    }).signed_url;
    childBrowser.showWebPage(decodeURIComponent(browserUrl));

    function finish(err) {
        if (err) onFailure(err);
        childBrowser.onClose = null;
        childBrowser.close();
    }

    childBrowser.onLocationChange = function(loc) {
        if (loc.indexOf('oauth_problem') > -1) {
            finish('User authorization error');
        } else if (loc.indexOf('oauth_verifier') > -1) {
            finish();
            jQuery.extend(signatures, parametersFromUrl(loc));
            getAccessToken();
        }
    };

    //If user closes early, fail.
    childBrowser.onClose = function() {
        finish('User cancelled authorization.');
    };
  };

  //Step 3: Use token retrieved from user authentication and get an access token,
  //so we can do linkedin API calls. Then go to step 4
  function getAccessToken() {
    var requestUrl = simple.reset().sign({
      action: 'POST',
      path: 'https://api.linkedin.com/uas/oauth/accessToken',
      parameters: {
       'oauth_verifier': signatures.oauth_verifier
      }
    }).signed_url;

    jQuery.ajax({
      url: requestUrl,
      type: 'POST',
      success: function(data) {
       jQuery.extend(signatures, parametersFromUrl(data));
       getUserProfile();
     },
     error: function(resp) {
       onFailure("Failed to get access token.");
     }
   });
  };

  //Step 4: Use linkedin API with our access token to get user's basic information
  //then finish by calling onSuccess with user's information
  function getUserProfile() {
    var result = simple.reset().sign({
      action: 'GET',
      path: 'https://api.linkedin.com/v1/people/~:(first-name,last-name,headline,picture-url)',
      parameters: {
        format: 'json'
      }
    });
    jQuery.ajax({
      url: result.signed_url,
      success: function(userData) {
        //Finally, we're done! Give the userData back to the caller.
        //userData is formatted like: {firstName: 'Bob', lastName: 'Johnson', pictureUrl: 'http://linkedIn.com/picture'}
        onSuccess(userData); 
      },
      error: function(resp) {
        onFailure('Failed to get profile information')
      }
    });
  };

  //Start the whole process by getting request token
  getRequestToken();  
}