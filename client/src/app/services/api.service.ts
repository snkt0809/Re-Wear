import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  swapsCompleted: number;
  memberSince: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  points: number;
  images: string[];
  tags: string[];
  location: string;
  availability: 'available' | 'pending' | 'sold';
  uploader: {
    id: string;
    name: string;
    swapsCompleted: number;
    memberSince: string;
  };
  createdAt: string;
}

export interface SwapRequest {
  product1Id: string; // The item I want to swap FOR (other person's item)
  product2Id: string; // My item that I'm offering in exchange
  message: string;
}

export interface Swap {
  id: string;
  product1: Item;
  product2: Item;
  initiator: User;
  recipient: User;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Auth endpoints
  register(userData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/auth/me`, { headers: this.getHeaders() });
  }

  getUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${userId}`);
  }

  // Items endpoints
  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}/items`, { headers: this.getHeaders() });
  }

  getItemById(itemId: string): Observable<Item> {
    return this.http.get<Item>(`${this.baseUrl}/items/${itemId}`, { headers: this.getHeaders() });
  }

  createItem(itemData: {
    title: string;
    description: string;
    category: string;
    size: string;
    condition: string;
    points: number;
    location: string;
    tags: string[];
    brand?: string;
    color?: string;
    material?: string;
    imageUrls: string[];
  }): Observable<Item> {
    return this.http.post<Item>(`${this.baseUrl}/items/add`, itemData, { headers: this.getHeaders() });
  }

  // Swap endpoints
  initiateSwap(swapData: SwapRequest): Observable<Swap> {
    return this.http.post<Swap>(`${this.baseUrl}/swaps/initiate`, swapData, { headers: this.getHeaders() });
  }

  getMySwaps(): Observable<Swap[]> {
    return this.http.get<Swap[]>(`${this.baseUrl}/swaps/my-swaps`, { headers: this.getHeaders() });
  }

  approveSwap(swapId: string): Observable<Swap> {
    return this.http.put<Swap>(`${this.baseUrl}/swaps/${swapId}/approve`, {}, { headers: this.getHeaders() });
  }

  rejectSwap(swapId: string): Observable<Swap> {
    return this.http.put<Swap>(`${this.baseUrl}/swaps/${swapId}/reject`, {}, { headers: this.getHeaders() });
  }

  // Points redemption
  redeemWithPoints(itemId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/items/${itemId}/redeem`, {}, { headers: this.getHeaders() });
  }
} 