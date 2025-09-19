const geox = document.getElementById("geoDemo");
document.getElementById("geoLocalize").addEventListener("click", getLocation);
getLocation()


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    geox.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function success(position) {
  geox.innerHTML = "";
  for(const element in position.coords) {
    if (typeof(position.coords[element]) !== "function") {
      var li = null ;
      li = document.createElement('li');
      li.innerHTML = element + " : " + position.coords[element]
      geox.appendChild(li)
    }
  }
}

function error() {
  alert("Sorry, no position available.");
}