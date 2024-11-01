import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-groups-search-bar',
  templateUrl: './groups-search-bar.component.html',
  styleUrls: ['./groups-search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsSearchBarComponent implements OnInit {

  searchForm = this.fb.group({
    group: [''],
  })

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
  }

  search() {
    
  }
}
