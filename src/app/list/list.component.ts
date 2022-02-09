import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { GeolocationService } from '../geolocation.service';
import { Coffee } from '../logic/coffee';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  coffeeList: Coffee[] = [];

  constructor(
    private readonly router: Router,
    private readonly dataService: DataService,
    private readonly geolocationService: GeolocationService
  ) { }

  ngOnInit(): void {
    this.dataService.getList().subscribe((list: Coffee[]) => {
      this.coffeeList = list;
    });
  }

  gotToMap(coffee: Coffee) {
    const mapUrl = this.geolocationService.getMapLink(coffee.location);
    location.href = mapUrl;
  }

  share(coffee: Coffee) {
    const shareText = `I had this coffee at ${coffee.place} and for me it's a ${coffee.rating} star coffee`;
    if ('share' in navigator) {
      navigator.share({
        title: coffee.name,
        text: shareText,
        url: window.location.href
      })
      .then(() => console.log('shared'))
      .catch(() => console.log('error sharing'));
    } else {
      location.href = `whatsapp://send?text=${encodeURIComponent(shareText)}`
    }
  }

  goDetails(coffee: Coffee) {
    this.router.navigate([`coffee/${coffee._id}`]);
  }
}
