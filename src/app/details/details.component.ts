import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostsService } from '../posts.service';
import { Postlist } from '../postlist';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  postsService = inject(PostsService);
  postList: Postlist | undefined;
  postLoading: Boolean = false;

  commentForm = new FormGroup({
    comment: new FormControl(''),
    name: new FormControl(''),
    email: new FormControl(''),
    web: new FormControl(''),
  });

  constructor() {
    this.postLoading = true;
    const postSlug = this.route.snapshot.params['slug'];
    this.postsService.getPostBySlug(postSlug).subscribe(postList => {
      //console.log(postList);
      this.postList = postList;
      this.postLoading = false;
    });
  }

  submitComment(ev: SubmitEvent, form: HTMLFormElement) {
    //ev.preventDefault();
    if (form.checkValidity()) {
      this.postsService.submitApplication(
        this.postList!.id,
        this.commentForm.value.comment!,
        this.commentForm.value.name!,
        this.commentForm.value.email!,
        this.commentForm.value.web ?? ''
      )
    } else {
      form.reportValidity();
    }
  }
}
