import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule, Required, SharedUiModule } from 'shared-ui';
import OlMap from 'ol/Map';
import { Mission, Orthophoto, OrthophotoTypes } from 'core';
import {Tile} from 'ol/layer';
import { TileWMS } from 'ol/source';
import { environment } from 'src/environments/environment';
import { Feature } from 'ol';
import Swipe from 'ol-ext/control/Swipe';

@Component({
  selector: 'app-mission-files-switch',
  standalone: true,
  imports: [CommonModule, MaterialModule, SharedUiModule],
  templateUrl: './mission-files-switch.component.html',
  styleUrls: ['./mission-files-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionFilesSwitchComponent implements OnInit, OnChanges {
  @Input() @Required map: OlMap;
  @Input() @Required siteFeature: Feature;
  @Input() mission: Mission | null = null;
  @Input() swipeCtrl: Swipe;
  @Input() swipeRight = false;

  imageLayer: Tile<TileWMS>;

  currentFile: OrthophotoTypes = null;

  missionFilesBtnOpen = false;
  GEOSERVER_URL = environment.GEOSERVER;

  constructor() {}

  ngOnInit(): void {
    this.imageLayer = new Tile({
      zIndex: 10,
      visible: true,
    });
    this.map.addLayer(this.imageLayer);
    if(this.swipeCtrl) {
      this.swipeCtrl.addLayer(this.imageLayer, this.swipeRight);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mission) {
      this.resetLayer();
      this.setOrtho(changes.mission.currentValue);
    }
  }

  resetLayer() {
    console.log('Resetting layer ...');
    this.currentFile = null;
    this.imageLayer?.setSource(null);
    this.imageLayer?.setVisible(false);
  }

  setOrtho(file: Orthophoto) {
    if (this.currentFile === file?.type) {
      this.resetLayer();
    } else {
      if(!file?.type) return;

      this.currentFile = file.type;
      this.imageLayer.setVisible(true);

      const wmsSource = new TileWMS({
        url: `${this.GEOSERVER_URL}/${file.workspace}/wms?layers=${file.url}`,
        params: {
          LAYERS: file.url,
        },
        serverType: 'geoserver',
      });
      this.imageLayer.setSource(wmsSource);
    }
  }
}
