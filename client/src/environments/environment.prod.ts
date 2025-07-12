export const environment = {
  production: true,
  api: {
    backend: {
      baseUrl: 'http://localhost:8000/api' // Update this for production
    },
    imgbb: {
      apiKey: process.env['IMGBB_API_KEY'] || '',
      uploadUrl: 'https://api.imgbb.com/1/upload'
    }
  }
}; 