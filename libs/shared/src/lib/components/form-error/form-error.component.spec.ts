import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormErrorComponent } from './form-error.component';
import { CommonModule } from '@angular/common';

describe('FormErrorComponent', () => {
  let component: FormErrorComponent;
  let fixture: ComponentFixture<FormErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormErrorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('errors', null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default field name as "Field"', () => {
    expect(component.fieldName()).toBe('Field');
  });

  it('should display custom field name', () => {
    fixture.componentRef.setInput('fieldName', 'Email');
    fixture.detectChanges();
    expect(component.fieldName()).toBe('Email');
  });

  it('should show required error message when required error is present', () => {
    fixture.componentRef.setInput('fieldName', 'Username');
    fixture.componentRef.setInput('errors', { required: true });

    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Username is required');
  });

  it('should show email error message when email error is present', () => {
    fixture.componentRef.setInput('errors', { email: true });

    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Email invalid');
  });

  it('should show all applicable error messages when multiple errors are present', () => {
    fixture.componentRef.setInput('fieldName', 'Email');
    fixture.componentRef.setInput('errors', {
      required: true,
      email: true,
    });

    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Email is required');
    expect(compiled.textContent).toContain('Email invalid');
  });

  it('should not show any error messages when errors is null', () => {
    fixture.componentRef.setInput('errors', null);

    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toBe('');
  });

  it('should have the correct host classes', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.classList.contains('text-xs')).toBeTruthy();
    expect(compiled.classList.contains('text-red-600')).toBeTruthy();
  });

  describe('Snapshots', () => {
    it('should match snapshot with required error', () => {
      fixture.componentRef.setInput('fieldName', 'Username');
      fixture.componentRef.setInput('errors', { required: true });

      fixture.detectChanges();
      expect(fixture.nativeElement).toMatchSnapshot();
    });

    it('should match snapshot with email error', () => {
      fixture.componentRef.setInput('fieldName', 'Email');
      fixture.componentRef.setInput('errors', { email: true });

      fixture.detectChanges();
      expect(fixture.nativeElement).toMatchSnapshot();
    });

    it('should match snapshot with multiple errors', () => {
      fixture.componentRef.setInput('fieldName', 'Email');
      fixture.componentRef.setInput('errors', {
        required: true,
        email: true,
      });

      fixture.detectChanges();
      expect(fixture.nativeElement).toMatchSnapshot();
    });

    it('should match snapshot with no errors', () => {
      fixture.componentRef.setInput('fieldName', 'Email');
      fixture.componentRef.setInput('errors', null);

      fixture.detectChanges();
      expect(fixture.nativeElement).toMatchSnapshot();
    });
  });
});
