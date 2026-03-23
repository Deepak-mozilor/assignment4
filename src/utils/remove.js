import { emptyDashboard } from "../mainContent/emptyContent.js";

export function removeBtn(){

    document.addEventListener('click', (e)=>{

        if(!e.target.classList.contains('remove')) return;

        console.log('remove function started');

        let cityArr = JSON.parse(localStorage.getItem('storeCity')) || [];

        const id = e.target.id.toLowerCase();

        let index = cityArr.findIndex(item => item.city === id);

        if(index !== -1){
            cityArr.splice(index,1);
            localStorage.setItem('storeCity',JSON.stringify(cityArr));
        }

        e.target.closest('.city-card').remove();

        if(cityArr.length === 0){
            emptyDashboard();
        }
    });
}