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
  title: string;
  content: string;
  author: string;
  date: string;
  photo: string;
}

export interface WPPost {
  id: number;
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
