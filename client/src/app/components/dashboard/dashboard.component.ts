import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

interface UserItem {
  id: number;
  title: string;
  category: string;
  status: 'active' | 'pending' | 'swapped';
  image: string;
  points: number;
  createdAt: Date;
}

interface Swap {
  id: number;
  itemTitle: string;
  otherUser: string;
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  type: 'incoming' | 'outgoing';
  createdAt: Date;
}

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
  userProfile = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    points: 1250,
    itemsListed: 8,
    swapsCompleted: 12,
    memberSince: new Date('2023-01-15')
  };

  userItems: UserItem[] = [
    {
      id: 1,
      title: 'Vintage Denim Jacket',
      category: 'Outerwear',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&h=300&fit=crop',
      points: 150,
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      title: 'Organic Cotton T-Shirt',
      category: 'Tops',
      status: 'pending',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      points: 80,
      createdAt: new Date('2024-01-20')
    },
    {
      id: 3,
      title: 'Sustainable Wool Sweater',
      category: 'Sweaters',
      status: 'swapped',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=300&fit=crop',
      points: 200,
      createdAt: new Date('2024-01-10')
    }
  ];

  swaps: Swap[] = [
    {
      id: 1,
      itemTitle: 'Vintage Denim Jacket',
      otherUser: 'Mike Chen',
      status: 'pending',
      type: 'incoming',
      createdAt: new Date('2024-01-22')
    },
    {
      id: 2,
      itemTitle: 'Eco-Friendly Jeans',
      otherUser: 'Lisa Park',
      status: 'accepted',
      type: 'outgoing',
      createdAt: new Date('2024-01-18')
    },
    {
      id: 3,
      itemTitle: 'Sustainable Wool Sweater',
      otherUser: 'David Kim',
      status: 'completed',
      type: 'outgoing',
      createdAt: new Date('2024-01-10')
    }
  ];

  activeTab = 'overview';

  ngOnInit(): void {
    // Load user data from service
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'swapped': return '#2196F3';
      case 'accepted': return '#4CAF50';
      case 'completed': return '#4CAF50';
      case 'rejected': return '#F44336';
      default: return '#666';
    }
  }

  getStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  acceptSwap(swapId: number): void {
    // Handle swap acceptance
    console.log('Accepting swap:', swapId);
  }

  rejectSwap(swapId: number): void {
    // Handle swap rejection
    console.log('Rejecting swap:', swapId);
  }

  completeSwap(swapId: number): void {
    // Handle swap completion
    console.log('Completing swap:', swapId);
  }
} 