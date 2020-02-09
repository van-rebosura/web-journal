let registerButton = document.querySelector('input[type="submit"]');

// registerButton.addEventListener('click', validateFields);


function validateFields() {



  let errors = [];
  const form = document.querySelector('form');
  let email = document.querySelector('input[name="email"]').value;
  let firstName = document.querySelector('input[name="firstName"]').value;
  let lastName = document.querySelector('input[name="lastName"]').value;
  let password = document.querySelector('input[name="password"]').value;
  let password2 = document.querySelector('input[name="password2"]').value;

  // check email

  let reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if(email === '') {
    let error = createError('email field is required');
    errors.push(error);
  }

  if(!reEmail.test(email)) {
    let error = createError('Invalid email');
    errors.push(error);
  }

  // check name
  if(firstName === '' || lastName === '') {
    let error = createError('Both name fields are required');
    errors.push(error);
  }

  // check password
  if(password === '') {
    let error = createError('password cannot be blank');
    errors.push(error);
  }

  if(password !== password2 || password === '' || password2 === '') {
    let error = createError('passwords do not match');
    errors.push(error);
  }

  if(errors) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    renderErrors(errors, form);
  }

  event.preventDefault();

}

function createError(errorMsg) {
  return {
    message: errorMsg
  };
}

function renderErrors(errors, form) {

  // clear old errors
  clearErrors(form);

  let errorDiv = document.querySelector('.error-div');


  for (let i = 0; i < errors.length; i++) {
        let node = document.createElement('p');
        node.innerHTML = errors[i].message;
        errorDiv.appendChild(node);
  }

}

function clearErrors(form) {
  let errorDiv = document.querySelector('.error-div').children;
  // console.log(errorDiv);
  for(let i = 0; i < errorDiv.length; i++) {
    let child = errorDiv[i];
    child.parentNode.removeChild(child);
  }
}
