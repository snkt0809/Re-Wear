import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {
  stats = [
    {
      icon: '🔄',
      number: '1,247',
      label: 'Items Swapped'
    },
    {
      icon: '👥',
      number: '856',
      label: 'Active Users'
    },
    {
      icon: '🌱',
      number: '2.3k',
      label: 'Pounds of Waste Saved'
    },
    {
      icon: '⭐',
      number: '98%',
      label: 'User Satisfaction'
    }
  ];
} 