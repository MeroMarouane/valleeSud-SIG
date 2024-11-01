const Potree = window['Potree'];
const $ = window['$'];
const Geopackage = window['Geopackage'];

import * as THREE from '../../../assets/potree/libs/three.js/build/three.module.js';

import {
  Volume,
  SphereVolume,
} from '../../../assets/potree/src/utils/Volume.js';
import { PolygonClipVolume } from '../../../assets/potree/src/utils/PolygonClipVolume.js';
import { PropertiesPanel } from '../../../assets/potree/src/viewer/PropertyPanels/PropertiesPanel.js';
import { PointCloudTree } from '../../../assets/potree/src/PointCloudTree.js';
import { Profile } from '../../../assets/potree/src/utils/Profile.js';
import { Measure } from '../../../assets/potree/src/utils/Measure.js';
import { Annotation } from '../../../assets/potree/src/Annotation.js';
import {
  CameraMode,
  ClipMethod,
  ClipTask,
} from '../../../assets/potree/src/defines.js';
import { Utils } from '../../../assets/potree/src/utils.js';
import { OrientedImage } from '../../../assets/potree/src/modules/OrientedImages/OrientedImages.js';
import { Images360 } from '../../../assets/potree/src/modules/Images360/Images360.js';
import { ScreenBoxSelectTool } from '../../../assets/potree/src/utils/ScreenBoxSelectTool.js';

export class CustomSideBar {
  annotationMapping: any;
  measuringTool;
  profileTool;
  volumeTool;
  constructor(
    private viewer: any,
    private sceneObjectsElement: any,
    private elToolbar: any,
    private elClipToolbar: any
  ) {
    this.measuringTool = viewer.measuringTool;
    this.profileTool = viewer.profileTool;
    this.volumeTool = viewer.volumeTool;
    this.initScene();
    this.initToolbar();
    this.initClippingTool();
  }

  createToolIcon(icon, title, callback) {
    let element = $(`
			<img src="${icon}"
				style="width: 32px; height: 32px"
				class="button-icon"
				data-i18n="${title}" />
		`);

    element.click(callback);

    return element;
  }
  /**
   * The function initializes a scene object tree using jstree and adds event listeners for various
   * types of objects that can be added or removed from the scene.
   */
  initScene() {
    let elProperties = this.sceneObjectsElement
      .next()
      .find('#scene_object_properties');

    let propertiesPanel = new PropertiesPanel(elProperties, this.viewer);
    propertiesPanel.setScene(this.viewer.scene);

    localStorage.removeItem('jstree');
    let tree = $(`<div id="jstree_scene"></div>`);
    this.sceneObjectsElement.append(tree);

    tree.jstree({
      plugins: ['checkbox', 'state'],
      core: {
        dblclick_toggle: false,
        state: {
          checked: true,
        },
        check_callback: true,
        expand_selected_onload: true,
      },
      checkbox: {
        keep_selected_style: true,
        three_state: false,
        whole_node: false,
        tie_selection: false,
      },
    });

    let createNode = (parent, text, icon, object) => {
      let nodeID = tree.jstree(
        'create_node',
        parent,
        {
          text: text,
          icon: icon,
          data: object,
        },
        'last',
        false,
        false
      );

      if (object.visible) {
        tree.jstree('check_node', nodeID);
      } else {
        tree.jstree('uncheck_node', nodeID);
      }

      return nodeID;
    };

    let pcID = tree.jstree(
      'create_node',
      '#',
      { text: '<b>Point Clouds</b>', id: 'pointclouds' },
      'last',
      false,
      false
    );
    let measurementID = tree.jstree(
      'create_node',
      '#',
      { text: '<b>Measurements</b>', id: 'measurements' },
      'last',
      false,
      false
    );
    let annotationsID = tree.jstree(
      'create_node',
      '#',
      { text: '<b>Annotations</b>', id: 'annotations' },
      'last',
      false,
      false
    );
    let otherID = tree.jstree(
      'create_node',
      '#',
      { text: '<b>Other</b>', id: 'other' },
      'last',
      false,
      false
    );
    let vectorsID = tree.jstree(
      'create_node',
      '#',
      { text: '<b>Vectors</b>', id: 'vectors' },
      'last',
      false,
      false
    );
    let imagesID = tree.jstree(
      'create_node',
      '#',
      { text: '<b> Images</b>', id: 'images' },
      'last',
      false,
      false
    );

    tree.jstree('check_node', pcID);
    tree.jstree('check_node', measurementID);
    tree.jstree('check_node', annotationsID);
    tree.jstree('check_node', otherID);
    tree.jstree('check_node', vectorsID);
    tree.jstree('check_node', imagesID);

    tree.on('create_node.jstree', (e, data) => {
      tree.jstree('open_all');
    });

    tree.on('select_node.jstree', (e, data) => {
      let object = data.node.data;
      propertiesPanel.set(object);

      this.viewer.inputHandler.deselectAll();

      if (object instanceof Volume) {
        this.viewer.inputHandler.toggleSelection(object);
      }

      $(this.viewer.renderer.domElement).focus();
    });

    tree.on('deselect_node.jstree', (e, data) => {
      propertiesPanel.set(null);
    });

    tree.on('delete_node.jstree', (e, data) => {
      propertiesPanel.set(null);
    });

    tree.on('dblclick', '.jstree-anchor', (e) => {
      let instance = $.jstree.reference(e.target);
      let node = instance.get_node(e.target);
      let object = node.data;

      // ignore double click on checkbox
      if (e.target.classList.contains('jstree-checkbox')) {
        return;
      }

      if (object instanceof PointCloudTree) {
        let box = this.viewer.getBoundingBox([object]);
        let node = new THREE.Object3D();
        node.boundingBox = box;
        this.viewer.zoomTo(node, 1, 500);
      } else if (object instanceof Measure) {
        let points = object.points.map((p) => p.position);
        let box = new THREE.Box3().setFromPoints(points);
        if (box.getSize(new THREE.Vector3()).length() > 0) {
          let node = new THREE.Object3D();
          node.boundingBox = box;
          this.viewer.zoomTo(node, 2, 500);
        }
      } else if (object instanceof Profile) {
        let points = object.points;
        let box = new THREE.Box3().setFromPoints(points);
        if (box.getSize(new THREE.Vector3()).length() > 0) {
          let node = new THREE.Object3D();
          node.boundingBox = box;
          this.viewer.zoomTo(node, 1, 500);
        }
      } else if (object instanceof Volume) {
        let box = object.boundingBox.clone().applyMatrix4(object.matrixWorld);

        if (box.getSize(new THREE.Vector3()).length() > 0) {
          let node = new THREE.Object3D();
          node.boundingBox = box;
          this.viewer.zoomTo(node, 1, 500);
        }
      } else if (object instanceof Annotation) {
        object.moveHere(this.viewer.scene.getActiveCamera());
      } else if (object instanceof PolygonClipVolume) {
        let dir = object.camera.getWorldDirection(new THREE.Vector3());
        let target;

        if (object.camera instanceof THREE.OrthographicCamera) {
          dir.multiplyScalar(object.camera.right);
          target = new THREE.Vector3().addVectors(object.camera.position, dir);
          this.viewer.setCameraMode(CameraMode.ORTHOGRAPHIC);
        } else if (object.camera instanceof THREE.PerspectiveCamera) {
          dir.multiplyScalar(this.viewer.scene.view.radius);
          target = new THREE.Vector3().addVectors(object.camera.position, dir);
          this.viewer.setCameraMode(CameraMode.PERSPECTIVE);
        }

        this.viewer.scene.view.position.copy(object.camera.position);
        this.viewer.scene.view.lookAt(target);
      } else if (object.type === 'SpotLight') {
        let distance = object.distance > 0 ? object.distance / 4 : 5 * 1000;
        let position = object.position;
        let target = new THREE.Vector3().addVectors(
          position,
          object.getWorldDirection(new THREE.Vector3()).multiplyScalar(distance)
        );

        this.viewer.scene.view.position.copy(object.position);
        this.viewer.scene.view.lookAt(target);
      } else if (object instanceof THREE.Object3D) {
        let box = new THREE.Box3().setFromObject(object);

        if (box.getSize(new THREE.Vector3()).length() > 0) {
          let node = new THREE.Object3D();
          node.boundingBox = box;
          this.viewer.zoomTo(node, 1, 500);
        }
      } else if (object instanceof OrientedImage) {
        // TODO zoom to images
        // let box = new THREE.Box3().setFromObject(object);
        // if(box.getSize(new THREE.Vector3()).length() > 0){
        // 	let node = new THREE.Object3D();
        // 	node.boundingBox = box;
        // 	this.viewer.zoomTo(node, 1, 500);
        // }
      } else if (object instanceof Images360) {
        // TODO
      } else if (object instanceof Geopackage) {
        // TODO
      }
    });

    tree.on('uncheck_node.jstree', (e, data) => {
      let object = data.node.data;

      if (object) {
        object.visible = false;
      }
    });

    tree.on('check_node.jstree', (e, data) => {
      let object = data.node.data;

      if (object) {
        object.visible = true;
      }
    });

    let onPointCloudAdded = (e) => {
      let pointcloud = e.pointcloud;
      let cloudIcon = `${Potree.resourcePath}/icons/cloud.svg`;
      let node = createNode(pcID, pointcloud.name, cloudIcon, pointcloud);

      pointcloud.addEventListener('visibility_changed', () => {
        if (pointcloud.visible) {
          tree.jstree('check_node', node);
        } else {
          tree.jstree('uncheck_node', node);
        }
      });
    };

    let onMeasurementAdded = (e) => {
      let measurement = e.measurement;
      let icon = Utils.getMeasurementIcon(measurement);
      createNode(measurementID, measurement.name, icon, measurement);
    };

    let onVolumeAdded = (e) => {
      let volume = e.volume;
      let icon = Utils.getMeasurementIcon(volume);
      let node = createNode(measurementID, volume.name, icon, volume);

      volume.addEventListener('visibility_changed', () => {
        if (volume.visible) {
          tree.jstree('check_node', node);
        } else {
          tree.jstree('uncheck_node', node);
        }
      });
    };

    let onProfileAdded = (e) => {
      let profile = e.profile;
      let icon = Utils.getMeasurementIcon(profile);
      createNode(measurementID, profile.name, icon, profile);
    };

    let onAnnotationAdded = (e) => {
      let annotation = e.annotation;

      let annotationIcon = `${Potree.resourcePath}/icons/annotation.svg`;
      let parentID = this.annotationMapping.get(annotation.parent);
      let annotationID = createNode(
        parentID,
        annotation.title,
        annotationIcon,
        annotation
      );
      this.annotationMapping.set(annotation, annotationID);

      annotation.addEventListener('annotation_changed', (e) => {
        let annotationsRoot = $('#jstree_scene')
          .jstree()
          .get_json('annotations');
        let jsonNode = annotationsRoot.children.find(
          (child) => child.data.uuid === annotation.uuid
        );

        $.jstree
          .reference(jsonNode.id)
          .rename_node(jsonNode.id, annotation.title);
      });
    };

    let onCameraAnimationAdded = (e) => {
      const animation = e.animation;

      const animationIcon = `${Potree.resourcePath}/icons/camera_animation.svg`;
      createNode(otherID, 'animation', animationIcon, animation);
    };

    let onOrientedImagesAdded = (e) => {
      const images = e.images;

      const imagesIcon = `${Potree.resourcePath}/icons/picture.svg`;
      const node = createNode(imagesID, 'images', imagesIcon, images);

      images.addEventListener('visibility_changed', () => {
        if (images.visible) {
          tree.jstree('check_node', node);
        } else {
          tree.jstree('uncheck_node', node);
        }
      });
    };

    let onImages360Added = (e) => {
      const images = e.images;

      const imagesIcon = `${Potree.resourcePath}/icons/picture.svg`;
      const node = createNode(imagesID, '360° images', imagesIcon, images);

      images.addEventListener('visibility_changed', () => {
        if (images.visible) {
          tree.jstree('check_node', node);
        } else {
          tree.jstree('uncheck_node', node);
        }
      });
    };

    const onGeopackageAdded = (e) => {
      const geopackage = e.geopackage;

      const geopackageIcon = `${Potree.resourcePath}/icons/triangle.svg`;
      const tree = $(`#jstree_scene`);
      const parentNode = 'vectors';

      for (const layer of geopackage.node.children) {
        const name = layer.name;

        let shpPointsID = tree.jstree(
          'create_node',
          parentNode,
          {
            text: name,
            icon: geopackageIcon,
            object: layer,
            data: layer,
          },
          'last',
          false,
          false
        );
        tree.jstree(layer.visible ? 'check_node' : 'uncheck_node', shpPointsID);
      }
    };

    this.viewer.scene.addEventListener('pointcloud_added', onPointCloudAdded);
    this.viewer.scene.addEventListener('measurement_added', onMeasurementAdded);
    this.viewer.scene.addEventListener('profile_added', onProfileAdded);
    this.viewer.scene.addEventListener('volume_added', onVolumeAdded);
    this.viewer.scene.addEventListener(
      'camera_animation_added',
      onCameraAnimationAdded
    );
    this.viewer.scene.addEventListener(
      'oriented_images_added',
      onOrientedImagesAdded
    );
    this.viewer.scene.addEventListener('360_images_added', onImages360Added);
    this.viewer.scene.addEventListener('geopackage_added', onGeopackageAdded);
    this.viewer.scene.addEventListener(
      'polygon_clip_volume_added',
      onVolumeAdded
    );
    this.viewer.scene.annotations.addEventListener(
      'annotation_added',
      onAnnotationAdded
    );

    let onMeasurementRemoved = (e) => {
      let measurementsRoot = $('#jstree_scene')
        .jstree()
        .get_json('measurements');
      let jsonNode = measurementsRoot.children.find(
        (child) => child.data.uuid === e.measurement.uuid
      );

      tree.jstree('delete_node', jsonNode.id);
    };

    let onVolumeRemoved = (e) => {
      let measurementsRoot = $('#jstree_scene')
        .jstree()
        .get_json('measurements');
      let jsonNode = measurementsRoot.children.find(
        (child) => child.data.uuid === e.volume.uuid
      );

      tree.jstree('delete_node', jsonNode.id);
    };

    let onPolygonClipVolumeRemoved = (e) => {
      let measurementsRoot = $('#jstree_scene')
        .jstree()
        .get_json('measurements');
      let jsonNode = measurementsRoot.children.find(
        (child) => child.data.uuid === e.volume.uuid
      );

      tree.jstree('delete_node', jsonNode.id);
    };

    let onProfileRemoved = (e) => {
      let measurementsRoot = $('#jstree_scene')
        .jstree()
        .get_json('measurements');
      let jsonNode = measurementsRoot.children.find(
        (child) => child.data.uuid === e.profile.uuid
      );

      tree.jstree('delete_node', jsonNode.id);
    };

    this.viewer.scene.addEventListener(
      'measurement_removed',
      onMeasurementRemoved
    );
    this.viewer.scene.addEventListener('volume_removed', onVolumeRemoved);
    this.viewer.scene.addEventListener(
      'polygon_clip_volume_removed',
      onPolygonClipVolumeRemoved
    );
    this.viewer.scene.addEventListener('profile_removed', onProfileRemoved);

    {
      let annotationIcon = `${Potree.resourcePath}/icons/annotation.svg`;
      this.annotationMapping = new Map();
      this.annotationMapping.set(this.viewer.scene.annotations, annotationsID);
      this.viewer.scene.annotations.traverseDescendants((annotation) => {
        let parentID = this.annotationMapping.get(annotation.parent);
        let annotationID = createNode(
          parentID,
          annotation.title,
          annotationIcon,
          annotation
        );
        this.annotationMapping.set(annotation, annotationID);
      });
    }

    const scene = this.viewer.scene;
    for (let pointcloud of scene.pointclouds) {
      onPointCloudAdded({ pointcloud: pointcloud });
    }

    for (let measurement of scene.measurements) {
      onMeasurementAdded({ measurement: measurement });
    }

    for (let volume of [...scene.volumes, ...scene.polygonClipVolumes]) {
      onVolumeAdded({ volume: volume });
    }

    for (let animation of scene.cameraAnimations) {
      onCameraAnimationAdded({ animation: animation });
    }

    for (let images of scene.orientedImages) {
      onOrientedImagesAdded({ images: images });
    }

    for (let images of scene.images360) {
      onImages360Added({ images: images });
    }

    for (const geopackage of scene.geopackages) {
      onGeopackageAdded({ geopackage: geopackage });
    }

    for (let profile of scene.profiles) {
      onProfileAdded({ profile: profile });
    }

    {
      createNode(otherID, 'Camera', null, new THREE.Camera());
    }

    this.viewer.addEventListener('scene_changed', (e) => {
      propertiesPanel.setScene(e.scene);

      e.oldScene.removeEventListener('pointcloud_added', onPointCloudAdded);
      e.oldScene.removeEventListener('measurement_added', onMeasurementAdded);
      e.oldScene.removeEventListener('profile_added', onProfileAdded);
      e.oldScene.removeEventListener('volume_added', onVolumeAdded);
      e.oldScene.removeEventListener(
        'polygon_clip_volume_added',
        onVolumeAdded
      );
      e.oldScene.removeEventListener(
        'measurement_removed',
        onMeasurementRemoved
      );

      e.scene.addEventListener('pointcloud_added', onPointCloudAdded);
      e.scene.addEventListener('measurement_added', onMeasurementAdded);
      e.scene.addEventListener('profile_added', onProfileAdded);
      e.scene.addEventListener('volume_added', onVolumeAdded);
      e.scene.addEventListener('polygon_clip_volume_added', onVolumeAdded);
      e.scene.addEventListener('measurement_removed', onMeasurementRemoved);
    });

    this.viewer.guiLoaded = true;
  }

  /**
   * The function initializes the toolbar for measuring and annotation tools in Potree, a WebGL point
   * cloud viewer.
   */
  initToolbar() {
    // ANGLE
    console.log('initializing toolbar');

    // this.elToolbar.append(this.createToolIcon(
    // 	Potree.resourcePath + '/icons/angle.png',
    // 	'[title]tt.angle_measurement',
    // 	() => {
    // 		$('#menu_measurements').next().slideDown();
    // 		let measurement = this.measuringTool.startInsertion({
    // 			showDistances: false,
    // 			showAngles: true,
    // 			showArea: false,
    // 			closed: true,
    // 			maxMarkers: 3,
    // 			name: 'Angle'});

    // 		let measurementsRoot = $("#jstree_scene").jstree().get_json("measurements");
    // 		let jsonNode = measurementsRoot.children.find(child => child.data.uuid === measurement.uuid);
    // 		$.jstree.reference(jsonNode.id).deselect_all();
    // 		$.jstree.reference(jsonNode.id).select_node(jsonNode.id);
    // 	}
    // ));

    // // POINT
    // this.elToolbar.append(this.createToolIcon(
    // 	Potree.resourcePath + '/icons/point.svg',
    // 	'[title]tt.point_measurement',
    // 	() => {
    // 		$('#menu_measurements').next().slideDown();
    // 		let measurement = this.measuringTool.startInsertion({
    // 			showDistances: false,
    // 			showAngles: false,
    // 			showCoordinates: true,
    // 			showArea: false,
    // 			closed: true,
    // 			maxMarkers: 1,
    // 			name: 'Point'});

    // 		let measurementsRoot = $("#jstree_scene").jstree().get_json("measurements");
    // 		let jsonNode = measurementsRoot.children.find(child => child.data.uuid === measurement.uuid);
    // 		$.jstree.reference(jsonNode.id).deselect_all();
    // 		$.jstree.reference(jsonNode.id).select_node(jsonNode.id);
    // 	}
    // ));

    // DISTANCE
    this.elToolbar.append(
      this.createToolIcon(
        '../../../assets/measure_distance.svg',
        '[title]tt.distance_measurement',
        () => {
          $('#menu_measurements').next().slideDown();
          let measurement = this.measuringTool.startInsertion({
            showDistances: true,
            showArea: false,
            closed: false,
            name: 'Distance',
          });

          let measurementsRoot = $('#jstree_scene')
            .jstree()
            .get_json('measurements');
          let jsonNode = measurementsRoot.children.find(
            (child) => child.data.uuid === measurement.uuid
          );
          $.jstree.reference(jsonNode.id).deselect_all();
          $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
        }
      )
    );

    // // HEIGHT
    // this.elToolbar.append(this.createToolIcon(
    // 	Potree.resourcePath + '/icons/height.svg',
    // 	'[title]tt.height_measurement',
    // 	() => {
    // 		$('#menu_measurements').next().slideDown();
    // 		let measurement = this.measuringTool.startInsertion({
    // 			showDistances: false,
    // 			showHeight: true,
    // 			showArea: false,
    // 			closed: false,
    // 			maxMarkers: 2,
    // 			name: 'Height'});

    // 		let measurementsRoot = $("#jstree_scene").jstree().get_json("measurements");
    // 		let jsonNode = measurementsRoot.children.find(child => child.data.uuid === measurement.uuid);
    // 		$.jstree.reference(jsonNode.id).deselect_all();
    // 		$.jstree.reference(jsonNode.id).select_node(jsonNode.id);
    // 	}
    // ));

    // // CIRCLE
    // this.elToolbar.append(this.createToolIcon(
    // 	Potree.resourcePath + '/icons/circle.svg',
    // 	'[title]tt.circle_measurement',
    // 	() => {
    // 		$('#menu_measurements').next().slideDown();
    // 		let measurement = this.measuringTool.startInsertion({
    // 			showDistances: false,
    // 			showHeight: false,
    // 			showArea: false,
    // 			showCircle: true,
    // 			showEdges: false,
    // 			closed: false,
    // 			maxMarkers: 3,
    // 			name: 'Circle'});

    // 		let measurementsRoot = $("#jstree_scene").jstree().get_json("measurements");
    // 		let jsonNode = measurementsRoot.children.find(child => child.data.uuid === measurement.uuid);
    // 		$.jstree.reference(jsonNode.id).deselect_all();
    // 		$.jstree.reference(jsonNode.id).select_node(jsonNode.id);
    // 	}
    // ));

    // // AZIMUTH
    // this.elToolbar.append(this.createToolIcon(
    // 	Potree.resourcePath + '/icons/azimuth.svg',
    // 	'Azimuth',
    // 	() => {
    // 		$('#menu_measurements').next().slideDown();
    // 		let measurement = this.measuringTool.startInsertion({
    // 			showDistances: false,
    // 			showHeight: false,
    // 			showArea: false,
    // 			showCircle: false,
    // 			showEdges: false,
    // 			showAzimuth: true,
    // 			closed: false,
    // 			maxMarkers: 2,
    // 			name: 'Azimuth'});

    // 		let measurementsRoot = $("#jstree_scene").jstree().get_json("measurements");
    // 		let jsonNode = measurementsRoot.children.find(child => child.data.uuid === measurement.uuid);
    // 		$.jstree.reference(jsonNode.id).deselect_all();
    // 		$.jstree.reference(jsonNode.id).select_node(jsonNode.id);
    // 	}
    // ));

    // AREA
    this.elToolbar.append(
      this.createToolIcon(
        '../../../assets/measure_area.svg',
        '[title]tt.area_measurement',
        () => {
          $('#menu_measurements').next().slideDown();
          let measurement = this.measuringTool.startInsertion({
            showDistances: true,
            showArea: true,
            closed: true,
            name: 'Area',
          });

          let measurementsRoot = $('#jstree_scene')
            .jstree()
            .get_json('measurements');
          let jsonNode = measurementsRoot.children.find(
            (child) => child.data.uuid === measurement.uuid
          );
          $.jstree.reference(jsonNode.id).deselect_all();
          $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
        }
      )
    );

    // VOLUME
    this.elToolbar.append(
      this.createToolIcon(
        '../../../assets/measure_volume.svg',
        '[title]tt.volume_measurement',
        () => {
          let volume = this.volumeTool.startInsertion();

          let measurementsRoot = $('#jstree_scene')
            .jstree()
            .get_json('measurements');
          let jsonNode = measurementsRoot.children.find(
            (child) => child.data.uuid === volume.uuid
          );
          $.jstree.reference(jsonNode.id).deselect_all();
          $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
        }
      )
    );

    // SPHERE VOLUME
    this.elToolbar.append(
      this.createToolIcon(
        '../../../assets/3d-shape-3d-sphere.svg',
        '[title]tt.volume_measurement',
        () => {
          let volume = this.volumeTool.startInsertion({ type: SphereVolume });

          let measurementsRoot = $('#jstree_scene')
            .jstree()
            .get_json('measurements');
          let jsonNode = measurementsRoot.children.find(
            (child) => child.data.uuid === volume.uuid
          );
          $.jstree.reference(jsonNode.id).deselect_all();
          $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
        }
      )
    );

    // // PROFILE
    // this.elToolbar.append(this.createToolIcon(
    // 	Potree.resourcePath + '/icons/profile.svg',
    // 	'[title]tt.height_profile',
    // 	() => {
    // 		$('#menu_measurements').next().slideDown(); ;
    // 		let profile = this.profileTool.startInsertion();

    // 		let measurementsRoot = $("#jstree_scene").jstree().get_json("measurements");
    // 		let jsonNode = measurementsRoot.children.find(child => child.data.uuid === profile.uuid);
    // 		$.jstree.reference(jsonNode.id).deselect_all();
    // 		$.jstree.reference(jsonNode.id).select_node(jsonNode.id);
    // 	}
    // ));

    // // ANNOTATION
    // this.elToolbar.append(this.createToolIcon(
    // 	Potree.resourcePath + '/icons/annotation.svg',
    // 	'[title]tt.annotation',
    // 	() => {
    // 		$('#menu_measurements').next().slideDown(); ;
    // 		let annotation = this.viewer.annotationTool.startInsertion();

    // 		let annotationsRoot = $("#jstree_scene").jstree().get_json("annotations");
    // 		let jsonNode = annotationsRoot.children.find(child => child.data.uuid === annotation.uuid);
    // 		$.jstree.reference(jsonNode.id).deselect_all();
    // 		$.jstree.reference(jsonNode.id).select_node(jsonNode.id);
    // 	}
    // ));

    // REMOVE ALL
    this.elToolbar.append(
      this.createToolIcon(
        '../../../assets/delete-bin.svg',
        '[title]tt.remove_all_measurement',
        () => {
          this.viewer.scene.removeAllMeasurements();
        }
      )
    );

    {
      // SHOW / HIDE Measurements
      let elShow = $('#measurement_options_show');
      elShow.selectgroup({ title: 'Show/Hide labels' });

      elShow.find('input').click((e) => {
        const show = e.target.value === 'SHOW';
        this.measuringTool.showLabels = show;
      });

      let currentShow = this.measuringTool.showLabels ? 'SHOW' : 'HIDE';
      elShow.find(`input[value=${currentShow}]`).trigger('click');
    }
  }

  initClippingTool() {
    this.viewer.addEventListener('cliptask_changed', (event) => {
      console.log('TODO');
    });

    this.viewer.addEventListener('clipmethod_changed', (event) => {
      console.log('TODO');
    });

    {
      let elClipTask = $('#cliptask_options');
      elClipTask.selectgroup({ title: 'Clip Task' });

      elClipTask.find('input').click((e) => {
        this.viewer.setClipTask(ClipTask[e.target.value]);
      });

      let currentClipTask = Object.keys(ClipTask).filter(
        (key) => ClipTask[key] === this.viewer.clipTask
      );
      elClipTask.find(`input[value=${currentClipTask}]`).trigger('click');
    }

    {
      let elClipMethod = $('#clipmethod_options');
      elClipMethod.selectgroup({ title: 'Clip Method' });

      elClipMethod.find('input').click((e) => {
        this.viewer.setClipMethod(ClipMethod[e.target.value]);
      });

      let currentClipMethod = Object.keys(ClipMethod).filter(
        (key) => ClipMethod[key] === this.viewer.clipMethod
      );
      elClipMethod.find(`input[value=${currentClipMethod}]`).trigger('click');
    }

    let clippingToolBar = this.elClipToolbar;
    console.log('clippingToolBar', clippingToolBar);

    // CLIP VOLUME
    clippingToolBar.append(
      this.createToolIcon(
        Potree.resourcePath + '/icons/clip_volume.svg',
        '[title]tt.clip_volume',
        () => {
          let item = this.volumeTool.startInsertion({ clip: true });

          let measurementsRoot = $('#jstree_scene')
            .jstree()
            .get_json('measurements');
          let jsonNode = measurementsRoot.children.find(
            (child) => child.data.uuid === item.uuid
          );
          $.jstree.reference(jsonNode.id).deselect_all();
          $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
        }
      )
    );

    // CLIP POLYGON
    clippingToolBar.append(
      this.createToolIcon(
        Potree.resourcePath + '/icons/clip-polygon.svg',
        '[title]tt.clip_polygon',
        () => {
          let item = this.viewer.clippingTool.startInsertion({
            type: 'polygon',
          });

          let measurementsRoot = $('#jstree_scene')
            .jstree()
            .get_json('measurements');
          let jsonNode = measurementsRoot.children.find(
            (child) => child.data.uuid === item.uuid
          );
          $.jstree.reference(jsonNode.id).deselect_all();
          $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
        }
      )
    );

    {
      // SCREEN BOX SELECT
      let boxSelectTool = new ScreenBoxSelectTool(this.viewer);

      clippingToolBar.append(
        this.createToolIcon(
          Potree.resourcePath + '/icons/clip-screen.svg',
          '[title]tt.screen_clip_box',
          () => {
            if (
              !(
                this.viewer.scene.getActiveCamera() instanceof
                THREE.OrthographicCamera
              )
            ) {
              this.viewer.postMessage(
                `Switch to Orthographic Camera Mode before using the Screen-Box-Select tool.`,
                { duration: 2000 }
              );
              return;
            }

            let item = boxSelectTool.startInsertion();

            let measurementsRoot = $('#jstree_scene')
              .jstree()
              .get_json('measurements');
            let jsonNode = measurementsRoot.children.find(
              (child) => child.data.uuid === item.uuid
            );
            $.jstree.reference(jsonNode.id).deselect_all();
            $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
          }
        )
      );
    }

    {
      // REMOVE CLIPPING TOOLS
      clippingToolBar.append(
        this.createToolIcon(
          '../../../assets/delete-bin.svg',
          '[title]tt.remove_all_clipping_volumes',
          () => {
            this.viewer.scene.removeAllClipVolumes();
          }
        )
      );
    }
  }
}
