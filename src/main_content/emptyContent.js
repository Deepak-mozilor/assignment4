
export function emptyDashboard(){
    const globe = document.createElement('p');
    const div = document.createElement('div');
    div.setAttribute('class','container')
    const dashboard = document.querySelector('.dashboard');
    globe.textContent = '🌏';
    globe.setAttribute('class','globe');

    const heading = document.createElement('h3');
    heading.textContent = 'No Cities Yet!';

    const para = document.createElement('p');
    para.setAttribute('class','para');
    para.textContent = `Search for a city above to start tracking weather across \n the world. You can track up to 8 cities at once.`

    div.append(globe);
    div.append(heading);
    div.append(para);

    dashboard.append(div);
}