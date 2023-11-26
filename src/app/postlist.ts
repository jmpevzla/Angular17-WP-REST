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

export interface Comment {
  id: number;
  author_avatar_url: string;
  author_name: string;
  content: string;
  date: string;
}

export interface WPComment {
  id: number;
  author_avatar_urls: { 24: string; 48: string, 96: string };
  author_name: string;
  content: { rendered: string };
  date: string;
}

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
  comments?: Comment[];
  comment_status?: boolean;
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
  comment_status: string;
}
