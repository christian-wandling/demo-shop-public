import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSearchComponent } from './product-search.component';
import { ProductFacade } from '../../product.facade';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ProductSearchComponent', () => {
  let component: ProductSearchComponent;
  let fixture: ComponentFixture<ProductSearchComponent>;
  let productFacade: ProductFacade;
  let router: Router;

  const productFilter = signal({});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSearchComponent],
      providers: [
        {
          provide: ProductFacade,
          useValue: {
            setFilter: jest.fn(),
            getFilter: jest.fn().mockReturnValue(productFilter),
          },
        },
        provideRouter([]),
      ],
    }).compileComponents();

    productFacade = TestBed.inject(ProductFacade);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ProductSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should match the snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should set the product name filter', () => {
    component.setProductNameFilter('name');

    expect(productFacade.setFilter).toHaveBeenCalledWith({ name: 'name' });
  });

  it('should got to the products page', () => {
    jest.spyOn(router, 'navigateByUrl');
    component.goToProductPage();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/products');
  });

  describe('search input', () => {
    it('should call setProductNameFilter on input change', () => {
      const input = fixture.debugElement.query(By.css('input'));
      fixture.detectChanges();

      input.nativeElement.value = 'test';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(productFacade.setFilter).toHaveBeenCalledWith({ name: 'test' });
    });

    it('should call goToProductPage when Enter is pressed', () => {
      jest.spyOn(router, 'navigateByUrl');
      const input = fixture.debugElement.query(By.css('input'));

      input.triggerEventHandler('keydown.enter', {});
      fixture.detectChanges();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/products');
    });

    it('should display the enter icon when a value is present', () => {
      productFilter.set({ name: 'name' });
      fixture.detectChanges();

      const enterIcon = fixture.debugElement.query(By.css('.enter-icon'));
      expect(enterIcon).toBeTruthy();
    });

    it('should not display the enter icon when product name is empty', () => {
      productFilter.set({});
      fixture.detectChanges();

      const enterIcon = fixture.debugElement.query(By.css('.enter-icon'));
      expect(enterIcon).toBeFalsy();
    });

    it('should navigate to product page when enter icon is clicked', () => {
      jest.spyOn(router, 'navigateByUrl');
      productFilter.set({ name: 'name' });
      fixture.detectChanges();

      const enterIcon = fixture.debugElement.query(By.css('.absolute.right-2'));
      enterIcon.triggerEventHandler('click', {});
      fixture.detectChanges();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/products');
    });
  });
});
