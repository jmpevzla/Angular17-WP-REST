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
  postsService: PostsService = inject(PostsService);
  filteredPostsList: Postlist[] = [];
  postsHidden: Boolean = false;
  postsLoading: Boolean = false;

  constructor() {
    this.postsLoading = true;
    this.postsService.getAllPosts().subscribe(postsList => {
      this.filteredPostsList = postsList;
      this.postsLoading = false;
    });
  }

  filterResults(text: string, $event: Event) {
    $event.preventDefault();

    let numPosts = 0;
    const formData = new FormData($event.target as HTMLFormElement);
    const value = formData.get('radioGroup');

    switch(value) {
      case '1':
      default:
        numPosts = 12;
        break;
      case '2':
        numPosts = 24;
        break;
      case '3':
        numPosts = 36;
        break;
    }

    this.postsHidden = true;
    this.postsLoading = true;
    this.postsService.getAllPosts(text, numPosts).subscribe(postsList => {
      this.postsHidden = false;
      this.filteredPostsList = postsList;
      this.postsLoading = false;
    });

  }
}
