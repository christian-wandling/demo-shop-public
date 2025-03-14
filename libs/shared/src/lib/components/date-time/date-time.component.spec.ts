import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateTimeComponent } from './date-time.component';

describe('TimeComponent', () => {
  let component: DateTimeComponent;
  let fixture: ComponentFixture<DateTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateTimeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DateTimeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('dateTime', new Date());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
