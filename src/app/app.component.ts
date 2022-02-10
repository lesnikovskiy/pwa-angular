import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private readonly snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.updateNetworkStatusUI();
    window.addEventListener('online', this.updateNetworkStatusUI);
    window.addEventListener('offline', this.updateNetworkStatusUI);

    if ((navigator as any).standalone === false) {
      // This is an iOS device and we are in the browser
      this.showInstallPrompt();
    }

    if ((navigator as any).standalone == undefined) {
      // It's not iOS
      if (window.matchMedia('(display-mode: browser').matches) {
        window.addEventListener('beforeinstallprompt', event => {
          event.preventDefault();
          const sb = this.snackBar.open('Do you want to install the App?', 'Install', { duration: 5000 });
          sb.onAction().subscribe(() => {
            (event as any).prompt();
            (event as any).userChoice.then((result: any) => {
              if (result.outcome === 'dismissed') {

              } else {

              }
            })
          });
          return false;
        });
      }
    }
  }

  private updateNetworkStatusUI() {
    if (navigator.onLine) {
      (document.querySelector('body') as any).style = '';
    } else {
      // 100% sure you're offline
      (document.querySelector('body') as any).style = 'filter: grayscale(1)';
    }
  }

  private showInstallPrompt() {
    this.snackBar.open('You can add this PWA to the Home Screen', '', { duration: 3000 });
  }
}
