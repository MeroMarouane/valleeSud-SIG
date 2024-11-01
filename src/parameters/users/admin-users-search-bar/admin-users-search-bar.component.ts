import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-users-search-bar',
  templateUrl: './admin-users-search-bar.component.html',
  styleUrls: ['./admin-users-search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUsersSearchBarComponent implements OnInit {

  searchForm = this.fb.group({
    company: [''],
    email: ['', Validators.email],
    phone: [''],
    group: [''],
  })

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
  }

  search() {
    
  }

}
