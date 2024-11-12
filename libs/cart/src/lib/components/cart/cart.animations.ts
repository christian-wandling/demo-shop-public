import { animate, style, transition, trigger } from '@angular/animations';

export const animateBackdrop = trigger('animateBackdrop', [
  transition(':enter', [style({ opacity: 0 }), animate('500ms ease-in-out', style({ opacity: 1 }))]),
  transition(':leave', [animate('500ms ease-in-out', style({ opacity: 0 }))]),
]);

export const animateSlideOver = trigger('animateSlideOver', [
  transition(':enter', [
    style({ transform: 'translateX(100%)' }),
    animate('700ms ease-in-out', style({ transform: 'translateX(0)' })),
  ]),
  transition(':leave', [animate('700ms ease-in-out', style({ transform: 'translateX(100%)' }))]),
]);
