import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mission, Site, SitesService } from 'core';
import { LayerVectorComponent, MapComponent } from 'ngx-ol';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription, of, switchMap } from 'rxjs';
import Swipe from 'ol-ext/control/Swipe';
import {  WKT } from 'ol/format';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';

@Component({
  selector: 'app-maps-balayer',
  templateUrl: './maps-balayer.component.html',
  styleUrls: ['./maps-balayer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapsBalayerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MapComponent, { static: true })
  _map: MapComponent;
  get map() {
    return this._map.instance;
  }
  @ViewChild('polygonsLayer', { static: true })
  private _polygonsLayer: LayerVectorComponent;
  get polygonsLayer() {
    return this._polygonsLayer.instance as VectorLayer<VectorSource>;
  }

  swipeCtrl = new Swipe();

  site$ = new BehaviorSubject<Site>(null);

  subscritptions: Subscription[] = [];

  missionAFilesBtnOpen = false;

  siteFeature$ = new BehaviorSubject<Feature>(null);

  missions: Mission[] = [];

  menuOpen = false;
  mapLayers = {
    Plan: {
      name: 'Plan',
      layer: 'OSM',
      visibility: true,
    },
    Terrain: {
      name: 'Terrain',
      layer: 'terrain',
      visibility: false,
    },
    Satellite: {
      name: 'Satellite',
      layer: 'satellite',
      visibility: false,
    },
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly sitesService: SitesService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    const sub = this.route.params
      .pipe(
        switchMap((params) => {
          const siteId = params['siteId'];
          if (siteId) {
            return this.sitesService.getByKey(siteId);
          }
          this.toastr.error('Site Introuvable!', 'Erreur');
          return of(null);
        })
      )
      .subscribe((site) => {
        if (site) {
          this.site$.next(site);
        }
      });
    this.subscritptions.push(sub);
  }

  ngOnDestroy(): void {
    this.site$.complete();
    this.siteFeature$.complete();
    this.subscritptions.forEach((sub) => sub.unsubscribe());
  }

  setLayer(name: string) {
    Object.keys(this.mapLayers).forEach((key) => {
      if (key === name) this.mapLayers[key].visibility = true;
      else this.mapLayers[key].visibility = false;
    });
  }

  setSite() {
    const sub = this.site$.subscribe((site) => {
      if (site) {
        const feature = new WKT().readFeature(site.geom);
        this.siteFeature$.next(feature);
        if (feature) {
          this.polygonsLayer.getSource()?.clear();
          this.polygonsLayer.getSource()?.addFeature(feature);
          const extent = feature.getGeometry().getExtent();

          this.map.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            maxZoom: 15,
          });
        }
      }
    });
    this.subscritptions.push(sub);
  }

  missionsChange(missions: Mission[]) {
    this.missions = missions;
    console.log('maps balayer missions change', missions);
  }

  ngAfterViewInit(): void {
    this.setSite();


    // Control
    const ctrl = this.swipeCtrl;
    this.map.addControl(ctrl);

    const swipElement = document.querySelector('.ol-swipe');
    if (swipElement) {
      const container = document.createElement('div');
      container.style.position = 'relative';

      const a_mark = document.createElement('div');
      a_mark.classList.add('a-mark');
      a_mark.appendChild(document.createTextNode('A'));

      const b_mark = document.createElement('div');
      b_mark.classList.add('b-mark');
      b_mark.appendChild(document.createTextNode('B'));

      container.append(a_mark, b_mark);
      swipElement.appendChild(container);
    }
  }
}
