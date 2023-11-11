import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Postlist } from '../postlist';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  @Input() postList!: Postlist;
}
