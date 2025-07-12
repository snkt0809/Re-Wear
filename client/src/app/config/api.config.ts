import { environment } from '../../environments/environment';

export const API_CONFIG = {
  // ImgBB API Configuration
  IMGBB: {
    API_KEY: environment.api.imgbb.apiKey,
    UPLOAD_URL: environment.api.imgbb.uploadUrl
  },
  
  // Backend API Configuration
  BACKEND: {
    BASE_URL: environment.api.backend.baseUrl
  }
}; 