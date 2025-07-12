import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService, Item } from '../../services/api.service';

// BrowseItem interface removed - using Item from API service

@Component({
  selector: 'app-browse',
  standalone: true,
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BrowseComponent implements OnInit {
  items: Item[] = [];
  filteredItems: Item[] = [];
  searchForm: FormGroup;
  
  categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Sweaters'];
  conditions = ['All', 'Excellent', 'Good', 'Fair'];
  sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  selectedCategory = 'All';
  selectedCondition = 'All';
  selectedType = 'All';
  selectedSize = 'All';
  searchQuery = '';
  sortBy = 'newest';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.searchForm = this.fb.group({
      search: [''],
      category: ['All'],
      condition: ['All'],
      type: ['All'],
      size: ['All'],
      sortBy: ['newest']
    });
  }

  ngOnInit(): void {
    this.loadItems();
    this.setupFormListeners();
  }

  private loadItems(): void {
    this.apiService.getAllItems().subscribe({
      next: (items: Item[]) => {
        this.items = items;
        this.filteredItems = [...this.items];
      },
      error: (error) => {
        console.error('Error loading items:', error);
        // Fallback to empty array
        this.items = [];
        this.filteredItems = [];
      }
    });
  }

  private setupFormListeners(): void {
    this.searchForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const formValue = this.searchForm.value;
    
    this.filteredItems = this.items.filter(item => {
      // Search query
      const matchesSearch = !formValue.search || 
        item.title.toLowerCase().includes(formValue.search.toLowerCase()) ||
        item.description.toLowerCase().includes(formValue.search.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(formValue.search.toLowerCase()));

      // Category filter
      const matchesCategory = formValue.category === 'All' || item.category === formValue.category;

      // Condition filter
      const matchesCondition = formValue.condition === 'All' || 
        item.condition === formValue.condition.toLowerCase();

        // Type filter - all items support both swap and points, so we'll skip this filter for now
  const matchesType = true;

      // Size filter
      const matchesSize = formValue.size === 'All' || item.size === formValue.size;

      return matchesSearch && matchesCategory && matchesCondition && matchesType && matchesSize;
    });

    this.sortItems(formValue.sortBy);
  }

  sortItems(sortBy: string): void {
    switch (sortBy) {
      case 'newest':
        this.filteredItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        this.filteredItems.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'points-high':
        this.filteredItems.sort((a, b) => b.points - a.points);
        break;
      case 'points-low':
        this.filteredItems.sort((a, b) => a.points - b.points);
        break;
      case 'rating':
        // Remove rating sort since it's not available in the API
        break;
    }
  }

  clearFilters(): void {
    this.searchForm.patchValue({
      search: '',
      category: 'All',
      condition: 'All',
      type: 'All',
      size: 'All',
      sortBy: 'newest'
    });
  }

  getConditionColor(condition: string): string {
    switch (condition) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#FF9800';
      case 'fair': return '#F44336';
      default: return '#666';
    }
  }

  // Type methods removed since all items support both swap and points
} 