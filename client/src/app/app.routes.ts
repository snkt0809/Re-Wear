import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowseComponent } from './components/browse/browse.component';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';
import { ListItemComponent } from './components/list-item/list-item.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'item/:id', component: ItemDetailComponent },
  { path: 'list', component: ListItemComponent },
  { path: 'cart', component: LoginComponent } // Temporary - replace with CartComponent
  { path: 'swap', component: LoginComponent }, // Temporary - replace with SwapComponent
  { path: 'list', component: LoginComponent }, // Temporary - replace with ListComponent
  { path: 'cart', component: LoginComponent }, // Temporary - replace with CartComponent
  { path: 'chatbot', component: ChatbotComponent } // Chatbot route
];