import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true, // Make App standalone
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  imports: [
   RouterOutlet,
   RouterModule,// Configure routes
   NavbarComponent
  ],
})
export class App implements OnInit {
  constructor(private titleService: Title) {}
  
  ngOnInit() {
    this.titleService.setTitle('ReWear - Sustainable Fashion Exchange');
  }
}