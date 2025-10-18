document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll('form[validation="auto"]');
  const strengthMeter = document.getElementById("password-strength");
  const successMessage = document.getElementById("success-message");

  const debounce = (fn, delay=200) => {
    let timer;
    return (...args)=> { clearTimeout(timer); timer = setTimeout(()=>fn(...args), delay); };
  };

  const genericPhone = /^\+?[0-9\s]{6,20}$/;

  forms.forEach(form => {

    const validateField = (input) => {
      const type = input.getAttribute("validation");
      const value = input.value.trim();
      let error = "";

      if(value !== "") {
        switch(type) {
          case "name":
            if(!/^[a-zA-Z\s]+$/.test(value)) error = "Name can only contain letters and spaces.";
            break;
          case "phone":
            if(!genericPhone.test(value)) error = "Enter a valid phone number.";
            break;
          case "email":
            if(!/^\S+@\S+\.\S+$/.test(value)) error = "Enter a valid email address.";
            break;
          case "password":
            let strengthPoints = 0;
            if(value.length >= 8) strengthPoints++;
            if(/[A-Z]/.test(value)) strengthPoints++;
            if(/[a-z]/.test(value)) strengthPoints++;
            if(/[0-9]/.test(value)) strengthPoints++;
            if(/[\W_]/.test(value)) strengthPoints++;
            if(strengthPoints < 3) error="Password too weak.";
            const colors = ["red","orange","yellow","green","purple"];
            strengthMeter.style.width = (strengthPoints/5*100) + "%";
            strengthMeter.style.backgroundColor = colors[strengthPoints-1] || "red";
            break;
          case "confirm":
            const pw = form.querySelector('input[validation="password"]').value;
            if(pw && value !== pw) error = "Passwords do not match.";
            break;
        }
      } else if(type==="password") {
        strengthMeter.style.width="0%";
      }

      let errorEl = input.nextElementSibling;
      if(!errorEl || !errorEl.classList.contains("validation-error")){
        errorEl = document.createElement("div");
        errorEl.className="validation-error";
        input.insertAdjacentElement("afterend",errorEl);
      }
      errorEl.textContent = error;
      return error === "";
    };

    const debouncedValidate = debounce(validateField, 200);

    // Name restrictions
    const nameInput = form.querySelector('input[validation="name"]');
    if(nameInput){
      nameInput.addEventListener("keypress",(e)=>{ if(!/[a-zA-Z\s]/.test(e.key)) e.preventDefault(); });
      nameInput.addEventListener("paste",(e)=>{ 
        e.preventDefault(); 
        const clean = e.clipboardData.getData('text').replace(/[^a-zA-Z\s]/g,''); 
        nameInput.value = clean; debouncedValidate(nameInput);
      });
    }

    // Phone restrictions
    const phoneInput = form.querySelector('input[validation="phone"]');
    if(phoneInput){
      phoneInput.addEventListener("keypress",(e)=>{
        if(!/[0-9\+]/.test(e.key) || phoneInput.value.replace(/\D/g,'').length>=15) e.preventDefault();
      });
      phoneInput.addEventListener("paste",(e)=>{
        e.preventDefault();
        const paste = e.clipboardData.getData('text').replace(/[^\d\+]/g,'').slice(0,15);
        phoneInput.value = paste;
        debouncedValidate(phoneInput);
      });
    }

    // Real-time validation
    form.querySelectorAll("[validation]").forEach(input=>{
      input.addEventListener("input",()=>debouncedValidate(input));
    });

    // Form submit
    form.addEventListener("submit", e=>{
      e.preventDefault();
      successMessage.style.display = "none";
      let valid = true;
      form.querySelectorAll("[validation]").forEach(input=>{
        if(!validateField(input)) valid=false;
      });

      const passwordField = form.querySelector('input[validation="password"]');
      if(!passwordField.value.trim()){
        const errorEl = passwordField.nextElementSibling || document.createElement("div");
        errorEl.className="validation-error";
        errorEl.textContent="Password is required.";
        if(!passwordField.nextElementSibling) passwordField.insertAdjacentElement("afterend",errorEl);
        valid=false;
      }

      if(valid){
        successMessage.style.display = "block";
      }
    });

  });

  // Eye toggle
  const toggle = document.getElementById("toggle-password");
  const passwordInput = document.getElementById("password");
  const pupil = document.getElementById("eye-pupil");

  passwordInput.addEventListener("input", () => {
    toggle.style.display = passwordInput.value.length ? "block" : "none";
  });

  toggle.addEventListener("click", () => {
    if(passwordInput.type === "password") {
      passwordInput.type = "text";
      pupil.setAttribute("r","0");
    } else {
      passwordInput.type = "password";
      pupil.setAttribute("r","2");
    }
  });

});
