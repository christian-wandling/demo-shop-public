import { animate, style, transition, trigger } from '@angular/animations';

export const animateBackdrop = trigger('animateBackdrop', [
  transition(':enter', [style({ opacity: 0 }), animate('300ms linear', style({ opacity: 1 }))]),
  transition(':leave', [style({ opacity: 1 }), animate('300ms linear', style({ opacity: 0 }))]),
]);

export const animateSlideOver = trigger('animateSlideOver', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)' }),
    animate('300ms ease-in-out', style({ transform: 'translateX(0)' })),
  ]),
  transition(':leave', [
    style({ transform: 'translateX(0)' }),
    animate('300ms ease-in-out', style({ transform: 'translateX(-100%)' })),
  ]),
]);
