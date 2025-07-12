import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent {
  testimonials = [
    {
      stars: '⭐⭐⭐⭐⭐',
      text: "ReWear has completely changed how I think about fashion. I've swapped 15 items and saved so much money while helping the environment!",
      author: {
        initial: 'S',
        name: 'Sarah Chen',
        role: 'Fashion Enthusiast'
      }
    },
    {
      stars: '⭐⭐⭐⭐⭐',
      text: "The community is amazing and the swap process is so smooth. I love that I can give my clothes a second life while finding unique pieces.",
      author: {
        initial: 'M',
        name: 'Mike Rodriguez',
        role: 'Sustainable Living Advocate'
      }
    },
    {
      stars: '⭐⭐⭐⭐⭐',
      text: "As a student, this platform has been a game-changer. I can refresh my wardrobe without spending money and contribute to sustainability.",
      author: {
        initial: 'E',
        name: 'Emma Thompson',
        role: 'College Student'
      }
    }
  ];
} 