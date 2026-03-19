// Email capture for newsletter and calculator
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) newsletterForm.addEventListener('submit', handleNewsletterSubmit);

    const calculatorForm = document.getElementById('calculator-email-form');
    if (calculatorForm) calculatorForm.addEventListener('submit', handleCalculatorEmail);
});

async function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const button = e.target.querySelector('button');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Submitting...';

    try {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email, 
                source: 'newsletter', 
                timestamp: new Date().toISOString() 
            })
        });

        if (response.status === 409) {
            // Email already subscribed
            alert('This email is already subscribed to our newsletter!');
        } else if (response.ok) {
            // Success
            document.getElementById('success-message').classList.remove('hidden');
            e.target.reset();
        } else {
            // Other error
            alert('Something went wrong. Please try again later.');
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error. Please check your connection.');
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}

async function handleCalculatorEmail(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const button = e.target.querySelector('button');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending...';

    try {
        const totalWeight = document.getElementById('totalWeight')?.textContent || 'unknown';
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email, 
                source: 'pack_calculator', 
                pack_weight: totalWeight, 
                timestamp: new Date().toISOString() 
            })
        });

        if (response.status === 409) {
            alert('This email is already subscribed!');
        } else if (response.ok) {
            alert('Check your email for the free checklist!');
            e.target.reset();
        } else {
            alert('Something went wrong. Please try again later.');
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error. Please check your connection.');
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}