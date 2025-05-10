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

function searchCountry() {
    const countryInput = document.getElementById('countryInput');
    const countryName = countryInput.value.trim();
    const resultDiv = document.getElementById('result');
    
    resultDiv.innerHTML = '';
    
    if (!countryName) {
      showError('Please enter a country name');
      return;
    }
    
    resultDiv.innerHTML = '<div class="loading">Searching for country data...</div>';

    fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Country not found');
        }
        return response.json();
      })
      .then(countries => {
        resultDiv.innerHTML = '';
        
        let countriesToShow = [];
        
        if (countries.length > 5) {
          for (let i = 0; i < 5; i++) {
            countriesToShow.push(countries[i]);
          }
        } else {
          countriesToShow = countries;
        }
        
        countriesToShow.forEach(country => {
          displayCountryInfo(country, resultDiv);
        });    

        if (countries.length > 5) {
            const moreResultsMessage = document.createElement('p');
            moreResultsMessage.className = 'fade-in';
            moreResultsMessage.style.textAlign = 'center';
            moreResultsMessage.style.fontStyle = 'italic';
            moreResultsMessage.style.color = '#5e5143';
            moreResultsMessage.textContent = `Showing 5 of ${countries.length} matching countries.`;
            resultDiv.appendChild(moreResultsMessage);
          }
          
          countryInput.value = '';
        })
        .catch(error => {
          showError(error.message + '. Please try again.');
          console.error(error);
        });
    }