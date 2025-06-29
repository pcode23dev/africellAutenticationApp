import { Routes } from '@angular/router';
import { PageHome } from './pages/page-home/page-home'; 
import { PageUser } from './pages/page-user/page-user';

export const routes: Routes = [
    { path: '', component: PageHome },
    { path: 'usuario', component: PageUser }
];
