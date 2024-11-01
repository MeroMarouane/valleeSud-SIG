import { Injectable } from '@angular/core';

import { Map } from 'ol';

/**
 * Openlayers map service to acces maps by id
 * Inject the service in the class that have to use it and access the map with the getMap method.
 * @example
 *
  import { MapService } from '../map.service';
  import OlMap from 'ol/Map';
  constructor(
    private mapService: MapService,
  ) { }
  ngOnInit() {
    // Get the current map
    const map: OlMap = this.mapService.getMap('map');
  }
 */
@Injectable({
  providedIn: 'root',
})
export class MapService {
  /**
   * List of Openlayer map objects [ol.Map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html)
   */
  private map: Record<string, Map> = {};

  constructor() {}

  setMap(key: string, map: Map) {
    if (this.map[key]) {
      throw new Error(`Map with id '${key}' already exists`);
    }
    this.map[key] = map;
  }

  /**
   * Get a map. If it doesn't exist it will be created.
   * @param id id of the map or an objet with a getId method (from mapid service), default 'map'
   */
  getMap(key: string): Map {
    if (!this.map[key]) {
      throw new Error(`Map with id '${key}' does not exist`);
    }
    // return the map
    return this.map[key];
  }

  /** Get all maps
   * NB: to access the complete list of maps you should use the ngAfterViewInit() method to have all maps instanced.
   * @return the list of maps
   */
  getMaps() {
    return this.map;
  }

  /** Get all maps
   * NB: to access the complete list of maps you should use the ngAfterViewInit() method to have all maps instanced.
   * @return array of maps
   */
  getArrayMaps() {
    return Object.values(this.map);
  }

  /**
   * It removes the item with the given id from the collection
   * @param {string} id - The id of the item to remove.
   */
  remove(id: string) {
    delete this.map[id];
  }
}
