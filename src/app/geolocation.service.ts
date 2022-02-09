import { Injectable } from '@angular/core';
import { PlaceLocation } from './logic/place-location';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  requestLocation(callback: (coords: GeolocationCoordinates | null) => void) {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        callback(position.coords)
      },
      () =>  {
        callback(null)
      }
    );
  }

  getMapLink(location: PlaceLocation): string {
    let query = '';

    if (location.latitude && location.longitude) {
      query = `${location.latitude},${location.longitude}`;
    } else {
      query = `${location.address},${location.city}`;
    }

    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      return `https://maps.apple.com/?q=${query}`;
    } else {
      return `https://maps.google.com/?q=${query}`;
    }
  }
}
