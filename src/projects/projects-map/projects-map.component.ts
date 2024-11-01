import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { SitesService } from 'core';
import {
  LayerVectorComponent,
  MapComponent,
  SourceClusterComponent,
  SourceVectorComponent,
} from 'ngx-ol';
import { Feature, MapBrowserEvent } from 'ol';
import { boundingExtent, getCenter } from 'ol/extent';
import { GeoJSON, WKT } from 'ol/format';
import { LineString, Point, Polygon } from 'ol/geom';
import { Fill, Stroke, Style, Text } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { click } from 'ol/events/condition';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Cluster } from 'ol/source';
import { environment } from 'src/environments/environment';
import Popup from 'ol-ext/overlay/Popup';
import { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'app-projects-map',
  templateUrl: './projects-map.component.html',
  styleUrls: ['./projects-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsMapComponent implements AfterViewInit {
  mapCenter: [number, number] = [-114575431300.73878, 3475766.6239057416];
  mapZoom = 6;
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

  @Input() mapId = 'projects-map';

  @ViewChild(MapComponent, { static: true })
  _map: MapComponent;
  get map() {
    return this._map.instance;
  }

  @ViewChild('clustersLayer', { static: true })
  _clustersLayer: LayerVectorComponent;
  get clustersLayer() {
    return this._clustersLayer.instance as VectorLayer<Cluster>;
  }

  @ViewChild('polygonsLayer', { static: true })
  _polygonsLayer: LayerVectorComponent;
  get polygonsLayer() {
    return this._polygonsLayer.instance as VectorLayer<VectorSource>;
  }

  @ViewChild(SourceClusterComponent, { static: true })
  _clusterSource: SourceClusterComponent;
  get clusterSource() {
    return this._clusterSource.instance;
  }

  @ViewChild(SourceVectorComponent, { static: true })
  _clustersVectorSource: SourceVectorComponent;
  get clustersVectorSource() {
    return this._clustersVectorSource.instance;
  }

  format = new GeoJSON();

  sitesFeaturesUrl = environment.apiUrl + '/getGeomAllSites';

  eventClickCondition = click;

  popup = new Popup({
    positioning: 'bottom-center',
    autoPan: true,
    autoPanAnimation: { duration: 250 },
    popupClass: 'default anim',
  });

  clusterStyle = (feature: Feature) => {
    const size = feature.get('features')?.length || 0;
    const text = size > 1 ? size.toString() : '';
    let style = new Style({
      image: new CircleStyle({
        radius: 10,
        stroke: new Stroke({
          color: '#fff',
          width: 2,
        }),
        fill: new Fill({
          color: '#FFC300',
        }),
      }),
      text: new Text({
        text,
        fill: new Fill({
          color: '#fff',
        }),
      }),
    });
    return style;
  };

  geometryFunction = (feature: Feature) => {
    const geometry = feature.getGeometry();
    const type = geometry.getType();

    if (type == 'Point') {
      return geometry as Point;
    }
    if (type == 'LineString') {
      return new Point((geometry as LineString).getCoordinateAt(0.5));
    } else if (type == 'Polygon') {
      return (geometry as Polygon).getInteriorPoint();
    } else {
      return new Point(getCenter(feature.getGeometry().getExtent()));
    }
  };

  constructor(private readonly siteService: SitesService) {}

  ngAfterViewInit(): void {
    this.map.addOverlay(this.popup);

    this.siteService.entities$.subscribe((sites) => {
      this.clustersVectorSource.clear();
      if (sites.length) {
        const features: Feature[] = [];
        const format = new WKT();

        sites.forEach((site) => {
          if (site.geom) {
            const projectFeature = format.readFeature(site.geom);
            console.log('projectFeatures', projectFeature);
            if (projectFeature) {
              projectFeature.set('title', site.title);
              projectFeature.set('id', site.id);
              features.push(projectFeature);
            }
          }
        });
        if (features.length > 0) {
          this.clustersVectorSource.addFeatures(features);
          this.polygonsLayer.getSource()?.clear();
          this.polygonsLayer.getSource()?.addFeatures(features);
        } else {
          this.clustersVectorSource.clear();
        }
      }
    });
  }

  /**
   * If the resolution is less than 10, display the polygons layer, otherwise display the clusters layer
   */
  onChangeResolution() {
    const resolution = this.map.getView().getResolution();
    if (resolution < 18) {
      // display polygons
      this.polygonsLayer.setVisible(true);
      this.clustersLayer.setVisible(false);
    } else {
      // display clusters
      this.polygonsLayer.setVisible(false);
      this.clustersLayer.setVisible(true);
    }
  }

  showSearch() {
    console.log('Show search');
  }
  /**
   * Set the selected layer visible to true and false to the others
   * @param {string} name - The name of the layer to be set.
   */
  setLayer(name: string) {
    Object.keys(this.mapLayers).forEach((key) => {
      if (key === name) this.mapLayers[key].visibility = true;
      else this.mapLayers[key].visibility = false;
    });
  }

  /**
   * When the user clicks on the map, we check if the click is on a cluster. If it is, we zoom to the
   * extent of the cluster
   * @param event - MapBrowserEvent<MouseEvent> - The event that was triggered when the user clicked on
   * the map.
   */
  mapClick(event: MapBrowserEvent<MouseEvent>) {
    this.popup.hide();

    this.clustersLayer.getFeatures(event.pixel).then((clickedFeatures) => {
      if (clickedFeatures.length) {
        // Get clustered features
        const features: Feature[] = clickedFeatures[0].get('features');
        if (features.length > 0) {
          /* Getting the coordinates of the popup. */
          let coordinates: Coordinate;
          /* Getting the center of the extent of the features. */
          if (features.length > 1) {
            const extent = boundingExtent(
              features.map((r) => r.getGeometry().getExtent())
            );
            coordinates = getCenter(extent);
          } else {
          /* If there is only one feature, we get the coordinates of the interior point of the polygon. */
            coordinates = (features.at(0).getGeometry() as Polygon)
              .getInteriorPoint()
              .getCoordinates();
          }

          const content = document.createElement('ul');

          // Add feature info to popup content
          features.forEach((feature) => {
            const featureInfo = document.createElement('li');
            const title = feature.get('title');
            const id = feature.get('id');
            featureInfo.innerHTML = `<p>${title}</p>`;
            // Add click listener to popup content
            featureInfo.addEventListener('click', (e) => {
              this.popup.hide();
              const extent = feature.getGeometry().getExtent();
              this.map.getView().fit(extent, {
                duration: 1000,
                padding: [50, 50, 50, 50],
                maxZoom: 16,
              });
              this.siteService.setSelectedProject(id);
            });
            content.appendChild(featureInfo);
          });

          this.popup.show(coordinates, content);
        }
      }
    });
  }

  resetView() {
    // Get the map view
    const view = this.map.getView();

    // Set the center and zoom to the initial values
    view.setCenter(this.mapCenter);
    view.setZoom(this.mapZoom);
    this.siteService.setSelectedProject(null);
    this.popup.hide();
  }
}
