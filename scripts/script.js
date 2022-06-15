 window.addEventListener('DOMContentLoaded', () => {
     /*Tabs */
     const tabsParent = document.querySelector('.tabheader__items');
     const tabs = document.querySelectorAll('.tabheader__item');
     const tabsContent = document.querySelectorAll('.tabcontent');


     function hideTabContent() {
         tabsContent.forEach(item => {
             // item.style.display = 'none';
             item.classList.add('hide');
             item.classList.remove('show', 'fade');
         })
         tabs.forEach(item => {
             item.classList.remove('tabheader__item_active');
         })

     }


     function showTabContent(i = 0) {
         // tabsContent[i].style.display = 'block';
         tabsContent[i].classList.add('show', 'fade');
         tabsContent[i].classList.remove('hide');
         tabs[i].classList.add('tabheader__item_active');

     }

     hideTabContent();
     showTabContent();

     tabsParent.addEventListener('click', (event) => {

         const target = event.target;
         if (target && target.classList.contains('tabheader__item')) {
             tabs.forEach((item, i) => {
                 if (target == item) {
                     hideTabContent();
                     showTabContent(i);
                 }
             })
         }
     })


     /*Chronometer */
     const deadLine = '2022-07-01';

     function getTimeRemaining(endTime) {
         let days, hours, minutes, seconds;
         const t = Date.parse(endTime) - Date.parse(new Date());
         if (t <= 0) {
             days = 0;
             hours = 0;
             minutes = 0;
             seconds = 0;
         } else {
             days = Math.floor(t / (1000 * 60 * 60 * 24));
             hours = Math.floor((t / 1000 * 60 * 60) % 24);
             minutes = Math.floor((t / 1000 / 60) % 60);
             seconds = Math.floor((t / 1000) % 60);
         }

         return {
             'total': t,
             'days': days,
             'hours': hours,
             'minutes': minutes,
             'seconds': seconds
         };

     }

     function getZero(num) {
         if (num >= 0 && num < 10) {
             return `0${num}`;
         } else {
             return num;
         }
     }

     function setClock(selector, endTime) {
         const timer = document.querySelector(selector);
         const days = timer.querySelector('#days');
         const hours = timer.querySelector('#hours');
         const minutes = timer.querySelector('#minutes');
         const seconds = timer.querySelector('#seconds');
         timeInterval = setInterval(updateClock, 1000);

         updateClock();

         function updateClock() {
             const t = getTimeRemaining(endTime);
             days.innerHTML = getZero(t.days);
             hours.innerHTML = getZero(t.hours);
             minutes.innerHTML = getZero(t.minutes);
             seconds.innerHTML = getZero(t.seconds);

             if (t.total <= 0) {
                 clearInterval(timeInterval);
             }
         }
     }



     setClock('.timer', deadLine);


     /*Modal */
     const modalTrigger = document.querySelectorAll('[data-modal]');
     const modal = document.querySelector('.modal');
     const modalCloseBtn = document.querySelector('[data-close');
     const modalTimerId = setTimeout(openModal, 5000);


     function openModal() {
         modal.classList.add('modal_show');
         document.body.style.overflow = 'hidden';
         clearInterval(modalTimerId);
     }

     function closeModal() {
         modal.classList.remove('modal_show');
         document.body.style.overflow = '';
     }

     function showModalByScroll() {
         if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
             openModal();
             window.removeEventListener('scroll', showModalByScroll);
         }
     }

     modalTrigger.forEach(btn => {
         btn.addEventListener('click', openModal)
     })

     modalCloseBtn.addEventListener('click', closeModal);

     modal.addEventListener('click', (e) => {
         if (e.target === modal) {
             closeModal();
         }
     })

     document.addEventListener('keydown', (e) => {
         if (e.code === 'Escape' && modal.classList.contains('modal_show')) {
             closeModal();
         }
     })

     window.addEventListener('scroll', showModalByScroll);

 })