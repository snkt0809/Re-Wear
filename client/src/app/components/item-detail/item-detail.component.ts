import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService, Item, SwapRequest } from '../../services/api.service';



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
    private fb: FormBuilder,
    private apiService: ApiService
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
    this.apiService.getItemById(itemId).subscribe({
      next: (item: Item) => {
        this.item = item;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading item:', error);
        this.isLoading = false;
        // Handle error (show error message or redirect)
      }
    });
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
    if (this.swapRequestForm.valid && this.item) {
      const swapData: SwapRequest = {
        product1Id: this.item.id, // The item I want to swap FOR (other person's item)
        product2Id: this.swapRequestForm.value.proposedItem, // My item that I'm offering
        message: this.swapRequestForm.value.message
      };
      
      this.apiService.initiateSwap(swapData).subscribe({
        next: (response) => {
          console.log('Swap request submitted successfully:', response);
          this.closeSwapModal();
          // Show success message
        },
        error: (error) => {
          console.error('Error submitting swap request:', error);
          // Handle error (show error message)
        }
      });
    }
  }

  redeemWithPoints(): void {
    if (this.item) {
      this.apiService.redeemWithPoints(this.item.id).subscribe({
        next: (response) => {
          console.log('Item redeemed successfully:', response);
          // Show success message and redirect
        },
        error: (error) => {
          console.error('Error redeeming item:', error);
          // Handle error (show error message)
        }
      });
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