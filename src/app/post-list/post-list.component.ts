import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Postlist } from '../postlist';
import { RouterModule } from '@angular/router';
//import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  @Input() postList!: Postlist;
  //domSanitizer = inject(DomSanitizer)
  //contentHtml = ''

  // sanitize() {
  //   this.contentHtml = this.domSanitizer.bypassSecurityTrustHtml
  // }
}
