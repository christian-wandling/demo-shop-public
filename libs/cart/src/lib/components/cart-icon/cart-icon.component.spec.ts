import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartIconComponent } from './cart-icon.component';
import { CartFacade } from '../../cart.facade';

describe('CartIconComponent', () => {
  let component: CartIconComponent;
  let fixture: ComponentFixture<CartIconComponent>;
  let cartFacade: CartFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartIconComponent],
      providers: [
        {
          provide: CartFacade,
          useValue: { getItemCount: jest.fn, setShowCart: jest.fn() },
        },
      ],
    }).compileComponents();

    cartFacade = TestBed.inject(CartFacade);
    fixture = TestBed.createComponent(CartIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should match the snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should show the cart', () => {
    component.showCart();

    expect(cartFacade.setShowCart).toHaveBeenCalledWith(true);
  });
});
