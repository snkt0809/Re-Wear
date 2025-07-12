import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

interface BrowseItem {
  id: number;
  title: string;
  description: string;
  category: string;
  type: 'swap' | 'points';
  size: string;
  condition: 'excellent' | 'good' | 'fair';
  points: number;
  image: string;
  uploader: {
    name: string;
    rating: number;
    swapsCompleted: number;
  };
  tags: string[];
  createdAt: Date;
  location: string;
}

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
  items: BrowseItem[] = [];
  filteredItems: BrowseItem[] = [];
  searchForm: FormGroup;
  
  categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Sweaters'];
  conditions = ['All', 'Excellent', 'Good', 'Fair'];
  types = ['All', 'Swap', 'Points'];
  sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  selectedCategory = 'All';
  selectedCondition = 'All';
  selectedType = 'All';
  selectedSize = 'All';
  searchQuery = '';
  sortBy = 'newest';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder
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
    // Mock data - in real app, this would come from a service
    this.items = [
      {
        id: 1,
        title: 'Vintage Denim Jacket',
        description: 'Classic vintage denim jacket in excellent condition. Perfect for layering.',
        category: 'Outerwear',
        type: 'swap',
        size: 'M',
        condition: 'excellent',
        points: 150,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop',
        uploader: {
          name: 'Sarah Johnson',
          rating: 4.8,
          swapsCompleted: 12
        },
        tags: ['vintage', 'denim', 'jacket'],
        createdAt: new Date('2024-01-15'),
        location: 'San Francisco, CA'
      },
      {
        id: 2,
        title: 'Organic Cotton T-Shirt',
        description: 'Soft organic cotton t-shirt in navy blue. Sustainable and comfortable.',
        category: 'Tops',
        type: 'points',
        size: 'L',
        condition: 'good',
        points: 80,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        uploader: {
          name: 'Mike Chen',
          rating: 4.9,
          swapsCompleted: 8
        },
        tags: ['organic', 'cotton', 'sustainable'],
        createdAt: new Date('2024-01-20'),
        location: 'Los Angeles, CA'
      },
      {
        id: 3,
        title: 'Sustainable Wool Sweater',
        description: 'Warm wool sweater perfect for cold weather. Made from ethically sourced wool.',
        category: 'Sweaters',
        type: 'swap',
        size: 'S',
        condition: 'excellent',
        points: 200,
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
        uploader: {
          name: 'Lisa Park',
          rating: 4.7,
          swapsCompleted: 15
        },
        tags: ['wool', 'warm', 'ethical'],
        createdAt: new Date('2024-01-10'),
        location: 'Seattle, WA'
      },
      {
        id: 4,
        title: 'Eco-Friendly Jeans',
        description: 'Stylish jeans made from recycled denim. Great fit and sustainable.',
        category: 'Bottoms',
        type: 'points',
        size: '32',
        condition: 'good',
        points: 120,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
        uploader: {
          name: 'David Kim',
          rating: 4.6,
          swapsCompleted: 6
        },
        tags: ['recycled', 'denim', 'sustainable'],
        createdAt: new Date('2024-01-18'),
        location: 'Portland, OR'
      },
      {
        id: 5,
        title: 'Recycled Polyester Dress',
        description: 'Elegant dress made from recycled polyester. Perfect for special occasions.',
        category: 'Dresses',
        type: 'swap',
        size: 'M',
        condition: 'excellent',
        points: 180,
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
        uploader: {
          name: 'Emma Wilson',
          rating: 4.9,
          swapsCompleted: 20
        },
        tags: ['recycled', 'polyester', 'elegant'],
        createdAt: new Date('2024-01-12'),
        location: 'Austin, TX'
      },
      {
        id: 6,
        title: 'Vintage Leather Boots',
        description: 'Classic leather boots in great condition. Timeless style.',
        category: 'Shoes',
        type: 'points',
        size: '8',
        condition: 'good',
        points: 250,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
        uploader: {
          name: 'Alex Rodriguez',
          rating: 4.5,
          swapsCompleted: 10
        },
        tags: ['vintage', 'leather', 'boots'],
        createdAt: new Date('2024-01-16'),
        location: 'Denver, CO'
      }
    ];
    
    this.filteredItems = [...this.items];
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

      // Type filter
      const matchesType = formValue.type === 'All' || 
        (formValue.type === 'Swap' && item.type === 'swap') ||
        (formValue.type === 'Points' && item.type === 'points');

      // Size filter
      const matchesSize = formValue.size === 'All' || item.size === formValue.size;

      return matchesSearch && matchesCategory && matchesCondition && matchesType && matchesSize;
    });

    this.sortItems(formValue.sortBy);
  }

  sortItems(sortBy: string): void {
    switch (sortBy) {
      case 'newest':
        this.filteredItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        this.filteredItems.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'points-high':
        this.filteredItems.sort((a, b) => b.points - a.points);
        break;
      case 'points-low':
        this.filteredItems.sort((a, b) => a.points - b.points);
        break;
      case 'rating':
        this.filteredItems.sort((a, b) => b.uploader.rating - a.uploader.rating);
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

  getTypeColor(type: string): string {
    return type === 'swap' ? '#4CAF50' : '#FF9800';
  }

  getTypeText(type: string): string {
    return type === 'swap' ? 'Swap' : 'Points';
  }
} 