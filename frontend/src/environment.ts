export const environment = {
  apiUrl: window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://student-management-system-backend.onrender.com' // Replace with your actual backend Render URL once deployed!
};