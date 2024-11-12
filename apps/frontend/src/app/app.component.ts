import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from '@demo-shop/navigation';
import { CartComponent } from '@demo-shop/cart';
import { AppStore } from './+state/app.store';

@Component({
  standalone: true,
  imports: [RouterModule, NavigationComponent, CartComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #appStore = inject(AppStore);
  readonly initialized = this.#appStore.initialized;
}
