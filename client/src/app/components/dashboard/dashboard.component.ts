import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService, User, Item, Swap } from '../../services/api.service';
import { Subscription } from 'rxjs';

// Remove local interfaces - using API service interfaces instead

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  userProfile: User | null = null;
  userItems: Item[] = [];
  swaps: Swap[] = [];
  recentActivity: any[] = [];
  isLoading = true;
  activeTab = 'overview';
  private authSubscription: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    // Subscribe to auth state changes
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.userProfile = user;
      if (user) {
        this.loadUserData();
      } else {
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    // Initial load - check if user is already logged in
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      this.userProfile = currentUser;
      this.loadUserData();
    } else {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private loadUserData(): void {
    if (this.userProfile) {
      // Ensure default values for user profile
      this.userProfile = {
        ...this.userProfile,
        swapsCompleted: this.userProfile.swapsCompleted || 0,
        points: this.userProfile.points || 0
      };
      
      // Only load data in browser environment
      if (isPlatformBrowser(this.platformId)) {
        // Load user's items and swaps
        this.loadUserItems();
        this.loadUserSwaps();
        this.generateRecentActivity();
      }
    }
    
    this.isLoading = false;
  }

  private loadUserItems(): void {
    this.apiService.getUserItems().subscribe({
      next: (items: Item[]) => {
        this.userItems = items;
        this.generateRecentActivity();
      },
      error: (error) => {
        console.error('Error loading user items:', error);
        // Fallback to filtering all items if the endpoint doesn't exist
        this.loadUserItemsFallback();
      }
    });
  }

  private loadUserItemsFallback(): void {
    // Fallback method - load all items and filter by current user
    this.apiService.getAllItems().subscribe({
      next: (items: Item[]) => {
        this.userItems = items.filter(item => 
          item.uploader.id === this.userProfile?.id
        );
        this.generateRecentActivity();
      },
      error: (error) => {
        console.error('Error loading user items (fallback):', error);
      }
    });
  }

  private loadUserSwaps(): void {
    this.apiService.getMySwaps().subscribe({
      next: (swaps: Swap[]) => {
        this.swaps = swaps;
        this.generateRecentActivity();
      },
      error: (error) => {
        console.error('Error loading user swaps:', error);
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'available': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'approved': return '#4CAF50';
      case 'rejected': return '#F44336';
      case 'sold': return '#2196F3';
      default: return '#666';
    }
  }

  getStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getSwapType(swap: Swap): 'incoming' | 'outgoing' {
    const currentUserId = this.userProfile?.id;
    return swap.initiator.id === currentUserId ? 'outgoing' : 'incoming';
  }

  getOtherUser(swap: Swap): User {
    const currentUserId = this.userProfile?.id;
    return swap.initiator.id === currentUserId ? swap.recipient : swap.initiator;
  }

  acceptSwap(swapId: string): void {
    this.apiService.approveSwap(swapId).subscribe({
      next: (swap) => {
        console.log('Swap approved:', swap);
        this.loadUserSwaps(); // Reload swaps
        this.generateRecentActivity(); // Refresh activity
      },
      error: (error) => {
        console.error('Error approving swap:', error);
      }
    });
  }

  rejectSwap(swapId: string): void {
    this.apiService.rejectSwap(swapId).subscribe({
      next: (swap) => {
        console.log('Swap rejected:', swap);
        this.loadUserSwaps(); // Reload swaps
        this.generateRecentActivity(); // Refresh activity
      },
      error: (error) => {
        console.error('Error rejecting swap:', error);
      }
    });
  }

  completeSwap(swapId: string): void {
    // Handle swap completion - you might need to add this endpoint to your API
    console.log('Completing swap:', swapId);
  }

  private generateRecentActivity(): void {
    const activities: any[] = [];

    // Add recent swaps
    this.swaps.slice(0, 3).forEach(swap => {
      const isIncoming = this.getSwapType(swap) === 'incoming';
      const otherUser = this.getOtherUser(swap);
      
      activities.push({
        type: 'swap',
        icon: isIncoming ? '🔄' : '📤',
        title: isIncoming 
          ? `Swap request received for "${swap.product1.title}"`
          : `Swap request sent for "${swap.product1.title}"`,
        description: `with ${otherUser.name}`,
        time: this.getTimeAgo(swap.createdAt),
        status: swap.status
      });
    });

    // Add recent items
    this.userItems.slice(0, 2).forEach(item => {
      activities.push({
        type: 'item',
        icon: '📦',
        title: `New item listed: "${item.title}"`,
        description: `${item.category} • ${item.points} points`,
        time: this.getTimeAgo(item.createdAt),
        status: item.availability
      });
    });

    // Sort by date (most recent first) and take top 5
    this.recentActivity = activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);
  }

  private getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }
} 