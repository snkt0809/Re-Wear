import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent {
  features = [
    {
      icon: '🌱',
      title: 'Sustainable Fashion',
      description: 'Reduce textile waste and promote circular fashion by giving clothes a second life.'
    },
    {
      icon: '🔄',
      title: 'Direct Swaps',
      description: 'Exchange items directly with other users or use our point-based redemption system.'
    },
    {
      icon: '💚',
      title: 'Eco-Friendly',
      description: 'Join the movement towards sustainable fashion and reduce your environmental impact.'
    },
    {
      icon: '🛡️',
      title: 'Verified Community',
      description: 'Safe and trusted platform with moderated listings and verified users.'
    }
  ];
} 