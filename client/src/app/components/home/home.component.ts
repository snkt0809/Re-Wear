import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';

interface FeaturedItem {
  id: number;
  title: string;
  category: string;
  size: string;
  points: number;
  type: 'swap' | 'points';
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  private carouselInterval: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  featuredItems: FeaturedItem[] = [
    {
      id: 1,
      title: 'Vintage Denim Jacket',
      category: 'Outerwear',
      size: 'M',
      points: 150,
      type: 'swap',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      title: 'Organic Cotton T-Shirt',
      category: 'Tops',
      size: 'L',
      points: 80,
      type: 'points',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'Sustainable Wool Sweater',
      category: 'Sweaters',
      size: 'S',
      points: 200,
      type: 'swap',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      title: 'Eco-Friendly Jeans',
      category: 'Bottoms',
      size: '32',
      points: 120,
      type: 'points',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'
    },
    {
      id: 5,
      title: 'Recycled Polyester Dress',
      category: 'Dresses',
      size: 'M',
      points: 180,
      type: 'swap',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop'
    }
  ];

  ngOnInit(): void {
    // Auto-advance carousel every 5 seconds (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      this.carouselInterval = setInterval(() => {
        this.nextSlide();
      }, 5000);
    }
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  previousSlide(): void {
    this.currentSlide = this.currentSlide === 0 
      ? this.featuredItems.length - 1 
      : this.currentSlide - 1;
  }

  nextSlide(): void {
    this.currentSlide = this.currentSlide === this.featuredItems.length - 1 
      ? 0 
      : this.currentSlide + 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
} 