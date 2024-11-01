import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Site, SitesService } from 'core';
import { Observable } from 'rxjs';
import { AddProjectModalComponent } from 'src/projects/add-project-modal/add-project-modal.component';
import { MapService } from 'ngx-ol';
import { Feature } from 'ol';
import { WKT } from 'ol/format';
import { boundingExtent } from 'ol/extent';
import { NgModel } from '@angular/forms';
import { Listbox } from 'primeng/listbox';

@Component({
  selector: 'app-home-projects-list',
  templateUrl: './home-projects-list.component.html',
  styleUrls: ['./home-projects-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeProjectsListComponent implements OnInit {
  @Output() gotoMissions = new EventEmitter<Site>();

  @ViewChild(Listbox) accessor: Listbox;
  @ViewChild(Listbox, { read: NgModel }) model: NgModel;

  statusBgColor: Record<string, string> = {
    Complete: '#C8C8C8',
    Pending: '#7450E9',
    Cancelled: '#E95050',
  };

  sites$!: Observable<Site[]>;

  selectedProject: Site | null = null;

  constructor(
    private readonly sitesService: SitesService,
    private readonly dialog: MatDialog,
    private readonly mapService: MapService
  ) {}

  ngOnInit(): void {
    this.sites$ = this.sitesService.entities$;
    this.sitesService.getAll();
  }

  ngAfterViewInit(): void {
    this.sitesService.selectedProject$.subscribe(project => {
      console.log('selected project', project);
      this.selectedProject = project;
      this.model?.control?.setValue(project);
    });
  }

  listboxValueBinding() {
    this.accessor.registerOnChange = (fn: (val: any) => void) => {
      this.accessor.onModelChange = (val) => {
        if(val) {
          this.model.control.setValue(this.model.value);
          return;
        }
        return fn(val);
      };
    }
  }

  addProject() {
    this.dialog.open(AddProjectModalComponent, {
      panelClass: 'mat-dialog-container--p-0',
    });
  }

  projectChanged(site: Site) {
    if(site) {
      console.log(site);
      const feature = new WKT().readFeature(site.geom);
      const extent = feature.getGeometry().getExtent();
      this.mapService
        .getMap('projects-map')
        .getView()
        .fit(extent, {
          duration: 1000,
          padding: [50, 50, 50, 50],
          maxZoom: 16,
        });
    }
  }
}
