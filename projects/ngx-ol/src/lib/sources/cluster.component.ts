import {
  AfterContentInit,
  Component,
  ContentChild,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Feature } from 'ol';
import BaseEvent from 'ol/events/Event';
import { Point } from 'ol/geom';
import { Cluster, Vector } from 'ol/source';

import { LayerVectorComponent } from '../layers/layervector.component';
import { SourceComponent } from './source.component';
import { SourceVectorComponent } from './vector.component';

@Component({
  selector: 'aol-source-cluster',
  template: ` <ng-content></ng-content> `,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceClusterComponent) }],
})
export class SourceClusterComponent extends SourceComponent implements AfterContentInit, OnChanges {
  @Input()
  distance: number;
  @Input()
  geometryFunction?: (feature: Feature) => Point;
  @Input()
  wrapX?: boolean;

  @Output()
  onAddFeature = new EventEmitter<BaseEvent>();


  @ContentChild(SourceVectorComponent, { static: false })
  sourceVectorComponent: SourceVectorComponent;

  instance: Cluster;
  source: Vector;

  constructor(@Host() layer: LayerVectorComponent) {
    super(layer);
  }

  ngAfterContentInit() {
    this.source = this.sourceVectorComponent.instance;

    this.instance = new Cluster(this);
    this.instance.on('addfeature', (event: BaseEvent) => this.onAddFeature.emit(event));
    this.host.instance.setSource(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.instance && changes.hasOwnProperty('distance')) {
      this.instance.setDistance(this.distance);
    }
  }
}
