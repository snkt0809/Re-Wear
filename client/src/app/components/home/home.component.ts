import { Component, OnInit, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ApiService, Item, User } from '../../services/api.service';
import { HeroComponent } from '../hero/hero.component';
import { FeaturesComponent } from '../features/features.component';
import { StatsComponent } from '../stats/stats.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeroComponent,
    FeaturesComponent,
    StatsComponent,
    TestimonialsComponent,
    ChatbotComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  featuredItems: Item[] = [];
  currentSlide = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // Load featured items when user state changes
      this.loadFeaturedItems();
    });
  }

  async loadFeaturedItems(): Promise<void> {
    // Only try to load items if user is authenticated
    if (!this.currentUser) {
      console.log('User not authenticated, using fallback data');
      this.loadFallbackItems();
      return;
    }

    try {
      const items = await firstValueFrom(this.apiService.getAllItems());
      this.featuredItems = items?.slice(0, 6) || []; // Show first 6 items
    } catch (error) {
      console.error('Error loading featured items:', error);
      // Fallback to mock data if API fails
      this.loadFallbackItems();
    }
  }

  private loadFallbackItems(): void {
    this.featuredItems = [
      {
        id: '1',
        title: 'Vintage Denim Jacket',
        description: 'Classic denim jacket in excellent condition',
        category: 'Men',
        size: 'M',
        condition: 'Like New',
        images: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400'],
        tags: ['denim', 'jacket', 'vintage'],
        location: 'New York',
        points: 150,
        availability: 'available',
        uploader: {
          id: 'user1',
          name: 'John Doe',
          swapsCompleted: 5,
          memberSince: '2023-01-01'
        },
        createdAt: '2024-01-01'
      },
      {
        id: '2',
        title: 'Summer Dress',
        description: 'Beautiful floral summer dress',
        category: 'Women',
        size: 'S',
        condition: 'Good',
        images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'],
        tags: ['dress', 'summer', 'floral'],
        location: 'Los Angeles',
        points: 100,
        availability: 'available',
        uploader: {
          id: 'user2',
          name: 'Jane Smith',
          swapsCompleted: 3,
          memberSince: '2023-02-01'
        },
        createdAt: '2024-01-02'
      }
    ];
  }

  previousSlide(): void {
    this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.featuredItems.length - 1;
  }

  nextSlide(): void {
    this.currentSlide = this.currentSlide < this.featuredItems.length - 1 ? this.currentSlide + 1 : 0;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  onSwapRequest(item: Item): void {
    if (!this.currentUser) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }
    
    // Handle swap request logic
    console.log('Swap request for item:', item);
  }
} 