import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-clients-search-bar',
  templateUrl: './clients-search-bar.component.html',
  styleUrls: ['./clients-search-bar.component.scss']
})
export class ClientsSearchBarComponent implements OnInit {

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
