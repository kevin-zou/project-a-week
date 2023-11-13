const typewriterSpeed = 0;
const typewriterBaseSpeed = 65;
let busy = false;
let interrupt = false;

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function typewriterEffect(element, text) {
  return new Promise(async (resolve) => {
    busy = true;
    for (let index = 0; index < text.length; index++) {
      if (interrupt) {
        break;
      }
      element.innerHTML += text.charAt(index);
      const ms = typewriterBaseSpeed + (Math.random() * typewriterSpeed);
      await delay(ms);
    }
    interrupt = false;
    busy = false;
    resolve();
  });
}

function typewriterClearEffect(element) {
  const text = element.innerHTML;
  return new Promise(async (resolve) => {
    for (let index = text.length; index >= 0; index--) {
      element.innerHTML = text.substring(0, index);
      const ms = typewriterBaseSpeed + (Math.random() * typewriterSpeed);
      await delay(ms);
    }
    await delay(1000);
    resolve();
  });
}

window.addEventListener('load', async () => {
  const element = document.getElementById('text');
  await typewriterEffect(element, 'Hello world');
  await delay(3000);
  await typewriterClearEffect(element);
  typewriterEffect(element, 'Is anyone out there?');
  await delay(500);

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('buttons');
  
  const noButton = document.createElement('button');
  noButton.addEventListener('click', async () => {
    if (busy) {
      interrupt = true;
    }
    buttonContainer.remove();
    await typewriterClearEffect(element);
    await typewriterEffect(element, `Okay... I'll try again later`);
    await delay(3000);
    await typewriterClearEffect(element);
    await typewriterEffect(element, 'Goodbye world');
    await delay(3000);
    await typewriterClearEffect(element);
    await delay(1000);
    element.remove();
  });
  noButton.textContent = 'No';

  const yesButton = document.createElement('button');
  yesButton.addEventListener('click', async () => {
    if (busy) {
      interrupt = true;
    }
    buttonContainer.remove()
    await typewriterClearEffect(element);
    await typewriterEffect(element, `I'm glad that someone is there. Please visit again sometime`);
    await delay(3000);
    await typewriterClearEffect(element);
  });
  yesButton.textContent = 'Yes';

  buttonContainer.append(noButton);
  buttonContainer.append(yesButton);
  document.body.append(buttonContainer);
});
