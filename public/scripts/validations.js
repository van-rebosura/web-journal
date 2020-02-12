const PASSWORD_LENGTH = 8;
const STRING_BLANK = '';

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
  if (email === STRING_BLANK) {
    let error = createError('email field is required');
    errors.push(error);
  }

  if (!reEmail.test(email)) {
    let error = createError('invalid email');
    errors.push(error);
  }

  // check name
  if (firstName === STRING_BLANK || lastName === STRING_BLANK) {
    let error = createError('name fields are required');
    errors.push(error);
  }

  // check password
  if (password === '') {
    let error = createError('password cannot be blank');
    errors.push(error);
  }

  if (password !== password2) {
    let error = createError('passwords do not match');
    errors.push(error);
  }

  if(password.length < PASSWORD_LENGTH) {
    let error = createError('password must consist of 8 characters or longer');
    errors.push(error);
  }

  if (errors.length !== 0) {
    // event.returnValue is an IE fix.
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    renderErrors(errors, form);
  }

}

// this function returns an error object
function createError(errorMsg) {
  return {
    message: errorMsg
  };
}

// this function will create and show p elements to the div with class "error-div" for each error
function renderErrors(errors, form) {

  // clear old errors
  clearErrors(form);

  let errorDiv = document.querySelector('.error-div');

  for (let i = 0; i < errors.length; i++) {
    let node = createErrorElement(errors[i].message);
    errorDiv.appendChild(node);
  }
}

function createErrorElement(errorMessage) {
  let node = document.createElement('p');
  node.innerHTML = errorMessage;
  node.classList.add('error');
  return node;
}

// removes all errors in the div with class "error-div"
function clearErrors(form) {
  let errorDiv = document.querySelector('.error-div').children;
  for (let i = 0; i < errorDiv.length; i++) {
    let child = errorDiv[i];
    child.parentNode.removeChild(child);
  }
}
