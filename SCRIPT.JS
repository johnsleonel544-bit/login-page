// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const spinner = document.getElementById('spinner');
const togglePassword = document.querySelector('.toggle-password');
const passwordStrength = document.querySelector('.strength-meter');
const strengthText = document.getElementById('strengthText');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('themeIcon');
const biometricBtn = document.getElementById('biometricBtn');
const captchaModal = document.getElementById('captchaModal');
const verifyCaptchaBtn = document.getElementById('verifyCaptcha');

// State variables
let failedAttempts = 0;
const MAX_ATTEMPTS = 3;

// Theme Toggle
themeToggle.addEventListener('click', () => {
  document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  themeIcon.className = document.body.dataset.theme === 'dark' 
    ? 'fas fa-sun' 
    : 'fas fa-moon';
  localStorage.setItem('theme', document.body.dataset.theme);
});

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.dataset.theme = savedTheme;
themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

// Password Toggle
togglePassword.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  togglePassword.classList.toggle('fa-eye-slash');
});

// Password Strength Checker
passwordInput.addEventListener('input', () => {
  const strength = calculatePasswordStrength(passwordInput.value);
  updateStrengthMeter(strength);
});

function calculatePasswordStrength(password) {
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  
  // Character diversity
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  return Math.min(strength, 5); // Max strength = 5
}

function updateStrengthMeter(strength) {
  const percent = (strength / 5) * 100;
  const meter = passwordStrength.querySelector('.strength-meter');
  
  meter.style.width = `${percent}%`;
  
  // Update color and text
  if (strength <= 2) {
    meter.style.backgroundColor = '#ff0000';
    strengthText.textContent = 'Weak';
    strengthText.style.color = '#ff0000';
  } else if (strength <= 4) {
    meter.style.backgroundColor = '#ff9900';
    strengthText.textContent = 'Medium';
    strengthText.style.color = '#ff9900';
  } else {
    meter.style.backgroundColor = '#33cc33';
    strengthText.textContent = 'Strong';
    strengthText.style.color = '#33cc33';
  }
}

// Form Submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Validate inputs
  if (!validateEmail(emailInput.value)) {
    showError(emailInput, 'Please enter a valid email');
    return;
  }
  
  if (passwordInput.value.length < 8) {
    showError(passwordInput, 'Password must be at least 8 characters');
    return;
  }
  
  // Check if user is rate-limited
  if (failedAttempts >= MAX_ATTEMPTS) {
    showCaptcha();
    return;
  }
  
  // Simulate API call
  showLoading(true);
  
  try {
    const success = await mockLogin(emailInput.value, passwordInput.value);
    
    if (success) {
      // Successful login
      failedAttempts = 0;
      showSuccess();
      
      // Store fake JWT
      localStorage.setItem('token', 'fake-jwt-token');
      
      // Redirect to dashboard after delay
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      // Failed login
      failedAttempts++;
      showError(loginForm, 'Invalid email or password');
      
      if (failedAttempts >= MAX_ATTEMPTS) {
        showCaptcha();
      }
    }
  } catch (error) {
    showError(loginForm, 'An error occurred. Please try again.');
  } finally {
    showLoading(false);
  }
});

// Mock API Function
function mockLogin(email, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Fake credentials for demo
      const validEmail = 'user@example.com';
      const validPassword = 'Password123!';
      
      resolve(email === validEmail && password === validPassword);
    }, 1500);
  });
}

// Helper Functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showLoading(show) {
  if (show) {
    loginBtn.disabled = true;
    spinner.classList.remove('hidden');
    loginBtn.querySelector('span').textContent = 'Authenticating...';
  } else {
    loginBtn.disabled = false;
    spinner.classList.add('hidden');
    loginBtn.querySelector('span').textContent = 'Login';
  }
}

function showError(element, message) {
  // Create error element if it doesn't exist
  let errorElement = element.nextElementSibling;
  if (!errorElement || !errorElement.classList.contains('error-message')) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    element.parentNode.insertBefore(errorElement, element.nextElementSibling);
  }
  
  errorElement.textContent = message;
  errorElement.style.color = '#ff0000';
  errorElement.style.fontSize = '0.8rem';
  errorElement.style.marginTop = '5px';
  
  // Add shake animation to form
  loginForm.classList.add('shake');
  setTimeout(() => {
    loginForm.classList.remove('shake');
  }, 500);
}

function showSuccess() {
  // Create success element
  const successElement = document.createElement('div');
  successElement.className = 'success-message';
  successElement.textContent = 'Login successful! Redirecting...';
  successElement.style.color = '#33cc33';
  successElement.style.textAlign = 'center';
  successElement.style.marginTop = '20px';
  successElement.style.fontWeight = 'bold';
  
  loginForm.appendChild(successElement);
}

function showCaptcha() {
  captchaModal.classList.remove('hidden');
}

verifyCaptchaBtn.addEventListener('click', () => {
  captchaModal.classList.add('hidden');
  failedAttempts = 0;
});

// Biometric Login Mock
biometricBtn.addEventListener('click', () => {
  showLoading(true);
  
  setTimeout(() => {
    showLoading(false);
    showSuccess();
    
    // Store fake JWT
    localStorage.setItem('token', 'fake-jwt-token');
    
    // Redirect to dashboard after delay
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  }, 2000);
});

// Auto-focus email input on page load
emailInput.focus();