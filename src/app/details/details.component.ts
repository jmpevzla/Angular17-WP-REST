import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
  sanitizer = inject(DomSanitizer);
  route: ActivatedRoute = inject(ActivatedRoute);
  postsService = inject(PostsService);
  postList: Postlist | undefined;
  postLoading: Boolean = false;
  htmlContent: SafeHtml | undefined;
  CommentSending: Boolean = false;

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
      this.postList = postList;
      this.postLoading = false;
      this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(this.postList!.content);

      let storedCommentData = sessionStorage.getItem("commentData");

      if (storedCommentData) {
        const commentData = JSON.parse(storedCommentData);
        this.commentForm.patchValue({
          name: commentData.name,
          email: commentData.email,
          web: commentData.web,
        });
      }

    });
  }

  submitComment(ev: SubmitEvent, form: HTMLFormElement) {
    //ev.preventDefault();
    if (form.checkValidity()) {

      const commentData = {
        name: this.commentForm.value.name!,
        email: this.commentForm.value.email!,
        web: this.commentForm.value.web ?? '',
      };

      sessionStorage.setItem("commentData", JSON.stringify(commentData));

      this.CommentSending = true;

      this.postsService.submitApplication(
        this.postList!.id,
        this.commentForm.value.comment!,
        this.commentForm.value.name!,
        this.commentForm.value.email!,
        this.commentForm.value.web ?? '',
        () => {
          this.commentForm.patchValue({
            comment: ''
          })
          alert('Comment pending approval');
          this.CommentSending = false;
        }
      );

    } else {
      form.reportValidity();
    }
  }
}
