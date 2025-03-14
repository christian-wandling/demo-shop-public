import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ImagePlaceholderComponent } from '@demo-shop/shared';
import { NavigationService } from '../../services/navigation.service';
import { NavigationType } from '../../enums/navigation-type';
import { RouteItem } from '../../models/navigation-item';
import { ProductFacade, ProductSearchComponent } from '@demo-shop/product';
import { animateBackdrop, animateFlyoutMenu, animateSlideOver } from './navigation.animations';
import { UserNavigationComponent } from './user-navigation/user-navigation.component';
import { CartIconComponent } from '@demo-shop/cart';

@Component({
  selector: 'lib-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgOptimizedImage,
    ImagePlaceholderComponent,
    ProductSearchComponent,
    UserNavigationComponent,
    CartIconComponent,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [animateBackdrop, animateSlideOver, animateFlyoutMenu],
  host: {
    class: 'bg-white',
    '(window:resize)': 'this.mobileMenuOpen.set(false);',
  },
})
export class NavigationComponent {
  readonly mobileMenuOpen = signal(false);
  readonly selectedMenuItem = signal('products');
  readonly flyoutMenuOpen = signal(false);

  readonly #productFacade = inject(ProductFacade);
  readonly #router = inject(Router);
  readonly #navigationService = inject(NavigationService);

  readonly flyoutMenuItems = this.#navigationService.getFilteredItems(NavigationType.FLYOUT);
  readonly menuItems = this.#navigationService.getFilteredItems(NavigationType.ROUTE) as RouteItem[];

  setProductCategory(category: string): void {
    this.#productFacade.setFilter({
      categories: category,
    });

    this.#router.navigateByUrl('/products');
  }
}
