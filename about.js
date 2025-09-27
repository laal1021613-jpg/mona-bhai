// About page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAbout();
});

function initializeAbout() {
    loadStoredData();
    generateProducts();
    setupAboutEventListeners();
    updateUI();
    animateStats();
}

function setupAboutEventListeners() {
    // FAQ toggle functionality is handled by the global toggleFAQ function
    // Add any about-specific event listeners here
}

function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = element.querySelector('i');
    
    // Close other open FAQs
    const allFAQs = document.querySelectorAll('.faq-item');
    allFAQs.forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            const otherAnswer = item.querySelector('.faq-answer');
            const otherIcon = item.querySelector('.faq-question i');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
    });
    
    // Toggle current FAQ
    faqItem.classList.toggle('active');
    
    if (faqItem.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
    } else {
        answer.style.maxHeight = '0';
        icon.style.transform = 'rotate(0deg)';
    }
}

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    stats.forEach(stat => {
        observer.observe(stat);
    });
}

function animateNumber(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/[^\d]/g, ''));
    const suffix = text.replace(/[\d,]/g, '');
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = number / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        let displayNumber = Math.floor(current);
        if (displayNumber >= 1000) {
            displayNumber = displayNumber.toLocaleString();
        }
        
        element.textContent = displayNumber + suffix;
    }, duration / steps);
}

// Add about page specific styles
const aboutStyles = `
.about-hero {
    padding: 120px 0 80px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: var(--white);
    text-align: center;
}

.about-hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.about-hero p {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
}

.mission-vision {
    padding: 80px 0;
    background: var(--white);
}

.content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 3rem;
}

.content-card {
    background: var(--gray-50);
    padding: 3rem;
    border-radius: 20px;
    text-align: center;
    transition: var(--transition);
}

.content-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.card-icon {
    font-size: 3rem;
    color: var(--primary-color);
    margin-bottom: 2rem;
}

.content-card h2 {
    color: var(--gray-900);
    margin-bottom: 1.5rem;
    font-size: 2rem;
}

.content-card p {
    color: var(--gray-700);
    line-height: 1.8;
    font-size: 1.1rem;
}

.company-story {
    padding: 80px 0;
    background: var(--gray-50);
}

.story-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.story-text h2 {
    font-size: 2.5rem;
    color: var(--gray-900);
    margin-bottom: 2rem;
}

.story-text p {
    color: var(--gray-700);
    line-height: 1.8;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
}

.story-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 3rem;
}

.stat-item {
    text-align: center;
    padding: 1.5rem;
    background: var(--white);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.stat-number {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.stat-label {
    color: var(--gray-600);
    font-size: 0.9rem;
    font-weight: 500;
}

.story-image img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.values {
    padding: 80px 0;
    background: var(--white);
}

.values h2 {
    text-align: center;
    font-size: 2.5rem;
    color: var(--gray-900);
    margin-bottom: 3rem;
}

.values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.value-card {
    background: var(--gray-50);
    padding: 2rem;
    border-radius: 16px;
    text-align: center;
    transition: var(--transition);
    border: 2px solid transparent;
}

.value-card:hover {
    border-color: var(--primary-color);
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.value-icon {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
}

.value-card h3 {
    color: var(--gray-900);
    margin-bottom: 1rem;
    font-size: 1.3rem;
}

.value-card p {
    color: var(--gray-700);
    line-height: 1.6;
}

.team {
    padding: 80px 0;
    background: var(--gray-50);
}

.team h2 {
    text-align: center;
    font-size: 2.5rem;
    color: var(--gray-900);
    margin-bottom: 3rem;
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
}

.team-member {
    background: var(--white);
    border-radius: 20px;
    padding: 2rem;
    text-align: center;
    transition: var(--transition);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.team-member:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.member-image {
    margin-bottom: 1.5rem;
}

.member-image img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid var(--primary-color);
}

.member-info h3 {
    color: var(--gray-900);
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
}

.member-role {
    color: var(--primary-color);
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 1rem;
}

.member-bio {
    color: var(--gray-700);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
}

.member-social {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.member-social a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--gray-100);
    color: var(--gray-600);
    border-radius: 50%;
    text-decoration: none;
    transition: var(--transition);
}

.member-social a:hover {
    background: var(--primary-color);
    color: var(--white);
    transform: translateY(-2px);
}

.faq {
    padding: 80px 0;
    background: var(--white);
}

.faq h2 {
    text-align: center;
    font-size: 2.5rem;
    color: var(--gray-900);
    margin-bottom: 3rem;
}

.faq-list {
    max-width: 800px;
    margin: 0 auto;
}

.faq-item {
    background: var(--gray-50);
    border-radius: 12px;
    margin-bottom: 1rem;
    overflow: hidden;
    transition: var(--transition);
}

.faq-item:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    cursor: pointer;
    transition: var(--transition);
}

.faq-question:hover {
    background: var(--gray-100);
}

.faq-question h3 {
    color: var(--gray-900);
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
}

.faq-question i {
    color: var(--primary-color);
    transition: var(--transition);
    font-size: 1.2rem;
}

.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
}

.faq-answer p {
    padding: 0 2rem 1.5rem;
    color: var(--gray-700);
    line-height: 1.6;
    margin: 0;
}

.faq-item.active .faq-answer {
    max-height: 200px;
}

.cta {
    padding: 80px 0;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: var(--white);
    text-align: center;
}

.cta-content h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.cta-content p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: rgba(255, 255, 255, 0.9);
}

.cta-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.cta .btn {
    font-size: 1.1rem;
    padding: 15px 30px;
}

.cta .btn-secondary {
    background: rgba(255, 255, 255, 0.2);
    color: var(--white);
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.cta .btn-secondary:hover {
    background: var(--white);
    color: var(--primary-color);
}

@media (max-width: 768px) {
    .about-hero h1 {
        font-size: 2rem;
    }
    
    .content-grid {
        grid-template-columns: 1fr;
    }
    
    .story-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .story-stats {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .values-grid {
        grid-template-columns: 1fr;
    }
    
    .team-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
    
    .cta-content h2 {
        font-size: 2rem;
    }
    
    .cta-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .cta .btn {
        width: 100%;
        max-width: 300px;
    }
    
    .content-card,
    .value-card,
    .team-member {
        padding: 1.5rem;
    }
    
    .faq-question {
        padding: 1rem 1.5rem;
    }
    
    .faq-answer p {
        padding: 0 1.5rem 1rem;
    }
}

@media (max-width: 480px) {
    .about-hero {
        padding: 100px 0 60px;
    }
    
    .about-hero h1 {
        font-size: 1.8rem;
    }
    
    .content-card h2,
    .values h2,
    .team h2,
    .faq h2,
    .cta-content h2 {
        font-size: 1.8rem;
    }
    
    .story-text h2 {
        font-size: 2rem;
    }
    
    .stat-number {
        font-size: 2rem;
    }
    
    .member-image img {
        width: 100px;
        height: 100px;
    }
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = aboutStyles;
document.head.appendChild(styleSheet);

// Export functions for global access
window.toggleFAQ = toggleFAQ;