import { Component } from "@angular/core";
import { AppStorageService } from "../app-storage.service";
import { WEATHER_HISTORY } from "../app.constants";
import { WeatherSearch } from "../model/weather-search";
import { Subscription } from 'rxjs';

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
  standalone: false
})
export class Tab2Page {
  weatherHistory: WeatherSearch[] = [];
  tempUnit: string = 'celsius';
  tempUnitSubscription!: Subscription;

  constructor(private appStorage: AppStorageService) { }

  async ionViewDidEnter() {
    const data = await this.appStorage.get(WEATHER_HISTORY);
    this.listenForTempUnitChanges();

    if (data) {
      this.weatherHistory = data;
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

  // Deletes entry from history
  deleteSearch(item: WeatherSearch) {
    const index = this.weatherHistory.indexOf(item);

    if (index > -1) {
      this.weatherHistory.splice(index, 1);
      this.appStorage.set(WEATHER_HISTORY, this.weatherHistory);
    }
  }
}