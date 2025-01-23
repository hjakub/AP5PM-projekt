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
  paletteToggle = false;

  constructor(private appStorage: AppStorageService) { }

  async ionViewDidEnter() {
    const savedUnit = await this.appStorage.get('TEMP_UNIT');
    if (savedUnit) {
      this.selectedUnit = savedUnit;
    }
  }

  ngOnInit() {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Initialize the dark palette based on the initial
    // value of the prefers-color-scheme media query
    this.initializeDarkPalette(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkPalette(mediaQuery.matches));
  }


  initializeDarkPalette(isDark: boolean) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }

  toggleChange(ev: any) {
    this.toggleDarkPalette(ev.detail.checked);
  }

  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

  async onUnitChange() {
    await this.appStorage.set('TEMP_UNIT', this.selectedUnit);
  }
}
