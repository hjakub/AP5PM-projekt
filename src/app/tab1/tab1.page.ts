import { Component, OnInit } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';

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

  constructor(public httpClient: HttpClient) {}

  // Default location displayed after reloading
  ngOnInit() {
    this.loadWeather('Ostrava');
  }

  // Loads weather info in a given city
  loadWeather(city: string) {
    this.httpClient.get(`${API_URL}/weather?q=${city}&appid=${API_KEY}`).subscribe({
      next: (results) => {
        console.log('API Response:', results);
        this.res = results;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('API Error:', error);
        this.res = null;
        this.errorMessage = 'Location not found';
      },
    });
  }

  // Displays weather info in a given city after user presses the search button
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