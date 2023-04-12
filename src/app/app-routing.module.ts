import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth/auth.guard';
import { FeedComponent } from './feed/feed.component';

const routes: Routes = [
  { pathMatch: 'full', path: '', loadComponent: () => import('./home/home.component').then(c => c.HomeComponent) },
  { pathMatch: 'full', path: 'login', loadComponent: () => import('./login/login.component').then(c => c.LoginComponent) },
  { pathMatch: 'full', path: 'feed', component: FeedComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
