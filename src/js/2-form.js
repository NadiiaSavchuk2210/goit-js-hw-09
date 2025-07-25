import validator from 'validator';

const feedbackFormEl = document.querySelector('.feedback-form');

let formData = { email: '', message: '' };
const formLSKey = 'feedback-form-state';

initFormState();

feedbackFormEl.addEventListener('input', handleFormElInput);
feedbackFormEl.addEventListener('submit', handleFormElSubmit);

//!======================================================
function initFormState() {
  const data = getDataFromLS(formLSKey);

  try {
    if (data && typeof data === 'object') {
      formData.email = data.email || '';
      formData.message = data.message || '';

      const { email: emailEl, message: messageEl } = getFormElements();
      if (emailEl && messageEl) {
        emailEl.value = formData.email;
        messageEl.value = formData.message;
      }
    }
  } catch (error) {
    console.warn('Failed to parse LS or restore form state', error);
  }
}

function handleFormElInput(e) {
  removeError();
  const { name, value } = e.target;
  if (!(name in formData)) return;
  formData[name] = value;
  setDataToLs(formLSKey, formData);
}

function handleFormElSubmit(e) {
  e.preventDefault();
  const email = formData.email.trim();
  const message = formData.message.trim();

  const isValidEmail = validator.isEmail(email);
  const isEmptyEmail = email.length === 0;
  const isEmptyMessage = message.length === 0;

  if (!isEmptyEmail && !isValidEmail) {
    showError('Invalid email');
    return;
  } else if (isEmptyEmail || isEmptyMessage) {
    showError('Fill please all fields');
    return;
  }
  formData.email = email;
  formData.message = message;
  console.log(formData);
  resetForm(feedbackFormEl);
}

//!======================================================
function getFormElements() {
  const { email, message } = feedbackFormEl.elements;
  return { email, message };
}

function showError(errorText) {
  if (feedbackFormEl.querySelector('.form-error-message')) return;
  const errorMessageElem = `<p class="form-error-message">${errorText}</p>`;
  feedbackFormEl.insertAdjacentHTML('beforeend', errorMessageElem);
}

function removeError() {
  const oldErrorMessage = feedbackFormEl.querySelector('.form-error-message');
  if (oldErrorMessage) oldErrorMessage.remove();
}

function resetForm(formEl) {
  removeError();

  formEl.reset();
  formData = { email: '', message: '' };
  localStorage.removeItem(formLSKey);
}

//!======================================================
function setDataToLs(key, data) {
  const jsonObj = JSON.stringify(data);
  localStorage.setItem(key, jsonObj);
}

function getDataFromLS(key, defaultValue = {}) {
  const jsonData = localStorage.getItem(key);
  try {
    return jsonData ? JSON.parse(jsonData) : defaultValue;
  } catch (error) {
    console.warn('Failed to parse localStorage:', error);
    return defaultValue;
  }
}
