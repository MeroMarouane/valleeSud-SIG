import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mission, Site, SitesService } from 'core';
import { MapComponent, LayerVectorComponent } from 'ngx-ol';
import { ToastrService } from 'ngx-toastr';
import { Feature, Map } from 'ol';
import { click } from 'ol/events/condition';
import {  WKT } from 'ol/format';
import { Geometry } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Synchronize from 'ol-ext/interaction/Synchronize';
import { BehaviorSubject, switchMap, of, Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';

const mapLayers = {
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

declare type MapLayers = typeof mapLayers;

@Component({
  selector: 'app-maps-synchronize',
  templateUrl: './maps-synchronize.component.html',
  styleUrls: ['./maps-synchronize.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapsSynchronizeComponent implements OnInit, OnDestroy {
  @ViewChild('mapA', { static: true })
  _mapA: MapComponent;
  get mapA() {
    return this._mapA.instance;
  }
  @ViewChild('mapB', { static: true })
  _mapB: MapComponent;
  get mapB() {
    return this._mapB.instance;
  }

  @ViewChild('mapA_polygonsLayer', { static: true })
  private _polygonsLayerA: LayerVectorComponent;
  get polygonsLayerA() {
    return this._polygonsLayerA.instance as VectorLayer<VectorSource>;
  }
  @ViewChild('mapB_polygonsLayer', { static: true })
  private _polygonsLayerB: LayerVectorComponent;
  get polygonsLayerB() {
    return this._polygonsLayerB.instance as VectorLayer<VectorSource>;
  }
  site$ = new BehaviorSubject<Site>(null);
  siteFeature$ = new BehaviorSubject<Feature>(null);

  missions: Mission[] = [];

  missionAFilesBtnOpen = false;
  missionBFilesBtnOpen = false;

  menuAOpen = false;
  mapALayers: MapLayers = mapLayers;
  menuBOpen = false;
  mapBLayers: MapLayers = cloneDeep(mapLayers);

  subscriptions: Subscription[] = [];

  clickCondition = click;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly sitesService: SitesService,
    private readonly toastr: ToastrService
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
    this.subscriptions.push(sub);
  }

  missionsChange(missions: Mission[]) {
    this.missions = missions;
  }

  setLayer(name: string, mapLayer: MapLayers) {
    Object.keys(mapLayer).forEach((key) => {
      if (key === name) mapLayer[key].visibility = true;
      else mapLayer[key].visibility = false;
    });
  }

  setSite() {
    const sub = this.site$.subscribe((site) => {
      if (site) {
        console.log('setting site feature on maps ...');
        const feature = new WKT().readFeature(site.geom);
        this.siteFeature$.next(feature);
        if (feature) {
          this.setSiteOnMap(this.mapA, feature, this.polygonsLayerA);
          this.setSiteOnMap(this.mapB, feature, this.polygonsLayerB);
        }
      }
    });
    this.subscriptions.push(sub);
  }

  setSiteOnMap(
    map: Map,
    feature: Feature,
    layer: VectorLayer<VectorSource<Geometry>>
  ) {
    layer.getSource()?.clear();
    layer.getSource()?.addFeature(feature);
    const extent = feature.getGeometry().getExtent();

    map.getView().fit(extent, {
      padding: [50, 50, 50, 50],
      maxZoom: 15,
    });
    console.log('site feature set for map', map);
  }

  ngAfterViewInit(): void {
    this.setSite();

    // Synchronize the maps
    this.mapA.addInteraction(new Synchronize({ maps: [this.mapB] }));
    this.mapB.addInteraction(new Synchronize({ maps: [this.mapA] }));
  }

  ngOnDestroy(): void {
    this.site$.complete();
    this.siteFeature$.complete();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
