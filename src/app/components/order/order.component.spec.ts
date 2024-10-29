import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { PizzaOrderComponent } from './order.component';
import { PizzaService } from '../../services/pizza.service';
import { OrderService } from '../../services/order.service';
import { OfferService } from '../../services/offer.service';
import { Topping } from '../../models/topping.model';
import { PizzaSize } from '../../models/pizza-size.model';
import { Order } from '../../models/order.model';

describe('PizzaOrderComponent', () => {
  let component: PizzaOrderComponent;
  let fixture: ComponentFixture<PizzaOrderComponent>;
  let pizzaServiceMock: any;
  let orderServiceMock: any;
  let offerServiceMock: any;

  beforeEach(async () => {
    pizzaServiceMock = {
      getVegToppings: jest.fn().mockReturnValue(of([{ name: 'Tomato', price: 1, type: 'veg', isAdded: false }] as Topping[])),
      getNonVegToppings: jest.fn().mockReturnValue(of([{ name: 'Pepperoni', price: 2, type: 'non-veg', isAdded: false }] as Topping[])),
      getSizes: jest.fn().mockReturnValue(of([{ name: 'Small', price: 5 }] as PizzaSize[]))
    };
    orderServiceMock = {
      placeOrder: jest.fn().mockReturnValue(of({ discountedPrice: 8 } as Order))
    };
    offerServiceMock = {
      getAvailableOffers: jest.fn().mockReturnValue([{ description: '10% off', size: 'Small' }]),
      getOfferDescriptionBySize: jest.fn().mockReturnValue('10% off'),
      calculateBestOffer: jest.fn().mockReturnValue(1)
    };

    await TestBed.configureTestingModule({
      imports: [],
      declarations: [PizzaOrderComponent],
      providers: [
        { provide: PizzaService, useValue: pizzaServiceMock },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: OfferService, useValue: offerServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PizzaOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize toppings and sizes on load', () => {
    component.ngOnInit();
    expect(pizzaServiceMock.getVegToppings).toHaveBeenCalled();
    expect(pizzaServiceMock.getNonVegToppings).toHaveBeenCalled();
    expect(pizzaServiceMock.getSizes).toHaveBeenCalled();
    expect(component.vegToppings.length).toBeGreaterThan(0);
    expect(component.nonVegToppings.length).toBeGreaterThan(0);
    expect(component.sizes.length).toBeGreaterThan(0);
  });

  it('should toggle topping and recalculate the price when a topping is added', () => {
    const topping: Topping = { name: 'Tomato', price: 1, type: 'veg', isAdded: true };
    component.pizzas = [{ vegToppings: [], nonVegToppings: [], size: { name: 'Small', price: 5 }, beforeDiscount: 5, discountedPrice: 5, offerName: '', quantity: 1, isChoosen: false }];

    component.onToppingAdded(topping, 'Small');

    const pizza = component.pizzas[0];
    expect(pizza.vegToppings.length).toBe(1);
    expect(pizza.beforeDiscount).toBe(6);
    expect(pizza.discountedPrice).toBe(5); // after applying offer
  });

  it('should calculate total price based on selected pizzas and toppings', () => {
    const pizza1: Order = {
      size: { name: 'Small', price: 5 },
      vegToppings: [{ name: 'Tomato', price: 1, type: 'veg', isAdded: true }],
      nonVegToppings: [],
      beforeDiscount: 6,
      discountedPrice: 5,
      offerName: '10% off',
      quantity: 1,
      isChoosen: true
    };

    component.pizzas = [pizza1];
    component.calculateTotalPrice(pizza1);

    expect(component.totalPrice).toBe(5); // discounted price
  });

  it('should place an order with the selected pizza and toppings', () => {
    const selectedPizza: Order = {
      size: { name: 'Small', price: 5 },
      vegToppings: [{ name: 'Tomato', price: 1, type: 'veg', isAdded: true }],
      nonVegToppings: [],
      beforeDiscount: 6,
      discountedPrice: 5,
      offerName: '10% off',
      quantity: 1,
      isChoosen: true
    };

    component.selectedPizza = selectedPizza;
    component.selectedSize = { name: 'Small', price: 5 };
    component.quantity = 1;
    component.placeOrder();

    expect(orderServiceMock.placeOrder).toHaveBeenCalledWith(
      1,
      { name: 'Small', price: 5 },
      [selectedPizza.vegToppings[0]],
      [],
      {
        beforeDiscount: 6,
        discount: 5
      }
    );
  });

  it('should clear pizzas array when order is canceled', () => {
    component.pizzas = [{ size: { name: 'Small', price: 5 }, vegToppings: [], nonVegToppings: [], beforeDiscount: 5, discountedPrice: 5, offerName: '', quantity: 1, isChoosen: false }];
    component.cancelOrder();
    expect(component.pizzas.length).toBe(0);
  });
});
