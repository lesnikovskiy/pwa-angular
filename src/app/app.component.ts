import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwPush, SwUpdate, UnrecoverableStateEvent } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private readonly swPush: SwPush,
    private readonly swUpdate: SwUpdate,
    private readonly snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Checking SW Update Status
    this.swUpdate.checkForUpdate().then((isAvailable: boolean) => {
      if (isAvailable) {
        console.log(`Update available`);
        const sb = this.snackBar.open('There is an update available', 'Install', { duration: 4000 });
        sb.onAction().subscribe(() => {
          console.log('Update installed');
          this.swUpdate.activateUpdate().then(() => document.location.reload());
        });
      }
    });

    this.swUpdate.unrecoverable.subscribe((event: UnrecoverableStateEvent) => {
      this.snackBar.open(`An error occurred that we cannot recover from: ${event.reason}. Please reload page.`, '', { duration: 3000 });
    });

    // Checking Network Status
    this.updateNetworkStatusUI();
    window.addEventListener('online', this.updateNetworkStatusUI);
    window.addEventListener('offline', this.updateNetworkStatusUI);

    // Checking Installation Status
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

  subscribeToPush() {
    Notification.requestPermission((permission: NotificationPermission) => {
      if (permission === 'granted') {
        this.swPush.requestSubscription({ serverPublicKey: '' }).then(() => {
          console.log('Registered');
        });
      }
    });
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
