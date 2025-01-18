import { Component, OnInit } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AppStorageService } from '../app-storage.service';
import { WEATHER_HISTORY } from '../app.constants';
import { WeatherSearch } from '../model/weather-search';

const API_KEY = environment.api_key;
const API_URL = environment.api_url;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  res: any = null;
  errorMessage: string = '';
  searchQuery: string = '';

  constructor(private appStorage: AppStorageService, public httpClient: HttpClient) { }

  // Default location displayed after reloading
  ngOnInit() {
    this.loadWeather('Ostrava');
  }

  // Loads weather info in a given city
  async loadWeather(city: string) {
    this.httpClient.get(`${API_URL}/weather?q=${city}&appid=${API_KEY}`).subscribe({
      next: async (results) => {
        console.log('API Response:', results);
        this.res = results;
        this.errorMessage = '';

        // Save search to history
        const now = new Date();
        const weatherHistory: WeatherSearch[] = (await this.appStorage.get(WEATHER_HISTORY)) || [];
        const searchItem = new WeatherSearch(this.res.name, this.res.sys.country, (this.res.main.temp - 273.15).toFixed(1) + " °C", new Date(now.getTime()));
        weatherHistory.push(searchItem);
        await this.appStorage.set(WEATHER_HISTORY, weatherHistory);
      },
      error: (error) => {
        console.error('API Error:', error);
        this.res = null;
        this.errorMessage = 'Location not found';
      },
    });
  }

  // Displays weather info in a given city
  onSearch() {
    const city = this.searchQuery.trim();
    if (city) {
      this.loadWeather(city);
    } else {
      this.errorMessage = 'Location not found';
      this.res = null;
    }
  }
}