import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RoutesRecognized,
} from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  filter,
  map,
  mergeMap,
  of,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit, OnDestroy {
  routeData = new BehaviorSubject<Record<string, unknown>>(null);

  routerEventsSub: Subscription;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeData.next(this.route?.snapshot?.firstChild?.data);

    this.routerEventsSub = this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => {
          let route = this.route.firstChild;
          let child = route;

          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
              route = child;
            } else {
              child = null;
            }
          }

          return route;
        }),
        mergeMap((route) => route?.data || of(null))
      )
      .subscribe((data) => this.routeData.next(data));

    this.routeData.subscribe((data) => {
      console.log('route data', data);
    });
  }

  ngOnDestroy(): void {
    this.routeData.complete();
    this.routerEventsSub.unsubscribe();
  }
}
