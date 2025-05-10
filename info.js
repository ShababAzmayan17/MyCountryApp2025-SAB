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

function showError(message) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `<div class="error-message fade-in">${message}</div>`;
      }
      
function displayCountryInfo(country, resultDiv) {
        const card = document.createElement('div');
        card.className = 'card';
        const countryName = country.name.common;
        const officialName = country.name.official;
        const capital = country.capital && country.capital.length > 0 ? country.capital[0] : 'N/A';
        const region = country.region || 'N/A';
        const subregion = country.subregion || 'N/A';
        const population = country.population ? country.population.toLocaleString() : 'N/A';
        const flagUrl = country.flags.png;
        const flagAlt = country.flags.alt || `Flag of ${countryName}`;
        
        let languages = 'N/A';
        if (country.languages && Object.keys(country.languages).length > 0) {
          languages = Object.values(country.languages).join(', ');
        }
        
        let currencyHtml = 'N/A';
        if (country.currencies && Object.keys(country.currencies).length > 0) {
          currencyHtml = Object.entries(country.currencies).map(([code, currency]) => {
            return `<div class="currency-box">${code}: ${currency.name} (${currency.symbol || 'N/A'})</div>`;
          }).join('');
        }
        
        const timezones = country.timezones ? country.timezones.join(', ') : 'N/A';
        
        card.innerHTML = `
          <div class="grid">
            <div class="flag-container">
              <img src="${flagUrl}" class="flag" alt="${flagAlt}">
              <p><span class="info-label">Country Code:</span> ${country.cca2}</p>
            </div>
            <div class="country-info">
              <h2>${countryName}</h2>
              <p><span class="info-label">Official Name:</span> ${officialName}</p>
              <div class="info-group">
                <p><span class="info-label">Capital:</span> ${capital}</p>
                <p><span class="info-label">Region:</span> ${region} (${subregion})</p>
                <p><span class="info-label">Population:</span> ${population}</p>
              </div>
              <div class="info-group">
                <p><span class="info-label">Languages:</span> ${languages}</p>
              </div>
              <div class="info-group">
                <p><span class="info-label">Currencies:</span></p>
                <div class="currency-info">${currencyHtml}</div>
              </div>
              <div class="info-group">
                <p><span class="info-label">Time Zones:</span> ${timezones}</p>
              </div>
            </div>
          </div>
        `;
        
        resultDiv.appendChild(card);
        
        setTimeout(() => {
          card.style.opacity = "1";
          card.classList.add('fade-in-card');
        }, 100);
      }