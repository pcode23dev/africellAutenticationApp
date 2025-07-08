import { Routes } from '@angular/router';
import { PageHome } from './pages/page-home/page-home'; 
import { PageUser } from './pages/page-user/page-user';
import { PageUserRegistrado } from './pages/page-user-registrado/page-user-registrado';

export const routes: Routes = [
    { path: '', component: PageHome },
    { path: 'usuario', component: PageUser },
    { path: 'usuarioRegistrado', component: PageUserRegistrado}
];
