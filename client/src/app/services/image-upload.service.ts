import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface ImgBBResponse {
  data: {
    id: string;
    title: string;
    url: string;
    display_url: string;
    size: number;
    delete_url: string;
    time: string;
  };
  success: boolean;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private readonly IMGBB_API_KEY = API_CONFIG.IMGBB.API_KEY;
  private readonly IMGBB_UPLOAD_URL = API_CONFIG.IMGBB.UPLOAD_URL;

  constructor(private http: HttpClient) {}

  /**
   * Upload a single image to ImgBB and return the public URL
   */
  uploadImage(file: File): Observable<string> {
    if (!this.IMGBB_API_KEY) {
      return new Observable(observer => {
        observer.error(new Error('ImgBB API key not configured. Please set IMGBB_API_KEY in your environment.'));
      });
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', this.IMGBB_API_KEY);

    const headers = new HttpHeaders();
    // Don't set Content-Type for FormData, let the browser set it with boundary

    return this.http.post<ImgBBResponse>(this.IMGBB_UPLOAD_URL, formData, { headers })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data.url; // Return the public URL
          } else {
            throw new Error('Image upload failed');
          }
        })
      );
  }

  /**
   * Upload multiple images to ImgBB and return array of public URLs
   */
  uploadImages(files: File[]): Observable<string[]> {
    if (files.length === 0) {
      return from([]);
    }

    const uploadObservables = files.map(file => this.uploadImage(file));
    
    return forkJoin(uploadObservables);
  }

  /**
   * Convert base64 data URL to File object for upload
   */
  dataURLtoFile(dataURL: string, filename: string): File {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  }

  /**
   * Upload images from base64 data URLs (current implementation)
   */
  uploadImagesFromDataURLs(dataURLs: string[]): Observable<string[]> {
    const files = dataURLs.map((dataURL, index) => 
      this.dataURLtoFile(dataURL, `image-${index + 1}.jpg`)
    );
    
    return this.uploadImages(files);
  }
} 