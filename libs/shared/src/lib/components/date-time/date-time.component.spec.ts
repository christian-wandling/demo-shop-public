import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateTimeComponent } from './date-time.component';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

describe('DateTimeComponent', () => {
  let component: DateTimeComponent;
  let fixture: ComponentFixture<DateTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateTimeComponent, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DateTimeComponent);
    component = fixture.componentInstance;

    // Set a fixed date for consistent testing
    const testDate = new Date('2025-03-16T12:00:00+00:00');
    fixture.componentRef.setInput('dateTime', testDate);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly display the formatted date', () => {
    const timeElement = fixture.debugElement.query(By.css('time')).nativeElement;
    expect(timeElement.textContent.trim()).toBe('Mar 16, 2025');
  });

  it('should handle string date input', () => {
    const stringDate = '2025-01-01T00:00:00Z';
    fixture.componentRef.setInput('dateTime', stringDate);
    fixture.detectChanges();

    const timeElement = fixture.debugElement.query(By.css('time')).nativeElement;
    expect(timeElement.textContent.trim()).toBe('Jan 01, 2025');
  });

  it('should match snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });

  describe('with different date formats', () => {
    it('should handle future dates', () => {
      const futureDate = new Date('2026-12-25T00:00:00Z');
      fixture.componentRef.setInput('dateTime', futureDate);
      fixture.detectChanges();

      const timeElement = fixture.debugElement.query(By.css('time')).nativeElement;
      expect(timeElement.textContent.trim()).toBe('Dec 25, 2026');
      expect(fixture).toMatchSnapshot('future-date');
    });

    it('should handle past dates', () => {
      const pastDate = new Date('2020-04-01T00:00:00Z');
      fixture.componentRef.setInput('dateTime', pastDate);
      fixture.detectChanges();

      const timeElement = fixture.debugElement.query(By.css('time')).nativeElement;
      expect(timeElement.textContent.trim()).toBe('Apr 01, 2020');
      expect(fixture).toMatchSnapshot('past-date');
    });
  });
});
