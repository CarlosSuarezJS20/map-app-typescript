import axios from "axios";
import { googleApi } from "../google";

const formElement = document.querySelector("form")! as HTMLFormElement;
const inputElement = document.getElementById("address")! as HTMLInputElement;
const GOOGLE_API_K = googleApi;

// declare var google: any;

enum Status {
  OK = "OK",
  ZERO_RESULTS = "ZERO_RESULTS",
}

type GoogleGeoResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: Status;
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = inputElement.value;

  const httpURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
    enteredAddress
  )}A&key=${GOOGLE_API_K}`;

  //send this to google SDK
  axios
    .get<GoogleGeoResponse>(httpURL)
    .then((res) => {
      if (res.data.status !== "OK") {
        throw Error("Address Not Found!");
      }
      const coordinates = res.data.results[0].geometry.location;
      const map = new google.maps.Map(document.getElementById("map")!, {
        center: coordinates,
        zoom: 14,
      });
      new google.maps.Marker({ position: coordinates, map: map });
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });
}

// event listeners

formElement.addEventListener("submit", searchAddressHandler);
