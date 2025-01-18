import { Component } from '@angular/core';
import { AppStorageService } from '../app-storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  selectedUnit: string = 'celsius';

  constructor(private appStorage: AppStorageService) { }

  async ionViewDidEnter() {
    const savedUnit = await this.appStorage.get('TEMP_UNIT');
    if (savedUnit) {
      this.selectedUnit = savedUnit;
    }
  }

  async onUnitChange() {
    await this.appStorage.set('TEMP_UNIT', this.selectedUnit);
  }
}
