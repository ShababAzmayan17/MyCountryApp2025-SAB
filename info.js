document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchBtn').addEventListener('click', searchCountry);
    document.getElementById('countryInput').addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        searchCountry();
      }
    });
    
    document.getElementById('countryInput').addEventListener('focus', function() {
      document.querySelector('.search-bar').classList.add('active');
    });
  
    document.getElementById('countryInput').addEventListener('blur', function() {
      document.querySelector('.search-bar').classList.remove('active');
    });
  });
