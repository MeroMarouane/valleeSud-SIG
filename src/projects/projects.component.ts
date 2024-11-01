import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Site, SitesService } from 'core';
import { Observable } from 'rxjs';
import { AddProjectModalComponent } from './add-project-modal/add-project-modal.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProjectsComponent implements OnInit {
  sites$!: Observable<Site[]>;
  constructor(
    private readonly dialog: MatDialog,
    private readonly sitesService: SitesService
  ) {}

  ngOnInit(): void {
    this.sites$ = this.sitesService.entities$;
    this.sitesService.load();
  }

  addProject() {
    this.dialog.open(AddProjectModalComponent);
  }
}
