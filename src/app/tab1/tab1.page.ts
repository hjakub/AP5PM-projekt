import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AppStorageService } from '../app-storage.service';
import { WEATHER_HISTORY } from '../app.constants';
import { WeatherSearch } from '../model/weather-search';
import { Subscription } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

const API_KEY = environment.api_key;
const API_URL = environment.api_url;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit, OnDestroy {
  res: any = null;
  errorMessage: string = '';
  searchQuery: string = '';
  isLoading: boolean = false;
  tempUnit: string = 'celsius';
  tempUnitSubscription!: Subscription;
  icon: any;

  constructor(private appStorage: AppStorageService, public httpClient: HttpClient) { }

  ngOnInit() {
    this.getUserLocation();
    this.listenForTempUnitChanges();
  }

  ngOnDestroy() {
    if (this.tempUnitSubscription) {
      this.tempUnitSubscription.unsubscribe();
    }
  }

  // Gets users coordinates or displays error if permission is denied
  async getUserLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lon = coordinates.coords.longitude;
      this.loadWeatherByCoords(lat, lon);
    } catch (error) {
      console.error('Error getting location: ', error);
      this.errorMessage = ' Permission denied. Search manually.';
    }
  }

  // Listens for unit changes
  listenForTempUnitChanges() {
    this.tempUnitSubscription = this.appStorage.tempUnit$.subscribe((unit) => {
      this.tempUnit = unit;
    });
  }

  // Converts temp from K to user selected unit
  convertTemp(tempKelvin: number): string {
    switch (this.tempUnit) {
      case 'fahrenheit':
        return ((tempKelvin - 273.15) * 9 / 5 + 32).toFixed(1) + ' °F';
      case 'kelvin':
        return tempKelvin.toFixed(1) + ' K';
      default:
        return (tempKelvin - 273.15).toFixed(1) + ' °C';
    }
  }

  // Loads weather info in a given city
  async loadWeather(city: string) {
    this.httpClient.get(`${API_URL}/weather?q=${city}&appid=${API_KEY}`).subscribe({
      next: async (results) => {
        this.res = results;
        this.errorMessage = '';
        this.icon = (`https://openweathermap.org/img/wn/${this.res.weather[0].icon}@1x.png`);

        // Save search to history
        const now = new Date();
        const weatherHistory: WeatherSearch[] = (await this.appStorage.get(WEATHER_HISTORY)) || [];
        const searchItem = new WeatherSearch(this.res.name, this.res.sys.country, this.res.main.temp, new Date(now.getTime()));
        weatherHistory.push(searchItem);
        await this.appStorage.set(WEATHER_HISTORY, weatherHistory);
        console.log(results);
      },
      error: (error) => {
        console.error('API Error: ', error);
        this.res = null;
        this.errorMessage = ' Location not found.';
      },
    });
  }

  // Loads weather by coordinates instead of a place name
  async loadWeatherByCoords(lat: number, lon: number) {
    this.httpClient.get(`${API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`).subscribe({
      next: (results) => {
        this.res = results;
        this.errorMessage = '';
        this.icon = (`https://openweathermap.org/img/wn/${this.res.weather[0].icon}@4x.png`);
      },
      error: (error) => {
        console.error('API Error: ', error);
        this.res = null;
        this.errorMessage = ' Location not found.';
      }
    });
  }

  // Displays weather info in a given city
  onSearch() {
    this.isLoading = true;
    const city = this.searchQuery.trim();
    if (city) {
      this.loadWeather(city);
      this.isLoading = false;
    } else {
      this.errorMessage = 'Location not found.';
      this.res = null;
      this.isLoading = false;
    }
  }

  // Converts to local time (used for sunrise and sunset)
  convertToLocalTime(utcTimestamp: number, timezoneOffset: number): string {
    const localTime = new Date((utcTimestamp + timezoneOffset) * 1000);
    return localTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
}