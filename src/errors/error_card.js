export function error_card(message){

    const container = document.querySelector('.dashboard');

    const card = document.createElement('div');
    card.classList.add('city-card','error-card');

    card.innerHTML = `
        <div class="error-content">
            <h3>⚠ Error</h3>
            <p>${message}</p>
            <button class="error-close">Close</button>
        </div>
    `;

    container.appendChild(card);

    card.querySelector('.error-close').addEventListener('click', () => {
        card.remove();
    });

}