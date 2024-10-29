import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Topping } from '../models/topping.model';
import { PizzaSize } from '../models/pizza-size.model';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {

  private pizzaDataUrl = 'assets/pizza.json'; // URL to the JSON file

  constructor(private http: HttpClient) {}

  // Fetch all pizza data
  private fetchPizzaData(): Observable<{ toppings: Topping[], sizes: PizzaSize[] }> {
    return this.http.get<{ toppings: Topping[], sizes: PizzaSize[] }>(this.pizzaDataUrl);
  }

  // Fetch all vegetarian toppings
  getVegToppings(): Observable<Topping[]> {
    return this.fetchPizzaData().pipe(
      map(data => data.toppings.filter(topping => topping.type === 'veg'))
    );
  }

  // Fetch all non-vegetarian toppings
  getNonVegToppings(): Observable<Topping[]> {
    return this.fetchPizzaData().pipe(
      map(data => data.toppings.filter(topping => topping.type === 'non-veg'))
    );
  }

  // Fetch all pizza sizes
  getSizes(): Observable<PizzaSize[]> {
    return this.fetchPizzaData().pipe(
      map(data => data.sizes)
    );
  }
}