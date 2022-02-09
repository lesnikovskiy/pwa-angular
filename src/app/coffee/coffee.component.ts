import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { GeolocationService } from '../geolocation.service';
import { Coffee } from '../logic/coffee';
import { TastingRating } from '../logic/tasting-rating';

@Component({
  selector: 'app-coffee',
  templateUrl: './coffee.component.html',
  styleUrls: ['./coffee.component.scss']
})
export class CoffeeComponent implements OnInit, OnDestroy {
  coffee!: Coffee;
  tastingEnabled = false;

  types = ['Espresso', 'Ristretto', 'Americano', 'Capuccino', 'Frappe'];

  routingSubscription!: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly geolocationService: GeolocationService,
    private readonly dataService: DataService
  ) { }

  ngOnInit(): void {
    this.coffee = new Coffee();

    this.routingSubscription = this.route.params.subscribe(p => {
      const id = p['id'];
      if (id) {
        this.dataService.get(p['id']).subscribe((coffee: Coffee) => {
          this.coffee = coffee;
          if (this.coffee.tastingRating) {
            this.tastingEnabled = true;
          }
        });
      } else {
        this.coffee.tastingRating = null;
      }
    });

    this.geolocationService.requestLocation((location: GeolocationCoordinates | null) => {
      if (location) {
        this.coffee.location.latitude = location.latitude;
        this.coffee.location.longitude = location.longitude;
      }
    });
  }

  ngOnDestroy(): void {
      this.routingSubscription.unsubscribe();
  }

  tastingRatingChanged(checked: boolean) {
    if (checked) {
      this.coffee.tastingRating = new TastingRating();
    } else {
      this.coffee.tastingRating = null;
    }
  }

  cancel() {
    this.goHome();
  }

  save() {
    this.dataService.save(this.coffee).subscribe(() => this.goHome());
  }

  private goHome() {
    this.router.navigate(['/']);
  }
}
