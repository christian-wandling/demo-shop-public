import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationComponent } from './navigation.component';
import { NavigationService } from '../../services/navigation.service';
import { provideRouter, Router } from '@angular/router';
import { NavigationType } from '../../enums/navigation-type';
import { BrowserAnimationsModule, provideNoopAnimations } from '@angular/platform-browser/animations';
import { NavigationItem } from '../../models/navigation-item';
import { ProductFacade, ProductSearchComponent } from '@demo-shop/product';
import { Component, Input } from '@angular/core';
import { CartIconComponent } from '@demo-shop/cart';
import { UserNavigationComponent } from './user-navigation/user-navigation.component';
import { ImagePlaceholderComponent } from '@demo-shop/shared';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let navigationService: NavigationService;
  let router: Router;
  let productFacade: ProductFacade;

  @Component({ standalone: true, selector: 'lib-image-placeholder', template: '' })
  class ImagePlaceholderStubComponent {
    @Input() text = '';
  }

  @Component({ standalone: true, selector: 'lib-product-search', template: '' })
  class ProductSearchStubComponent {}

  @Component({ standalone: true, selector: 'lib-user-navigation', template: '' })
  class UserNavigationStubComponent {}

  @Component({ standalone: true, selector: 'lib-cart-icon', template: '' })
  class CartIconStubComponent {}

  const mockFlyoutItems: NavigationItem[] = [
    {
      type: NavigationType.FLYOUT,
      label: 'Flyout1',
      order: 1,
      subItems: [
        {
          type: NavigationType.ROUTE,
          options: {
            route: 'sub1',
            permissionStrategy: undefined,
            query: undefined,
          },
          label: 'Sub1',
          order: 101,
        },
      ],
    },
    {
      type: NavigationType.FLYOUT,
      label: 'Flyout2',
      order: 2,
    },
  ];

  const mockRouteItems = [
    {
      type: NavigationType.ROUTE,
      options: {
        route: 'route1',
        permissionStrategy: undefined,
        query: undefined,
      },
      label: 'Route1',
      order: 11,
    },
    {
      type: NavigationType.ROUTE,
      options: {
        route: 'route2',
        permissionStrategy: undefined,
        query: undefined,
      },
      label: 'Route2',
      order: 12,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationComponent, BrowserAnimationsModule],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        {
          provide: NavigationService,
          useValue: {
            getFilteredItems: jest
              .fn()
              .mockImplementation(type => (type === NavigationType.FLYOUT ? mockFlyoutItems : mockRouteItems)),
          },
        },
        { provide: ProductFacade, useValue: { setFilter: jest.fn() } },
        Router,
      ],
    })
      .overrideComponent(NavigationComponent, {
        remove: {
          imports: [ImagePlaceholderComponent, ProductSearchComponent, UserNavigationComponent, CartIconComponent],
        },
        add: {
          imports: [
            ImagePlaceholderStubComponent,
            ProductSearchStubComponent,
            UserNavigationStubComponent,
            CartIconStubComponent,
          ],
        },
      })
      .compileComponents();

    navigationService = TestBed.inject(NavigationService);
    router = TestBed.inject(Router);
    productFacade = TestBed.inject(ProductFacade);
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.mobileMenuOpen()).toBeFalsy();
    expect(component.selectedMenuItem()).toBe('clothing');
    expect(component.flyoutMenuOpen()).toBeFalsy();
  });

  it('should fetch flyout menu items on init', () => {
    expect(navigationService.getFilteredItems).toHaveBeenCalledWith(NavigationType.FLYOUT);
    expect(component.flyoutMenuItems).toEqual(mockFlyoutItems);
  });

  it('should fetch route menu items on init', () => {
    expect(navigationService.getFilteredItems).toHaveBeenCalledWith(NavigationType.ROUTE);
    expect(component.menuItems).toEqual(mockRouteItems);
  });

  it('should navigate to correct category when setCategory is called', () => {
    jest.spyOn(router, 'navigateByUrl');
    const testCategory = 'test-category';

    component.setProductCategory(testCategory);

    expect(productFacade.setFilter).toHaveBeenCalledWith({ categories: testCategory });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/products');
  });

  it('should close mobile menu on window resize', () => {
    component.mobileMenuOpen.set(true);

    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();

    expect(component.mobileMenuOpen()).toBeFalsy();
  });

  describe('snapshots', () => {
    it('should match snapshot with default state', () => {
      expect(fixture.nativeElement).toMatchSnapshot();
    });

    it('should match snapshot with mobile menu open', () => {
      component.mobileMenuOpen.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement).toMatchSnapshot();
    });

    it('should match snapshot with flyout menu open', () => {
      component.flyoutMenuOpen.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement).toMatchSnapshot();
    });
  });
});
