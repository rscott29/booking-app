import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, Routes } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { MenuItems } from '../../home/home.component';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private currentRouteSubject = new BehaviorSubject<string | null>(null);
  public currentRoute$ = this.currentRouteSubject.asObservable();
  constructor(private router: Router) {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        const urlSegments = this.router.url.split('/');
        const routeParts = urlSegments.filter((segment) => segment.length > 1);
        this.currentRouteSubject.next(routeParts.join(' '));
      });
  }

  getAllRoutes(): MenuItems[]  {
    return  [
      {
        name: 'Photos',
        icon: 'photo_camera',
        link: '/home',
      },
      {
        name: 'foo',
        icon: 'cookie',
        link: '/foo',
      },
      {
        name: 'Recipes',
        icon: 'cookie',
        link: '/foo/test',
      },
      {
        name: 'Work',
        icon: 'group',
        link: '/bar',
      },
      {
        name: 'Work',
        icon: 'group',
        link: '/bar',
      },
      {
        name: 'Work',
        icon: 'group',
        link: '/bar',
      },
      {
        name: 'Work',
        icon: 'group',
        link: '/bar',
      },
      {
        name: 'Work',
        icon: 'group',
        link: '/bar',
      },
      {
        name: 'Work',
        icon: 'group',
        link: '/bar',
      },
      {
        name: 'Work',
        icon: 'group',
        link: '/bar',
      },
      {
        name: 'Work',
        icon: 'group',
        link: '/bar',
      },
      {
        name: 'Work',
        icon: 'group',
        link: '/bar',
      },
      
    ];
  }

}
