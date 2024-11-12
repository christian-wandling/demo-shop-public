import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RandomColorDirective } from './random-color.directive';
import { RandomIntService } from '../services/random-int.service';
import { By } from '@angular/platform-browser';

@Component({
  template: '<div libRandomColor></div>',
  standalone: true,
  imports: [RandomColorDirective],
})
class TestComponent {}

describe('RandomColorDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let randomIntService: RandomIntService;
  let divElement: DebugElement;
  const randomInt = 4;

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      imports: [RandomColorDirective, TestComponent],
      providers: [{ provide: randomIntService, useValue: { getValue: jest.fn().mockReturnValue(randomInt) } }],
    }).createComponent(TestComponent);

    fixture.detectChanges();

    divElement = fixture.debugElement.query(By.directive(RandomColorDirective));
  });

  it('should apply the directive', () => {
    expect(divElement).toBeTruthy();
  });
});
