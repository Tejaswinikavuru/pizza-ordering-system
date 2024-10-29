import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PizzaService } from '../../services/pizza.service';
import { OrderService } from '../../services/order.service';
import { OfferService } from '../../services/offer.service';
import { Topping } from '../../models/topping.model';
import { Order } from '../../models/order.model';
import { PizzaSize } from '../../models/pizza-size.model';
import { Offer } from '../../models/offer.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})

export class PizzaOrderComponent implements OnInit {
  pizzas: Order[] = [];
  vegToppings: Topping[] = [];
  nonVegToppings: Topping[] = [];
  quantity: number = 1;
  offers: Offer[] = [];
  totalPrice: number = 0;
  currentOrder: Order | null = null;
  sizes: PizzaSize[] = [];
  selectedPizza: Order | undefined;
  selectedSize: PizzaSize | undefined;


  constructor(
    private pizzaService: PizzaService,
    private orderService: OrderService,
    private offerService: OfferService
  ) { }

  ngOnInit(): void {
    this.loadToppings();
    this.loadSizesAndOffers();
    this.initializePizzaOrders();
  }

  // Load toppings from PizzaService
  loadToppings(): void {
    this.pizzaService.getVegToppings().subscribe((toppings: Topping[]) => {
      this.vegToppings = toppings;
    });
    this.pizzaService.getNonVegToppings().subscribe((toppings: Topping[]) => {
      this.nonVegToppings = toppings;
    });
  }

  // Load offers from OfferService
  loadSizesAndOffers(): void {
    this.pizzaService.getSizes().subscribe(sizes => {
      this.sizes = sizes;
    });
    this.offers = this.offerService.getAvailableOffers();
  }

  private initializePizzaOrders(): void {
    this.pizzas = this.sizes.map(size => ({
      vegToppings: [],
      nonVegToppings: [],
      size,
      beforeDiscount: size.price,
      discountedPrice: size.price,
      offerName: '',
      quantity: 1,
      isChoosen: false
    }));
  }

  onToppingAdded(topping: Topping, size: string): void {
    debugger;
    const selectedPizza = this.pizzas.find((pizza) => pizza.size.name === size);
    if (selectedPizza) {
      this.toggleTopping(selectedPizza, topping);
      selectedPizza.offerName = this.offerService.getOfferDescriptionBySize(size) ?? '';
      selectedPizza.discountedPrice = selectedPizza.beforeDiscount - this.offerService.calculateBestOffer(selectedPizza);
      this.calculateTotalPrice(selectedPizza);
    }
  }

  private toggleTopping(pizza: Order, topping: Topping): void {
    const toppingsList = topping.type === 'non-veg' ? pizza.nonVegToppings : pizza.vegToppings;
    const toppingIdx = toppingsList.findIndex((t) => t.name === topping.name);

    const isToppingNew = toppingIdx === -1;
    if (isToppingNew) {
      toppingsList.push(topping);
      pizza.beforeDiscount += topping.price;
    } else {
      toppingsList.splice(toppingIdx, 1);
      pizza.beforeDiscount -= topping.price;
    }
    pizza.isChoosen = pizza.vegToppings.length > 0 || pizza.nonVegToppings.length > 0;
  }

  // Method to calculate the total price based on selected toppings and size
  calculateTotalPrice(selectedPizza: Order | undefined) {
    if (selectedPizza) {
      this.selectedPizza = selectedPizza;
      this.selectedSize = selectedPizza.size;
      selectedPizza.vegToppings = this.vegToppings.filter(topping => topping.isAdded);
      selectedPizza.nonVegToppings = this.nonVegToppings.filter(topping => topping.isAdded);

      selectedPizza.beforeDiscount = selectedPizza.size.price * selectedPizza.quantity;
      this.totalPrice = this.pizzas.reduce((total, pizza) => {
        if (pizza.isChoosen) {
          pizza.discountedPrice = this.offerService.calculateBestOffer(pizza);
          return total + pizza.discountedPrice;
        }
        return total;
      }, 0);
    }
  }

  placeOrder(): void {
    if (this.selectedPizza && this.selectedSize) {
      // Filter selected toppings for both veg and non-veg
      const selectedVegToppings = this.vegToppings.filter(t => t.isAdded);
      const selectedNonVegToppings = this.nonVegToppings.filter(t => t.isAdded);

      // Create a size object from the selected size
      const size = { name: this.selectedSize.name, price: this.selectedSize.price };

      // Call the OrderService to place the order
      this.orderService.placeOrder(
        this.quantity,
        size,
        selectedVegToppings,
        selectedNonVegToppings,
        {
          beforeDiscount: this.selectedPizza.beforeDiscount,
          discount: this.selectedPizza.discountedPrice,
        }
      ).subscribe(
        (order) => {
          this.currentOrder = order;
          this.totalPrice = order.discountedPrice;
          alert(`Order placed for ${this.quantity} Pizza(s) with selected toppings.`);
        },
        (error) => console.error('Order placement failed', error)
      );
    }
  }

  cancelOrder(): void {
    this.pizzas = [];
    window.location.href = '/';
  }
}
