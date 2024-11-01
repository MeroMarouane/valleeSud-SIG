import { AfterContentInit, Component, EventEmitter, forwardRef, Host, Input, Optional, Output } from '@angular/core';
import { OSM, Stamen } from 'ol/source';
import { AttributionLike } from 'ol/source/Source';
import { TileSourceEvent } from 'ol/source/Tile';
import { LoadFunction } from 'ol/Tile';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceComponent } from './source.component';
import { SourceXYZComponent } from './xyz.component';

@Component({
  selector: 'aol-source-stamen',
  template: ` <div class="aol-source-stamen"></div> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceStamenComponent) }],
})
export class SourceStamenComponent extends SourceXYZComponent implements AfterContentInit {
  @Input()
  attributions: AttributionLike;
  @Input()
  cacheSize: number;
  @Input()
  crossOrigin: string;
  @Input()
  maxZoom: number;
  @Input()
  opaque: boolean;
  @Input()
  reprojectionErrorThreshold: number;
  @Input()
  tileLoadFunction: LoadFunction;
  @Input()
  url: string;
  @Input()
  wrapX: boolean;
  @Input()
  stamenLayer: string;

  @Output()
  tileLoadStart = new EventEmitter<TileSourceEvent>();
  @Output()
  tileLoadEnd = new EventEmitter<TileSourceEvent>();
  @Output()
  tileLoadError = new EventEmitter<TileSourceEvent>();

  instance: Stamen;

  constructor(
    @Optional()
    @Host()
    protected layer?: LayerTileComponent
  ) {
    super(layer);
  }

  ngAfterContentInit() {
    if (this.tileGridXYZ) {
      this.tileGrid = this.tileGridXYZ.instance;
    }
    this.instance = new Stamen({...this, layer: this.stamenLayer});
    this.instance.on('tileloadstart', (event: TileSourceEvent) => this.tileLoadStart.emit(event));
    this.instance.on('tileloadend', (event: TileSourceEvent) => this.tileLoadEnd.emit(event));
    this.instance.on('tileloaderror', (event: TileSourceEvent) => this.tileLoadError.emit(event));
    this.register(this.instance);
  }
}
