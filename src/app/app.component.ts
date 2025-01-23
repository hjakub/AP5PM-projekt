import { Component } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';

StatusBar.setOverlaysWebView({ overlay: false });

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor() {}
}
