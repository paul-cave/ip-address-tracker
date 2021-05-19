"use strict";

const searchInput = document.querySelector(".search__input");
const searchButton = document.querySelector(".search__btn");
const ipDisplay = document.querySelector(".info__text--ip");
const locationDisplay = document.querySelector(".info__text--location");
const timezoneDisplay = document.querySelector(".info__text--timezone");
const providerDisplay = document.querySelector(".info__text--isp");

class App {
  constructor() {
    this.mapZoomLevel = 13;
    this._init();
    searchButton.addEventListener("click", this._searchClickHandler.bind(this));
  }

  _loadMap(coords = [51.505, -0.09]) {
    this.map = L.map("map", { zoomControl: false }).setView(
      coords,
      this.mapZoomLevel
    );

    L.control.zoom({ position: "bottomleft" }).addTo(this.map);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  _renderError() {}

  _getLocationData = async function (ip = "") {
    try {
      const geo = await fetch(
        `https://geo.ipify.org/api/v1?apiKey=at_BuqrWyGceKjQWhv8pnIgamjz52XM5&ipAddress=${ip}`
      );
      const data = await geo.json();
      console.log(data);
      // return [data.location.lat, data.location.lng];
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  _updateLocation(input = "") {
    this._getLocationData(input).then((res) => {
      console.log(res);
      ipDisplay.textContent = res.ip;
      locationDisplay.textContent = `${res.location.city} ${res.location.postalCode}`;
      timezoneDisplay.textContent = `UTC ${res.location.timezone}`;
      providerDisplay.textContent = res.isp;
      this.map.flyTo([res.location.lat, res.location.lng], this.mapZoomLevel);
    });
  }

  _searchClickHandler(e) {
    e.preventDefault();
    const input = searchInput.value;
    this._updateLocation(input);
  }

  _init() {
    this._loadMap([51.505, -0.09]);
    this._updateLocation();
  }
}

const app = new App();
