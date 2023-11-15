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
  id: Number;
  title: string;
  content: string;
  author: string;
  date: string;
}

export interface WPPost {
  id: Number;
  title: {
    rendered: string;
  },
  content: {
    rendered: string;
  }
  author: Number;
  date: string;
}
