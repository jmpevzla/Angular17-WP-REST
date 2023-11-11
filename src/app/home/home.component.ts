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
  filteredPostsList: Postlist[] = [];
  postsHidden: Boolean = false;

  constructor() {
    this.postsList = this.postsService.getAllPosts();
    this.filteredPostsList = this.postsList;
  }

  filterResults(text: string, $event: Event) {
    $event.preventDefault();
    this.postsHidden = true;

    let temp: Postlist[] = [];
    if (!text) {
      temp = this.postsList;
    } else {
      temp = this.postsList.filter((postList) =>
        postList?.city.toLowerCase().includes(text.toLowerCase()),
      );
    }

    setTimeout(() => {
      this.postsHidden = false;
      this.filteredPostsList = temp;
    }, 500);
  }
}
