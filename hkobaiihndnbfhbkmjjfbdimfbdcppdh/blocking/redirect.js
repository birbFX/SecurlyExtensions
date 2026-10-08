"use strict";
try {
  const queryParams = new URLSearchParams(window.location.search);
  const serverUrl = queryParams.get('serverUrl');
  queryParams.delete('serverUrl');
  const remainingQueryString = queryParams.toString();
  const redirectUrl = serverUrl + '/agent/block' + '?' + remainingQueryString;
  window.location.replace(redirectUrl);
} catch (error) {
  console.error('Error in redirect page: ' + error);
  document.body.innerHTML = '<h1>Error</h1><p>' + error + '</p>';
}
