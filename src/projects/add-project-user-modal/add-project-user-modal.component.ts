import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-project-user-modal',
  templateUrl: './add-project-user-modal.component.html',
  styleUrls: ['./add-project-user-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AddProjectUserModalComponent implements OnInit {

  addUsersForm!: FormGroup;

  results: string[] = [];

  constructor(private readonly fb: FormBuilder) { 
    this.addUsersForm = this.fb.group({
      users: ['']
    });
    this.addUsersForm
  }

  ngOnInit(): void {
  }

  searchUsers(event: any): void {
    this.results = [
      'user1@example.com',
      'user2@example.com',
      'user3@example.com',
      'user4@example.com',
      'user5@example.com',
      'user6@example.com',
      'user7@example.com',
    ]
    console.log(event);
  }

}
