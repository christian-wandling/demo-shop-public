import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ImagePlaceholderComponent } from './image-placeholder.component';
import { RandomColorDirective } from '../../directives/random-color.directive';

describe('ImagePlaceholderComponent', () => {
  let component: ImagePlaceholderComponent;
  let fixture: ComponentFixture<ImagePlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagePlaceholderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImagePlaceholderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the input text', () => {
    const testText = 'Sample Placeholder Text';
    component.text = testText;
    fixture.detectChanges();

    const placeholderElement = fixture.debugElement.query(By.css('.placeholder-text'));
    expect(placeholderElement.nativeElement.textContent.trim()).toBe(testText);
  });

  it('should have RandomColorDirective applied', () => {
    const directive = fixture.debugElement.injector.get(RandomColorDirective);
    expect(directive).toBeTruthy();
  });
});
