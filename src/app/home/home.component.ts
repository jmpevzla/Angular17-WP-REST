import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsListComponent } from '../posts-list/posts-list.component';
import { Postslist } from '../postslist';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PostsListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly baseUrl = 'https://angular.dev/assets/tutorials/common';

  housingLocation: Postslist = {
    id: 9999,
    name: 'Test Home',
    city: 'Test city',
    state: 'ST',
    photo: `${this.baseUrl}/example-house.jpg`,
    availableUnits: 99,
    wifi: true,
    laundry: false,
  };
}
