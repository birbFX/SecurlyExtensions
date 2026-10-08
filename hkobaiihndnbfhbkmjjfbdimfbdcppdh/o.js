const audio = new Audio(chrome.runtime.getURL("chat.wav"));
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg["action"] === "playSound") {
    audio.play();
    return;
  }
  if (msg["action"] === "getLocation") {
    if (!navigator.geolocation) {
      sendResponse({error: "Geolocation API is not available"});
      return;
    }
    navigator.geolocation.getCurrentPosition(
        position => {
          const coords = position.coords;
          sendResponse({
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy
          });
        },
        error => {
          sendResponse({error: error.message});
        },
        {maximumAge: 600000, timeout: 20000}
    );
    return true;
  }
});

setInterval(async () => {
  (await navigator.serviceWorker.ready).active.postMessage('keepAlive');
}, 20000);