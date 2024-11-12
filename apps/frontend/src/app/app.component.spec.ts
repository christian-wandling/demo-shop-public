import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppStore } from './+state/app.store';
import { Component, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NavigationComponent } from '@demo-shop/navigation';
import { CartComponent } from '@demo-shop/cart';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const appStoreStub = {
    initialized: signal(false),
  };

  // eslint-disable-next-line @angular-eslint/component-selector
  @Component({ standalone: true, selector: 'lib-navigation', template: '' })
  class NavigationStubComponent {}

  // eslint-disable-next-line @angular-eslint/component-selector
  @Component({ standalone: true, selector: 'lib-cart', template: '' })
  class CartStubComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: AppStore, useValue: appStoreStub }, provideRouter([])],
      imports: [AppComponent],
    })
      .overrideComponent(AppComponent, {
        remove: { imports: [NavigationComponent, CartComponent] },
        add: { imports: [NavigationStubComponent, CartStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display navigation and cart before initialization', () => {
    expect(component.initialized()).toBe(false);
    expect(fixture).toMatchSnapshot();
  });

  it('should display navigation and cart before initialization', () => {
    appStoreStub.initialized.set(true);
    fixture.detectChanges();

    expect(component.initialized()).toBe(true);
    expect(fixture.debugElement.query(By.css('lib-navigation'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('lib-cart'))).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
