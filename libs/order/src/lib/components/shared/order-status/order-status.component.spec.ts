import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderStatusComponent } from './order-status.component';
import { signal } from '@angular/core';
import { OrderStatus } from '@demo-shop/api';

describe('OrderMetaComponent', () => {
  let component: OrderStatusComponent;
  let fixture: ComponentFixture<OrderStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderStatusComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('status', OrderStatus.Created);
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
