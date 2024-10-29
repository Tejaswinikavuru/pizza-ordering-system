import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PizzaService } from './pizza.service';
import { Topping } from '../models/topping.model';
import { PizzaSize } from '../models/pizza-size.model';

describe('PizzaService', () => {
  let service: PizzaService;
  let httpMock: HttpTestingController;

  const mockPizzaData = {
    toppings: [
      { name: 'Tomato', price: 1, type: 'veg', isAdded: false },
      { name: 'Mushroom', price: 1.5, type: 'veg', isAdded: false },
      { name: 'Pepperoni', price: 2, type: 'non-veg', isAdded: false },
      { name: 'Sausage', price: 2.5, type: 'non-veg', isAdded: false }
    ],
    sizes: [
      { size: 'Small', label: 'Small (10")', price: 5 },
      { size: 'Medium', label: 'Medium (12")', price: 7 },
      { size: 'Large', label: 'Large (14")', price: 9 }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PizzaService]
    });
    service = TestBed.inject(PizzaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all vegetarian toppings', (done) => {
    service.getVegToppings().subscribe((toppings: Topping[]) => {
      expect(toppings.length).toBe(2);
      expect(toppings).toEqual([
        { name: 'Tomato', price: 1, type: 'veg', isAdded: false },
        { name: 'Mushroom', price: 1.5, type: 'veg', isAdded: false }
      ]);
      done();
    });

    const req = httpMock.expectOne('assets/pizza.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockPizzaData);
  });

  it('should fetch all non-vegetarian toppings', (done) => {
    service.getNonVegToppings().subscribe((toppings: Topping[]) => {
      expect(toppings.length).toBe(2);
      expect(toppings).toEqual([
        { name: 'Pepperoni', price: 2, type: 'non-veg', isAdded: false },
        { name: 'Sausage', price: 2.5, type: 'non-veg', isAdded: false }
      ]);
      done();
    });

    const req = httpMock.expectOne('assets/pizza.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockPizzaData);
  });

  it('should fetch all pizza sizes', (done) => {
    service.getSizes().subscribe((sizes: PizzaSize[]) => {
      expect(sizes.length).toBe(3);
      expect(sizes).toEqual([
        { name: 'Small', price: 5 },
        { name: 'Medium', price: 7 },
        { name: 'Large', price: 9 }
      ]);
      done();
    });

    const req = httpMock.expectOne('assets/pizza.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockPizzaData);
  });
});
