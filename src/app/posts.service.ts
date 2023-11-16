import { Injectable, inject } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { Observable, forkJoin, catchError, EMPTY, defaultIfEmpty } from 'rxjs'
import { Postlist, WPPost } from './postlist';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  http = inject(HttpClient);

  constructor() { }

  readonly baseUrl = 'https://angular.dev/assets/tutorials/common';
  //url = 'http://localhost:3000/locations';
  url = 'https://localhost/words/index.php/wp-json';
  photoDefault = 'https://images.unsplash.com/photo-1597613261732-344e083d25e5?q=90&w=400&auto=format&fit=crop'

  private formatDate(date: Date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
  }

  private stripHtmlTags(str: string) {
    if ((str === null) || (str === '')) {
      return '';
    }
    else {
      str = str.toString();
      return str.replace(/<[^>]*>/g, '');
    }
  }

  private getFirstWords(str: string) {
    return str.split(' ').slice(0, 10).join(' ') + '...';
  }

  getAllPosts(filter = '', num_posts = 12): Observable<Postlist[]> {
    return this.http.get<WPPost[]>(this.url
      + `/wp/v2/posts?search=${filter}&_fields=id,title,author,content,featured_media,date&per_page=${num_posts}&order=desc&orderby=date`)
      .pipe(
        switchMap((posts: WPPost[]) => {

          const results = posts.map(post => {
            const data: Postlist = {
              id: post.id,
              title: post.title.rendered,
              content: this.getFirstWords(this.stripHtmlTags(post.content.rendered)),
              author: '',
              photo: this.photoDefault,
              date: this.formatDate(new Date(post.date)),
            }

            const authorRequest = this.http.get(this.url + `/wp/v2/users/${post.author}?_fields=name`)
            .pipe(
              map((author: any) => {
                data.author = author.name;
              })
            );

            let photoRequest: Observable<void | null> = EMPTY.pipe(defaultIfEmpty(null))
            if (post.featured_media > 0) {
              photoRequest = this.http.get(this.url + `/wp/v2/media/${post.featured_media}?_fields=source_url`)
              .pipe(
                map((media: any) => {
                  data.photo = media.source_url;
                })
              );
            }

            return forkJoin([authorRequest, photoRequest]).pipe(
              map(() => data)
            );

          });

          return forkJoin(results);
        })
      ).pipe(
        catchError((err: any) => {
          console.log(err)
          return [];
        })
      );
  }

  getPostById(id: number): Observable<Postlist | undefined> {
    return this.http.get<Postlist>(`${this.url}/${id}`)
      .pipe(
        map(post => {
          return {
            ...post,
            //photo: `${this.baseUrl}/${post.photo}`,
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
