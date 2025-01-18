import { Component } from "@angular/core";
import { AppStorageService } from "../app-storage.service";
import { WEATHER_HISTORY } from "../app.constants";
import { WeatherSearch } from "../model/weather-search";
import { GroupByDatePipe } from '../pipes/group-by-date.pipe';

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
  standalone: false
})
export class Tab2Page {
  weatherHistory: WeatherSearch[] = [];

  constructor(private appStorage: AppStorageService) { }

  async ionViewDidEnter() {
    const data = await this.appStorage.get(WEATHER_HISTORY);

    if (data) {
      this.weatherHistory = data;
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