import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  type: 'swap' | 'points';
  points: number;
  images: string[];
  tags: string[];
  location: string;
  availability: 'available' | 'pending' | 'sold';
  uploader: {
    name: string;
    rating: number;
    swapsCompleted: number;
    memberSince: string;
    avatar: string;
  };
  createdAt: string;
}

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
  item: Item | null = null;
  currentImageIndex = 0;
  swapRequestForm: FormGroup;
  showSwapModal = false;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder
  ) {
    this.swapRequestForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(10)]],
      proposedItem: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const itemId = params['id'];
      this.loadItem(itemId);
    });
  }

  loadItem(itemId: string): void {
    // Mock data - in real app, this would be an API call
    setTimeout(() => {
      this.item = {
        id: itemId,
        title: 'Vintage Denim Jacket',
        description: 'Beautiful vintage denim jacket in excellent condition. This classic piece features a timeless design with comfortable fit. Perfect for layering or as a statement piece. Made from high-quality denim that has aged beautifully.',
        category: 'Outerwear',
        size: 'M',
        condition: 'Excellent',
        type: 'swap',
        points: 150,
        images: [
          'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400',
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'
        ],
        tags: ['vintage', 'denim', 'jacket', 'casual'],
        location: 'San Francisco, CA',
        availability: 'available',
        uploader: {
          name: 'Sarah Johnson',
          rating: 4.8,
          swapsCompleted: 23,
          memberSince: '2023',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
        },
        createdAt: '2024-01-15'
      };
      this.isLoading = false;
    }, 500);
  }

  setCurrentImage(index: number): void {
    this.currentImageIndex = index;
  }

  nextImage(): void {
    if (this.item && this.currentImageIndex < this.item.images.length - 1) {
      this.currentImageIndex++;
    }
  }

  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  openSwapModal(): void {
    this.showSwapModal = true;
  }

  closeSwapModal(): void {
    this.showSwapModal = false;
    this.swapRequestForm.reset();
  }

  submitSwapRequest(): void {
    if (this.swapRequestForm.valid) {
      // Handle swap request submission
      console.log('Swap request submitted:', this.swapRequestForm.value);
      this.closeSwapModal();
      // Show success message
    }
  }

  redeemWithPoints(): void {
    if (this.item) {
      // Handle points redemption
      console.log('Redeeming item with points:', this.item.id);
      // Show confirmation modal
    }
  }

  getAvailabilityColor(): string {
    if (!this.item) return '';
    switch (this.item.availability) {
      case 'available': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'sold': return '#F44336';
      default: return '#757575';
    }
  }

  getAvailabilityText(): string {
    if (!this.item) return '';
    switch (this.item.availability) {
      case 'available': return 'Available';
      case 'pending': return 'Pending';
      case 'sold': return 'Sold';
      default: return 'Unknown';
    }
  }
} 