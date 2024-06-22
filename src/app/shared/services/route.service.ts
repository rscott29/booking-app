import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private currentRouteSubject = new BehaviorSubject<string | null >(null);
  public currentRoute$ = this.currentRouteSubject.asObservable();
  constructor(private router: Router) {
    this.router.events.pipe(
      takeUntilDestroyed(),
      filter(event => event instanceof NavigationEnd)
    ).subscribe( () => {
      const urlSegments = this.router.url.split('/');
      const routeParts = urlSegments.filter(segment => segment.length > 1);
      this.currentRouteSubject.next(routeParts.join(' '));
    })
   }
}
