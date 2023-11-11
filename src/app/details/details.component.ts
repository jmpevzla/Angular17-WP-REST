import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../posts.service';
import { Postlist } from '../postlist';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  postsService = inject(PostsService);
  postList: Postlist | undefined;

  constructor() {
    const postId = Number(this.route.snapshot.params['id']);
    this.postList = this.postsService.getPostById(postId);
  }
}
