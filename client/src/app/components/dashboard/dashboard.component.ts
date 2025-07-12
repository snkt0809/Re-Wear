import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService, User, Item, Swap } from '../../services/api.service';

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
export class DashboardComponent implements OnInit {
  userProfile: User | null = null;
  userItems: Item[] = [];
  swaps: Swap[] = [];
  isLoading = true;

  // Remove hardcoded userItems array

  // Remove hardcoded swaps array

  activeTab = 'overview';

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    // Get current user
    this.userProfile = this.authService.getCurrentUser();
    
    if (this.userProfile) {
      // Load user's items and swaps
      this.loadUserItems();
      this.loadUserSwaps();
    }
    
    this.isLoading = false;
  }

  private loadUserItems(): void {
    // For now, we'll load all items and filter by uploader
    // In a real app, you'd have a specific endpoint for user's items
    this.apiService.getAllItems().subscribe({
      next: (items: Item[]) => {
        // Filter items by current user (this is a temporary solution)
        // In production, you'd have a dedicated endpoint for user's items
        this.userItems = items.filter(item => 
          item.uploader.id === this.userProfile?.id
        );
      },
      error: (error) => {
        console.error('Error loading user items:', error);
      }
    });
  }

  private loadUserSwaps(): void {
    this.apiService.getMySwaps().subscribe({
      next: (swaps: Swap[]) => {
        this.swaps = swaps;
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
} 