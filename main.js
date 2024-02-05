const form = document.forms['card-form'];

form.addEventListener('submit', submit);

['change', 'input'].forEach((eventType) =>
  form.addEventListener(eventType, function (e) {
    // ignore delete key presses
    if (e.inputType?.startsWith('delete')) return;

    let formattedValue = e.target.value;
    if (!formattedValue?.length) {
      return;
    }

    // remove non-numeric characters
    if (e.target.inputMode === 'numeric') {
      formattedValue = formattedValue.replace(/\D/g, '');
    }

    // add a space after every 4 digits
    if (e.target.name === 'card-number') {
      formattedValue = formattedValue
        .replaceAll(' ','')
        .replace(/(.{4})/g, '$1 ');
    }

    // add a leading zero for months and years
    if (
      e.type === 'change' &&
      e.target.name.startsWith('card-expiry-') &&
      formattedValue.length === 1
    ) {
      formattedValue = `0${formattedValue}`;
    }

    // limit the length of the input
    if (e.target.maxLength > -1 && formattedValue.length > e.target.maxLength) {
      formattedValue = formattedValue.slice(0, e.target.maxLength);
    }

    e.target.value = formattedValue;
  })
);

function submit(event){
  if(!this.checkValidity()){
    this.classList.add('validated');
    alert('Invalid input');
  }
  event.preventDefault();
}