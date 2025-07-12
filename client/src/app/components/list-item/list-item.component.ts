import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit, OnDestroy {
  listItemForm: FormGroup;
  selectedImages: File[] = [];
  imagePreviewUrls: string[] = [];
  isSubmitting = false;
  showSuccessModal = false;
  currentUser: User | null = null;
  isAuthenticated = false;
  private authSubscription!: Subscription;

  categories = [
    'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Bags', 'Jewelry'
  ];

  sizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'Custom'
  ];

  conditions = [
    'New with tags', 'Like new', 'Excellent', 'Good', 'Fair', 'Poor'
  ];



  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.listItemForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      size: ['', Validators.required],
      condition: ['', Validators.required],
      points: [50, [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      tags: [''],
      brand: [''],
      color: [''],
      material: ['']
    });
  }

  ngOnInit(): void {
    // Check authentication
    this.currentUser = this.authService.getCurrentUser();
    this.isAuthenticated = this.authService.isLoggedIn();
    
    // If not authenticated, redirect to login
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Subscribe to auth changes to handle dynamic authentication state
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      
      if (!this.isAuthenticated) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onImageSelect(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/') && this.selectedImages.length < 5) {
          this.selectedImages.push(file);
          this.createImagePreview(file);
        }
      }
    }
  }

  createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrls.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
  }

  onSubmit(): void {
    if (this.listItemForm.valid && this.selectedImages.length > 0) {
      this.isSubmitting = true;
      
      // Convert images to base64 URLs for API
      const imageUrls = this.imagePreviewUrls;
      
      const itemData = {
        ...this.listItemForm.value,
        imageUrls: imageUrls,
        tags: this.listItemForm.value.tags ? this.listItemForm.value.tags.split(',').map((tag: string) => tag.trim()) : []
      };
      
      this.apiService.createItem(itemData).subscribe({
        next: (response) => {
          console.log('Item created successfully:', response);
          this.isSubmitting = false;
          this.showSuccessModal = true;
        },
        error: (error) => {
          console.error('Error creating item:', error);
          this.isSubmitting = false;
          // Handle error (show error message)
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.listItemForm.controls).forEach(key => {
        const control = this.listItemForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/dashboard']);
  }

  getErrorMessage(controlName: string): string {
    const control = this.listItemForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
      }
      if (control.errors['minlength']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['min']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors['min'].min}`;
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.listItemForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
} 