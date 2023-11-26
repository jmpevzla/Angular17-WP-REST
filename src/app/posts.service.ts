import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { Observable, forkJoin, catchError
  , EMPTY, defaultIfEmpty, of } from 'rxjs'
import { Postlist, WPPost, Comment, WPComment } from './postlist';
import { environment } from '../environments/enviroment';

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

  private formatFullDate(date: Date) {
    let options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    return date.toLocaleDateString("en-US", options);
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
      + `/wp/v2/posts?search=${filter}&_fields=id,slug,title,author,content,featured_media,date&status=publish&per_page=${num_posts}&order=desc&orderby=date`)
      .pipe(
        switchMap((posts: WPPost[]) => {

          const results = posts.map(post => {
            const data: Postlist = {
              id: post.id,
              slug: post.slug,
              title: post.title.rendered,
              content: this.getFirstWords(this.stripHtmlTags(post.content.rendered)),
              author: '',
              photo: this.photoDefault,
              date: this.formatDate(new Date(post.date)),
              num_comments: 0,
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


            const commentsRequest = this.http.get(this.url + `/wp/v2/comments?post=${post.id}&per_page=99`)
              .pipe(
                map((comments: any) => {
                  data.num_comments = comments.length;
                })
            ).pipe(
              catchError((err: any) => {
                console.log(err)
                return EMPTY.pipe(defaultIfEmpty(null));
              })
            );

            return forkJoin([authorRequest, photoRequest, commentsRequest]).pipe(
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

  getPostBySlug(slug: string): Observable<Postlist | undefined> {
    return this.http.get<WPPost[]>(this.url + `/wp/v2/posts?slug=${slug}&_fields=id,slug,title,author,content,featured_media,comment_status,date`)
      .pipe(
        switchMap((posts: WPPost[]) => {
          if (posts.length == 0) {
            of(undefined)
          }

          const post = posts[0];
          const data: Postlist = {
            id: post.id,
            slug: post.slug,
            title: post.title.rendered,
            content: post.content.rendered,
            author: '',
            photo: this.photoDefault,
            date: this.formatFullDate(new Date(post.date)),
            num_comments: 0,
            comment_status: post.comment_status == 'open',
          }

          const authorRequest = this.http.get(this.url + `/wp/v2/users/${post.author}?_fields=name,avatar_urls`)
            .pipe(
              map((author: any) => {
                data.author = author.name;
                data.author_photo = author.avatar_urls['96'];
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

          const commentsRequest = this.http.get(this.url + `/wp/v2/comments?post=${post.id}&per_page=99`)
            .pipe(
              map((comments: any) => {
                const cs: WPComment[] = comments;

                const xres: Comment[] = cs.map(comment => {
                  return {
                    ...comment,
                    author_avatar_url: comment.author_avatar_urls[48],
                    content: comment.content.rendered,
                    date: this.formatFullDate(new Date(comment.date))
                  } as Comment;
                });
                data.num_comments = xres.length;
                data.comments = xres;
              })
          ).pipe(
            catchError((err: any) => {
              console.log(err)
              return EMPTY.pipe(defaultIfEmpty(null));
            })
        );

          return forkJoin([authorRequest, photoRequest, commentsRequest]).pipe(
            map(() => data)
          );
        })
      );
  }

  submitApplication(postId: number, comment: string, name: string,
      email: string, web: string, cb: Function) {
    const commentData = {
      post: postId,
      author_name: name,
      author_email: email,
      author_url: web,
      content: comment,
    };

    //const username = '';
    //const password = '';
    //const base64Authorization = btoa(username + ':' + password);

    // Construye los encabezados
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + environment.appToken,
    });

    const request = this.http.post(this.url + `/wp/v2/comments`, commentData, { headers });

    request.subscribe({
      next: response => {
        console.log(response);
        cb();
      },
      error: error => {
        console.log(error);
      }
    });

    return request;
  }
}
