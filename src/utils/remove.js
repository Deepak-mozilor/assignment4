import { emptyDashboard } from "../main_content/emptyContent.js";

export function remove_btn(){

    document.addEventListener('click', (e)=>{

        if(!e.target.classList.contains('remove')) return;

        console.log('remove function started');

        let city_arr = JSON.parse(localStorage.getItem('store_city')) || [];

        const id = e.target.id.toLowerCase();

        let index = city_arr.findIndex(item => item.city === id);

        if(index !== -1){
            city_arr.splice(index,1);
            localStorage.setItem('store_city',JSON.stringify(city_arr));
        }

        e.target.closest('.city-card').remove();

        if(city_arr.length === 0){
            emptyDashboard();
        }
    });
}