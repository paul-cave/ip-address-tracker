"use strict";

const searchInput = document.querySelector(".search__input");
const searchButton = document.querySelector(".search__btn");
const searchForm = document.querySelector(".search");
const displaySections = document.querySelectorAll(".info__section");
const ipDisplay = document.querySelector(".info__text--ip");
const locationDisplay = document.querySelector(".info__text--location");
const timezoneDisplay = document.querySelector(".info__text--timezone");
const providerDisplay = document.querySelector(".info__text--isp");
const loadingSpinner = document.querySelector(".spinner");
const invalidMsg = document.querySelector(".invalid");
const collapseBtn = document.querySelector(".info__collapse");

class App {
  constructor() {
    this.mapZoomLevel = 13;
    this.icon = L.icon({
      iconUrl: "./images/icon-location.svg",
      iconAnchor: [23, 56],
    });
    this._init();
    searchButton.addEventListener("click", this._searchClickHandler.bind(this));
    searchInput.addEventListener("input", this._hideInvalid.bind(this));
    collapseBtn.addEventListener("click", this._collapseHandler.bind(this));

    this.ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    this.domainRegex =
      /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*\w[a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
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

  _formValidation() {
    this.userInput = searchInput.value;
    this.ipTestRegex = this.ipRegex.test(this.userInput);
    this.domainTestRegex = this.domainRegex.test(this.userInput);

    if (this.ipTestRegex) {
      this.userInput = `ipAddres=${this.userInput}`;
    } else if (this.domainTestRegex) {
      this.userInput = `domain=${this.userInput}`;
    } else {
      invalidMsg.classList.remove("hidden");
      return false;
    }
    this._toggleSpinner();
    this._updateLocation(this.userInput);
  }

  _hideInvalid(e) {
    e.preventDefault();
    invalidMsg.classList.add("hidden");
  }

  _renderError(msg) {
    const markup = `
    <div class="error">
      <svg>
        <use href="images/icons.svg#icon-alert-triangle"></use>
      </svg>
      ${msg}
    </div>`;
    searchForm.insertAdjacentHTML("afterend", markup);
    this.errorDisplay = document.querySelector(".error");
    loadingSpinner.classList.add("hidden");
    displaySections.forEach((section) => section.classList.remove("hidden"));
  }

  _getLocationData = async function (userInput = "ipAddress=") {
    try {
      if (this.errorDisplay) this.errorDisplay.remove();
      const geo = await fetch(
        `https://geo.ipify.org/api/v1?apiKey=at_BuqrWyGceKjQWhv8pnIgamjz52XM5&${userInput}`
      );
      // throw new Error("Problem getting location data");
      const data = await geo.json();
      return data;
    } catch (err) {
      console.error(err);
      this._renderError(err.message);
    }
  };

  _updateLocation(input = "") {
    this._getLocationData(input).then((res) => {
      if (this.marker) this.marker.remove();
      ipDisplay.textContent = res.ip;
      locationDisplay.textContent = `${res.location.city} ${res.location.postalCode}`;
      timezoneDisplay.textContent = `UTC ${res.location.timezone}`;
      providerDisplay.textContent = res.isp;
      this.map.flyTo([res.location.lat, res.location.lng], this.mapZoomLevel);
      this.marker = L.marker([res.location.lat, res.location.lng], {
        icon: this.icon,
      }).addTo(this.map);
      this._toggleSpinner();
    });
  }

  _searchClickHandler(e) {
    e.preventDefault();
    this._formValidation();
  }

  _collapseHandler(e) {
    console.log(collapseBtn.children);
    const collapseIcons = [...collapseBtn.children];
    collapseIcons.forEach((child) => child.classList.toggle("hidden"));
    displaySections.forEach((section) => section.classList.toggle("hidden"));
  }

  _toggleSpinner() {
    loadingSpinner.classList.toggle("hidden");
    displaySections.forEach((section) => section.classList.toggle("hidden"));
  }

  _init() {
    this._loadMap([51.505, -0.09]);
    this._toggleSpinner();
    this._updateLocation();
  }
}

const app = new App();

//TODO
//add regex validation
//add domain search functionality
//add info collapsability
//add invalid form tooltip
