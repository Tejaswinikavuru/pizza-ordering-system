import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PizzaOrderComponent } from './components/order/order.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PizzaOrderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pizza-ordering-system';
}
