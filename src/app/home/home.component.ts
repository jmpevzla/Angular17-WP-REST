import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostListComponent } from '../post-list/post-list.component';
import { Postlist } from '../postlist';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PostListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  postsList: Postlist[] = [];
  postsService: PostsService = inject(PostsService);

  constructor() {
    this.postsList = this.postsService.getAllPosts();
  }
}
