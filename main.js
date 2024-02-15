const form = document.forms['card-form'];

form.addEventListener('submit', submit);
document.querySelector('#complete__continue').addEventListener('click', reset);

['change', 'input'].forEach((eventType) =>
  form.addEventListener(eventType, function (e) {
    // ignore delete key presses
    if (e.inputType?.startsWith('delete')) {
      updatePreview(e, e.target.value);
      showError(e.target);
      return;
    }

    let formattedValue = e.target.value;
    if (!formattedValue?.length) {
      updatePreview(e, e.target.value);
      return;
    }

    // remove non-numeric characters
    if (e.target.inputMode === 'numeric') {
      formattedValue = formattedValue.replace(/\D/g, '');
    }

    // add a space after every 4 digits
    if (e.target.name === 'number') {
      formattedValue = formattedValue
        .replaceAll(' ', '')
        .replace(/(.{4})/g, '$1 ');
    }

    // add a leading zero for months and years
    if (
      e.type === 'change' &&
      e.target.name.startsWith('exp-') &&
      formattedValue.length === 1
    ) {
      formattedValue = `0${formattedValue}`;
    }

    // limit the length of the input
    if (e.target.maxLength > -1 && formattedValue.length > e.target.maxLength) {
      formattedValue = formattedValue.slice(0, e.target.maxLength);
    }

    if (e.type === 'change') {
      e.target.parentElement.classList.add('validated');
    }

    e.target.value = formattedValue;
    updatePreview(e, formattedValue);
    showError(e.target);
  })
);

form.number.addEventListener('invalid', function (e) {
  console.log('invalid', e.target.name, e.target.validity);
});

function showError(el) {
  if (el.validity.valid || !el.matches('.validated input')) {
    return;
  }

  const errorElement = document.querySelector(`.error__${el.name}`);

  if (el.maxLength > -1 && el.value.length < el.maxLength) {
    errorElement.textContent = 'Too short';
  } else if (el.minLength > -1 && el.value.length > el.minLength) {
    errorElement.textContent = 'Too long';
  } else {
    errorElement.textContent = el.validity.valueMissing
      ? "Can't be blank"
      : 'Wrong format';
  }
}

function updatePreview(e, formattedValue) {
  const previewElement = document.querySelector(`.preview__${e.target.name}`);
  previewElement.textContent = formattedValue;
}

function submit(event) {
  event.preventDefault();
  this.classList.add('validated');

  if (!this.checkValidity()) {
    return;
  }

  document.querySelector('.complete').classList.remove('hidden');
  form.classList.add('hidden');
}

function reset() {
  document.querySelector('.complete').classList.add('hidden')
  form.classList.remove('hidden');
  
  form.reset();
  document.querySelector('.preview__cvc').textContent = '000';
  document.querySelector('.preview__number').textContent =
  '0000 0000 0000 0000';
  document.querySelector('.preview__name').textContent = 'Jane Appleseed';
  document.querySelector('.preview__exp-month').textContent = '00';
  document.querySelector('.preview__exp-year').textContent = '00';
  document
  .querySelectorAll('.validated')
  .forEach((el) => el.classList.remove('validated'));
}
