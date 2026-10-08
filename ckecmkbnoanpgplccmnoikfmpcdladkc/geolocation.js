chrome.runtime.onMessage.addListener(handleMessages);

function handleMessages(message, sender, sendResponse) {
  if (message.target !== "offscreen") {
    return false;
  }

  if (message.type !== "get-geolocation") {
    console.warn(`Unexpected message type received: '${message.type}'.`);
    return;
  }

  getGeolocation().then((geolocation) => sendResponse(geolocation));

  return true;
}

function clone(obj) {
  const copy = {};

  if (obj === null || !(obj instanceof Object)) {
    return obj;
  } else {
    for (const p in obj) {
      copy[p] = clone(obj[p]);
    }
  }
  return copy;
}

async function getGeolocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (loc) => resolve(clone(loc)),
      // in case the user doesnt have or is blocking `geolocation`
      (err) => reject(err),
    );
  });
}
