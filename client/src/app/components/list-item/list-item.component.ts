import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {
  listItemForm: FormGroup;
  selectedImages: File[] = [];
  imagePreviewUrls: string[] = [];
  isSubmitting = false;
  showSuccessModal = false;

  categories = [
    'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Bags', 'Jewelry'
  ];

  sizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'Custom'
  ];

  conditions = [
    'New with tags', 'Like new', 'Excellent', 'Good', 'Fair', 'Poor'
  ];

  types = [
    { value: 'swap', label: 'Swap Only' },
    { value: 'points', label: 'Points Redemption' },
    { value: 'both', label: 'Both Options' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.listItemForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      size: ['', Validators.required],
      condition: ['', Validators.required],
      type: ['swap', Validators.required],
      points: [0, [Validators.min(0)]],
      location: ['', Validators.required],
      tags: [''],
      brand: [''],
      color: [''],
      material: ['']
    });
  }

  ngOnInit(): void {
    // Watch for type changes to show/hide points field
    this.listItemForm.get('type')?.valueChanges.subscribe(type => {
      const pointsControl = this.listItemForm.get('points');
      if (type === 'swap') {
        pointsControl?.setValue(0);
        pointsControl?.disable();
      } else {
        pointsControl?.enable();
        if (pointsControl?.value === 0) {
          pointsControl?.setValue(50);
        }
      }
    });
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
      
      // Simulate API call
      setTimeout(() => {
        console.log('Form submitted:', this.listItemForm.value);
        console.log('Images:', this.selectedImages);
        
        this.isSubmitting = false;
        this.showSuccessModal = true;
      }, 2000);
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