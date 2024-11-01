import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CustomSideBar } from './custom-sidebar';

import { ToastrService } from 'ngx-toastr';
import { Mission, MissionsService } from 'core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { ClipTask } from '../../../assets/potree/src/defines.js';
import * as THREE from '../../../assets/potree/libs/three.js/build/three.module.js';
import { OBJLoader } from '../../../assets/potree/libs/three.js/loaders/OBJLoader';
import { MTLLoader } from '../../../assets/potree/libs/three.js/loaders/MTLLoader';

const Potree = window['Potree'];

const $ = window['$'];

@Component({
  selector: 'app-maps-three-d',
  templateUrl: './maps-three-d.component.html',
  styleUrls: ['./maps-three-d.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapsThreeDComponent implements OnInit, AfterViewInit {
  @ViewChild('potreeRenderArea', { static: true })
  potreeRenderArea!: ElementRef;
  @ViewChild('measureTools', { static: true })
  measureTools!: ElementRef<HTMLDivElement>;
  @ViewChild('clippingTools', { static: true })
  clippingTools!: ElementRef<HTMLDivElement>;

  viewer: any;
  activeCamera: any;
  pointBudget: number = 1_000_000;

  menuOpen = false;
  menuMesurmentsOpen = false;
  menuClippingToolsOpen = false;

  mission$: Observable<Mission | null>;
  mission: Mission | null = null;

  clipMethod = 'HIGHLIGHT';

  modelReference: any;

  constructor(
    readonly toastr: ToastrService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly missionsService: MissionsService
  ) {}

  ngOnInit(): void {
    this.mission$ = this.route.params.pipe(
      tap((params) => {
        console.log('params', params);
      }),
      switchMap((params) => {
        const missionId = params['missionId'];
        return this.missionsService.entityMap$.pipe(
          map((entityMap) => entityMap[missionId]),
          switchMap((mission) => {
            if (!mission) {
              return this.missionsService.getByKey(missionId);
            }
            return of(mission);
          }),
          catchError((error, caught) => {
            console.error(error);
            return of({ error });
          }),
          map((mission) => {
            if ('error' in mission) {
              this.toastr.error('Une erreur a survenue', 'Erreur');
              return null;
            } else if (!mission) {
              this.toastr.error('Mission untrouvable', 'Erreur');
              this.router.navigate(['/plan']);
            }
            this.mission = mission;
            this.initViewer();
            this.loadPointCloud();
            return mission;
          })
        );
      })
    );
  }

  initViewer() {
    this.viewer = new Potree.Viewer(this.potreeRenderArea.nativeElement);

    this.activeCamera = this.viewer.scene.getActiveCamera();

    this.viewer.setEDLEnabled(true);
    this.viewer.setFOV(60);
    this.viewer.setPointBudget(this.pointBudget);
    this.viewer.loadSettingsFromURL();
    this.viewer.setLanguage('fr');
    this.viewer.compass.setVisible(true);
    this.viewer.useHQ = true;
    const navCube = this.viewer.navigationCube;
    navCube.visible = true;

    this.viewer.compass.dom.css({
      bottom: '32px',
      right: '',
      left: '5%',
      top: '',
    });
    console.log('navigation cube', navCube);
    console.log('compass', this.viewer.compass.dom);

    const elObjects = $('#scene_objects');
    const elToolbar = $(this.measureTools.nativeElement);
    const elClipToolbar = $(this.clippingTools.nativeElement);
    new CustomSideBar(this.viewer, elObjects, elToolbar, elClipToolbar);
  }

  ngAfterViewInit(): void {

  }

  // Load and add point cloud to scene
  loadPointCloud() {
    if(!this.mission.pointClouds) return;
    const pointCloudUrl = this.mission.pointClouds.path;
    Potree.loadPointCloud(
      // '../../../assets/potree/pointclouds/vol_total/cloud.js',
      pointCloudUrl,
      'sigeom.sa',
      async (e) => {
        const scene = this.viewer.scene;
        const pointcloud = e.pointcloud;

        const material = pointcloud.material;
        material.size = 1;
        material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
        material.shape = Potree.PointShape.SQUARE;

        scene.addPointCloud(pointcloud);

        this.viewer.fitToScreen();
        if (this.mission.mesh3ds) {
          const mesh3d = this.mission.mesh3ds;
          // const mesh3d: Partial<Mesh3D> = {
          //   url: '../../../assets/mesh/',
          //   file_mlt: '../../../assets/mesh/SDGT_31_12_simplified_3d_mesh.mtl',
          //   file_obj: '../../../assets/mesh/SDGT_31_12_simplified_3d_mesh.obj',
          // };

          const bboxWorld = e.pointcloud.getBoundingBoxWorld();
          const pcCenter = new THREE.Vector3();
          bboxWorld.getCenter(pcCenter);

          await this.add_mesh3d(
            pcCenter,
            mesh3d.url,
            mesh3d.file_mlt,
            mesh3d.file_obj,
            true
          );
        }
      }
    );
  }

  toggleCompass() {
    const visible = !this.viewer.compass.isVisible();
    this.viewer.compass.setVisible(visible);
  }

  setAttribute(layer: 'RGB' | 'Satellite') {
    if (layer === 'RGB') {
      this.viewer.scene.pointclouds.forEach(
        (pc) => (pc.material.activeAttributeName = 'elevation')
      );
    } else {
      this.viewer.scene.pointclouds.forEach(
        (pc) => (pc.material.activeAttributeName = 'rgba')
      );
    }
  }

  zoom(zoom: number) {
    this.activeCamera.zoom += zoom;
  }

  /**
   * Downloads a JSON file containing measurements from the Potree viewer.
   *
   * @param {HTMLAnchorElement} el - the anchor element used to download the file
   * @return {void} This function does not return anything.
   */
  downloadJson(el: HTMLAnchorElement) {
    let scene = this.viewer.scene;
    let measurements = [
      ...scene.measurements,
      ...scene.profiles,
      ...scene.volumes,
    ];

    if (measurements.length > 0) {
      let geoJson = Potree.GeoJSONExporter.toString(measurements);

      let url = window.URL.createObjectURL(
        new Blob([geoJson], { type: 'data:application/octet-stream' })
      );
      el.href = url;
    } else {
      this.toastr.error('no measurements to export');
      event.preventDefault();
    }
  }

  globView() {
    this.viewer.fitToScreen();
  }

  setClipMethod(value: string) {
    this.viewer.setClipTask(ClipTask[value]);
  }

  async add_mesh3d(
    model_position,
    dossier_path,
    nom_mlt,
    nom_object,
    visibility
  ) {
    const mesh3d = await this.loadModelAsync(
      model_position,
      dossier_path,
      nom_mlt,
      nom_object,
      visibility
    );

    this.viewer.scene.scene.add(mesh3d);
    const ambientLight = new THREE.AmbientLight(0xffffff); // soft white light
    this.viewer.scene.scene.add(ambientLight);
    this.viewer.onGUILoaded(() => {
      // Add entries to object list in sidebar
      let tree = $('#jstree_scene');
      let parentNode = 'other';

      let tree_mesh3d = tree.jstree(
        'create_node',
        parentNode,
        {
          text: 'Maquette 3D - mesh',
          icon: `${Potree.resourcePath}/icons/triangle.svg`,
          data: mesh3d,
        },
        'last',
        false,
        false
      );
      tree.jstree(mesh3d.visible ? 'check_node' : 'uncheck_node', tree_mesh3d);
    });
  }

  async loadModelAsync(
    model_position,
    dossier_path,
    nom_mlt,
    nom_object,
    visibility
  ): Promise<THREE.Mesh> {
    return new Promise((resolve, reject) => {
      new MTLLoader().setPath(dossier_path).load(
        nom_mlt,
        (materials) => {
          materials.preload();
          new OBJLoader()
            .setMaterials(materials)
            .setPath(dossier_path)
            .load(
              nom_object,
              (mesh3d) => {
                mesh3d.position.set(model_position.x, model_position.y, 0);

                if (mesh3d.children.length > 0) {
                  const geom = mesh3d.children[0].geometry;
                  geom.computeBoundingBox();
                  let center = new THREE.Vector3();
                  geom.boundingBox.getCenter(center);

                  mesh3d.translateX(-center.x);
                  mesh3d.translateY(-center.y);
                  mesh3d.translateZ(-center.z);
                }

                mesh3d.visible = visibility;

                resolve(mesh3d);
              },
              (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% object loaded');
              },
              reject
            );
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% material loaded');
        },
        reject
      );
    });
  }

  navigateBack() {
    window.history.back();
  }
}
