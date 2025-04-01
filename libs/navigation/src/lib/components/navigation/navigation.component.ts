import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { NavigationType } from '../../enums/navigation-type';
import { ProductSearchComponent } from '@demo-shop/product';
import { animateBackdrop, animateSlideOver } from './navigation.animations';
import { UserNavigationComponent } from './user-navigation/user-navigation.component';
import { CartIconComponent } from '@demo-shop/cart';
import { RouteItem } from '../../models/route-item';

/**
 * NavigationComponent is responsible for rendering the main navigation of the application.
 * It includes links to various sections, user-related actions, and a cart icon.
 *
 * @example
 * <lib-navigation/>
 */
@Component({
  selector: 'lib-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgOptimizedImage,
    ProductSearchComponent,
    UserNavigationComponent,
    CartIconComponent,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [animateBackdrop, animateSlideOver],
  host: {
    class: 'bg-white top-0 z-40 sticky',
    '(window:resize)': 'this.mobileMenuOpen.set(false);',
  },
})
export class NavigationComponent {
  readonly mobileMenuOpen = signal(false);
  readonly selectedMenuItem = signal('products');
  readonly #navigationService = inject(NavigationService);
  readonly menuItems = this.#navigationService.getFilteredItems(NavigationType.ROUTE) as RouteItem[];
}
