import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ImageUploadService } from '../../services/image-upload.service';
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
    private authService: AuthService,
    private imageUploadService: ImageUploadService
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
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
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
      
      // First upload images to ImgBB to get public URLs
      this.imageUploadService.uploadImages(this.selectedImages).subscribe({
        next: (imageUrls: string[]) => {
          console.log('Images uploaded successfully:', imageUrls);
          
          // Now create the item with the public image URLs
          const itemData = {
            ...this.listItemForm.value,
            imageUrls: imageUrls,
            tags: this.listItemForm.value.tags ? this.listItemForm.value.tags.split(',').map((tag: string) => tag.trim()) : []
          };
          
          this.apiService.createItem(itemData).subscribe({
            next: (response) => {
              console.log('Item created successfully:', response);
              this.isSubmitting = false;
              
              // Navigate to browse page with success message
              this.router.navigate(['/browse'], { 
                queryParams: { 
                  success: 'true',
                  message: 'Item listed successfully! Your item has been added to the ReWear community.'
                }
              });
            },
            error: (error) => {
              console.error('Error creating item:', error);
              this.isSubmitting = false;
              // Handle error (show error message)
            }
          });
        },
        error: (error) => {
          console.error('Error uploading images:', error);
          this.isSubmitting = false;
          // Handle image upload error
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

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.listItemForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.listItemForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['min']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['min'].min}`;
      }
    }
    return '';
  }
} 