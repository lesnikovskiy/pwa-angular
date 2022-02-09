import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coffee } from './logic/coffee';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public endpoint = 'http://localhost:3000';

  constructor(
    private readonly http: HttpClient
  ) { }

  getList(): Observable<Coffee[]> {
    return this.http.get<Coffee[]>(`${this.endpoint}/coffees`);
  }

  get(coffeeId: string): Observable<Coffee> {
    return this.http.get<Coffee>(`${this.endpoint}/coffees/${coffeeId}`);
  }

  save(coffee: Coffee): Observable<void> {
    if (coffee._id) {
      return this.http.put<void>(`${this.endpoint}/coffees/${coffee._id}`, coffee);
    } else {
      return this.http.post<void>(`${this.endpoint}/coffees`, coffee);
    }
  }
}
