import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Words | Home Page'
  },
  {
    path: 'posts/:slug',
    component: DetailsComponent,
    title: 'Words | Post Details',
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  },
];
