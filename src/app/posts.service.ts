import { Injectable, inject } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { Postlist } from './postlist';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  http = inject(HttpClient);

  constructor() { }

  readonly baseUrl = 'https://angular.dev/assets/tutorials/common';
  url = 'http://localhost:3000/locations';

  getAllPosts(): Observable<Postlist[]> {
    return this.http.get<Postlist[]>(this.url)
      .pipe(
        map(response => {
          return response.map(post => {
            return {
              ...post,
              photo: `${this.baseUrl}/${post.photo}`,
            }
          });
        })
      );
  }

  getPostById(id: number): Observable<Postlist | undefined> {
    return this.http.get<Postlist>(`${this.url}/${id}`)
      .pipe(
        map(post => {
          return {
            ...post,
            photo: `${this.baseUrl}/${post.photo}`,
          }
        })
      );
  }

  submitApplication(firstName: string, lastName: string, email: string) {
    console.log(
      `Homes application received: firstName: ${firstName}, lastName: ${lastName}, email: ${email}.`,
    );
  }
}
