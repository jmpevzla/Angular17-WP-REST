import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Postslist } from '../postslist';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent {
  @Input() postsList!: Postslist;
}
