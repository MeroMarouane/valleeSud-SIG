import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AngularOpenlayersModule,
  LayerVectorComponent,
  MapComponent,
} from 'ngx-ol';
import { MaterialModule, PrimeNgModules, Required } from 'shared-ui';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Style, Stroke, Fill } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import ToolTip from 'ol-ext/overlay/ToolTip';
import { Mission, MissionsService, Orthophoto, TWO_D_ROUTE } from 'core';
import { environment } from 'src/environments/environment';
import { MissionFilesSwitchComponent } from '../mission-files-switch/mission-files-switch.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-missions-map',
  standalone: true,
  imports: [
    CommonModule,
    AngularOpenlayersModule,
    MaterialModule,
    PrimeNgModules,
    MissionFilesSwitchComponent,
  ],
  templateUrl: './missions-map.component.html',
  styleUrls: ['./missions-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionsMapComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  @Input() mapId = 'missionsMap';

  @Input() mission: Mission | null = null;
  show3dButton$ = new BehaviorSubject(false);
  orthophotos = new Map<string, Orthophoto>();

  @Input()
  @Required
  projectGeometry: Feature;

  @Input()
  @Required
  currentRoute: string;

  readonly GEOSERVER = environment.GEOSERVER;

  @ViewChild(MapComponent, { static: true })
  private _map: MapComponent;
  get map() {
    return this._map.instance;
  }

  @ViewChild('polygonsLayer', { static: true })
  private _polygonsLayer: LayerVectorComponent;
  get polygonsLayer() {
    return this._polygonsLayer.instance as VectorLayer<VectorSource>;
  }

  toolTip = new ToolTip();

  distanceInteractionStyle = new Style({
    stroke: new Stroke({
      color: '#333',
      width: 2,
      lineDash: [8, 8],
    }),
  });

  areaInteractionStyle = new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
    stroke: new Stroke({
      color: '#333',
      width: 2,
      lineDash: [8, 8],
    }),
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({
        color: '#333',
      }),
    }),
  });

  missionFilesBtnOpen = false;
  orthophotoVisible = false;

  distanceMeasure = false;
  areaMeasure = false;

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

  subscriptions: Subscription[] = [];
  constructor(
    private readonly missionsService: MissionsService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const sub = this.missionsService.selectedMission$.subscribe((mission) => {
      console.log('ngOnInit mission selected', mission);
      this.mission = mission;
      this.show3dButton$.next(!!this.mission);
    });
    this.subscriptions.push(sub);
    this.show3dButton$.next(!!this.mission);
  }

  ngAfterViewInit(): void {
    this.polygonsLayer.getSource()?.clear();
    this.polygonsLayer.getSource()?.addFeature(this.projectGeometry);
    const extent = this.projectGeometry.getGeometry().getExtent();

    this.map.getView().fit(extent, {
      padding: [50, 50, 50, 50],
      maxZoom: 15,
    });

    this.map.addOverlay(this.toolTip);
  }

  ngOnChanges(): void {
    //add the mission othophotos to the map
    console.log('ngOnchanges mission', this.mission);
    this.orthophotos.clear();
    this.show3dButton$.next(!!this.mission);

    this.mission?.orthophotos?.forEach((ortho) => {
      this.orthophotos.set(ortho.type, ortho);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  setLayer(name: string) {
    Object.keys(this.mapLayers)?.forEach((key) => {
      if (key === name) this.mapLayers[key].visibility = true;
      else this.mapLayers[key].visibility = false;
    });
  }

  togglePolygonsLayer() {
    this.polygonsLayer.setVisible(!this.polygonsLayer.getVisible());
  }

  toggleDistanceMeasure() {
    this.areaMeasure = false;
    this.distanceMeasure = !this.distanceMeasure;
  }

  toggleAreaMeasure() {
    this.distanceMeasure = false;
    this.areaMeasure = !this.areaMeasure;
  }

  goto3d() {
    if (this.mission) {
      localStorage.setItem(
        TWO_D_ROUTE,
        `${this.currentRoute}/${this.mission.site.id}`
      );
      this.router.navigate(['/threed', this.mission.id]);
    }
  }
}
