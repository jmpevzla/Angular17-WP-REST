// export interface Postlist {
//   id: number;
//   name: string;
//   city: string;
//   state: string;
//   photo: string;
//   availableUnits: number;
//   wifi: boolean;
//   laundry: boolean;
// }

export interface Postlist {
  id: number;
  slug: string;
  title: string;
  content: string;
  author: string;
  author_photo?: string;
  date: string;
  photo: string;
  num_comments: number;
}

export interface WPPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  },
  content: {
    rendered: string;
  }
  author: number;
  date: string;
  featured_media: number;
}
