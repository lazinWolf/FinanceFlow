// Load the content from the JSON file
fetch('content.json')
  .then(response => response.json())
  .then(data => {
    // Populate the header section
    const header = document.querySelector('.header');
    header.innerHTML = `
      <div class="logo">
        <a href="index.html">
          <img src="${data.header.logo}" alt="FinanceFlow Logo">
        </a>
      </div>
      <nav class="navbar">
        ${data.header.nav.map(item => `
          <a href="${item.link}" class="nav-btn white">${item.name}</a>
        `).join('')}
      </nav>
      <div class="header-buttons">
        ${data.header.buttons.map(button => `
          <a href="${button.link}" class="black">${button.text}</a>
        `).join('')}
      </div>
    `;

    // Populate the main content
    const mainContent = document.querySelector('.content');
    mainContent.innerHTML = `
      <div class="intro-text">
        <h1 class="heading">${data.main.intro.heading}</h1>
        <p>${data.main.intro.description}</p>
        <a href="${data.main.intro.ctaLink}"><button class="cta-button">${data.main.intro.ctaText}</button></a>
        <p class="flow-text">${data.main.intro.subtext}</p>
        <p><a href="${data.main.intro.aboutLink}" class="link">${data.main.intro.aboutText}</a></p>
      </div>
      <div class="image-container">
        <img src="images/home img bw.png" alt="Home Image" class="home-image">
      </div>
    `;

    // Populate the about section
    const aboutSection = document.querySelector('.about');
    aboutSection.innerHTML = `
      <h2>${data.main.about.title}</h2>
      <p>${data.main.about.content}</p>
    `;

    // Populate the features section
    const featuresSection = document.querySelector('.features');
    featuresSection.innerHTML = `
      <h2>Features</h2>
      <div class="feature-list">
        ${data.main.features.map(feature => `
          <div class="feature-item">
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
          </div>
        `).join('')}
      </div>
    `;

    // Populate the testimonials section
    const testimonialsSection = document.querySelector('.testimonials');
    testimonialsSection.innerHTML = `
      <h2>What Our Users Say</h2>
      <div class="testimonial-list">
        ${data.main.testimonials.map(testimonial => `
          <div class="testimonial-item">
            <p>${testimonial.quote}</p>
            <span>${testimonial.author}</span>
          </div>
        `).join('')}
      </div>
    `;

    // Populate the call to action section
    const ctaSection = document.querySelector('.cta-section');
    ctaSection.innerHTML = `
      <h2>${data.main.cta.heading}</h2>
      <a href="${data.main.cta.ctaLink}"><button class="cta-button">${data.main.cta.ctaText}</button></a>
    `;

    // Populate the footer section
    const footer = document.querySelector('.footer');
    footer.innerHTML = `
      <p>${data.footer.copyright}</p>
      <div class="social-media">
        ${data.footer.socialMedia.map(item => `
          <a href="${item.link}">
            <img src="${item.icon}" alt="${item.platform}">
          </a>
        `).join('')}
      </div>
    `;
  })
  .catch(error => console.error('Error loading JSON:', error));