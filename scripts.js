document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript is working!');

    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            event.preventDefault();
        }
    });
});
window.addEventListener(
  "scroll",
  () => {
    document.body.style.setProperty(
      "--scroll",
      window.pageYOffset / (document.body.offsetHeight - window.innerHeight)
    );
  },
  false
);