// Form validation and interactions
    document.addEventListener('DOMContentLoaded', function() {
      const form = document.getElementById('registrationForm');
      const inputs = form.querySelectorAll('.form-input');
      
      // Add focus effects
      inputs.forEach(input => {
        input.addEventListener('focus', function() {
          this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
          this.parentElement.classList.remove('focused');
          validateField(this);
        });
      });
      
      // Form submission
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
          if (!validateField(input)) {
            isValid = false;
          }
        });
        
        if (isValid) {
          // Simulate registration process
          const submitBtn = form.querySelector('.register-btn');
          const originalText = submitBtn.textContent;
          submitBtn.textContent = 'CREANDO CUENTA...';
          submitBtn.disabled = true;
          
          setTimeout(() => {
            alert('¡Cuenta creada exitosamente!');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 2000);
        }
      });
      
      function validateField(input) {
        const errorMsg = input.parentElement.querySelector('.error-message');
        let isValid = true;
        
        // Remove previous error state
        input.classList.remove('input-error');
        errorMsg.style.display = 'none';
        
        if (input.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value)) {
            showError(input, errorMsg);
            isValid = false;
          }
        } else if (input.type === 'password') {
          if (input.value.length < 8) {
            showError(input, errorMsg);
            isValid = false;
          }
        } else if (input.placeholder.includes('Repite')) {
          const passwordInput = form.querySelector('input[placeholder*="Mínimo"]');
          if (input.value !== passwordInput.value) {
            showError(input, errorMsg);
            isValid = false;
          }
        } else if (input.value.trim() === '') {
          showError(input, errorMsg);
          isValid = false;
        }
        
        return isValid;
      }
      
      function showError(input, errorMsg) {
        input.classList.add('input-error');
        errorMsg.style.display = 'block';
      }
      
      // Google button animation
      document.querySelector('.google-btn').addEventListener('click', function() {
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
          this.style.transform = '';
          alert('Funcionalidad de Google en desarrollo');
        }, 150);
      });
    });