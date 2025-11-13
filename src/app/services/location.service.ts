import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  async getCurrentPosition(): Promise<{ lat: number; lng: number } | null> {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      return {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };
    } catch (err) {
      console.error('Geolocation error:', err);
      return null;
    }
  }

  async watchPosition(callback: (coords: { lat: number; lng: number }) => void) {
    const id = await Geolocation.watchPosition({}, (position, err) => {
      if (position) {
        callback({ lat: position.coords.latitude, lng: position.coords.longitude });
      }
    });
    return id;
  }
}
