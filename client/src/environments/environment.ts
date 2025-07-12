export const environment = {
  production: false,
  api: {
    backend: {
      baseUrl: 'http://localhost:8000/api'
    },
    imgbb: {
      apiKey: process.env['IMGBB_API_KEY'] || '',
      uploadUrl: 'https://api.imgbb.com/1/upload'
    }
  }
}; 