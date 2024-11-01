import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-users-search-bar',
  templateUrl: './users-search-bar.component.html',
  styleUrls: ['./users-search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersSearchBarComponent implements OnInit {

  searchForm = this.fb.group({
    user: [''],
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
