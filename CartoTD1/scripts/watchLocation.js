var id, target, options;

const watchx = document.getElementById("watchDemo");

function watchSuccess(pos) {
  watchx.innerHTML = ""; // clear old values
  const crd = pos.coords;

  const fields = [
    "latitude",
    "longitude",
    "altitude",
    "accuracy",
    "altitudeAccuracy",
    "heading",
    "speed"
  ];

  fields.forEach(key => {
    if (crd[key] !== null && crd[key] !== undefined) {
      const li = document.createElement("li");
      li.textContent = `${key}: ${crd[key]}`;
      watchx.appendChild(li);
    }
  });
}


function watchError(err) {
  console.warn("ERROR(" + err.code + "): " + err.message);
}

target = {
  latitude: 0,
  longitude: 0,
};

options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
};


id = navigator.geolocation.watchPosition(watchSuccess, watchError, options);
