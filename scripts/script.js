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
    //  const modalCloseBtn = document.querySelector('[data-close');
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

    //  modalCloseBtn.addEventListener('click', closeModal);

     modal.addEventListener('click', (e) => {
         if (e.target === modal || e.target.getAttribute('data-close') == '') {
             closeModal();
         }
     })

     document.addEventListener('keydown', (e) => {
         if (e.code === 'Escape' && modal.classList.contains('modal_show')) {
             closeModal();
         }
     })

     window.addEventListener('scroll', showModalByScroll);

     /*forms*/
     const forms = document.querySelectorAll('form');
     const message ={
        // loading: ' ????????????????',
        loading: 'images/form/spinner.svg',
        success: '??????????????! ?????????? ???? ?? ???????? ????????????????',
        failure: ' ??????-???? ?????????? ???? ?????? ...'
     }

     forms.forEach(item =>{
        postData(item);
     })

     function postData(form){
        form.addEventListener('submit', (e)=>{
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
               statusMessage.style.cssText = `
               display: block;
               margin: 0 auto; 
               `;
            form.insertAdjacentElement('afterend', statusMessage);

            
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value,key){
                object[key] = value;
            });

            fetch('server.php', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(object)
            }).then(data => data.text())
            .then(data => {
                console.log(data);
                showThanksModal(message.success);

                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            })
        });
     }

     function showThanksModal(message){
        const prevModalDialog = document.querySelector('.modal__window');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__window');
        thanksModal.innerHTML = `
        <div class='modal__content'>
        <div data-close class="modal__close">&times;</div>
        <div class="modal__title">${message}</div>
        </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(()=>{
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
     }

     /*cards */ 

     class menuCard {
         constructor(src, alt, title, descr, price, parentSelector, ...classes) {
             this.src = src;
             this.alt = alt;
             this.title = title;
             this.descr = descr;
             this.price = price;
             this.classes = classes;
             this.parent = document.querySelector(parentSelector);
             this.transfer = 19;
             this.changeToLE();
         }

         changeToLE() {
             this.price = this.price * this.transfer;
         }

         render() {
             const element = document.createElement('div');
             if(this.classes.length === 0){
                this.element = 'menu__item';
                element.classList.add(this.element);
             }else{
                this.classes.forEach(className => element.classList.add(className));
             }
             element.innerHTML = `
                    <img class="menu__item-img" src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Price:</div>
                        <div class="menu__item-total"><span class="menu__item-span">${this.price}</span> LE/day</div>
                    </div>
`;
             this.parent.append(element);
         }
     }

     new menuCard(
         "images/tabs/Taamea3f.jpg",
         "Breakfast",
         'Breakfast',
         'Breakfast - Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda maiores, incidunt et saepe ipsa eaque. Molestias aspernatur dicta recusandae accusamus quibusdam, labore voluptas tenetur adipisci mollitia ad. Est, id mollitia.!',
         1,
         '.menu .menu__container'
     ).render();

     new menuCard(
         "images/tabs/Makhshi3f.jpg",
         "Dinner",
         'Dinner',
         'Dinner - Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda maiores, incidunt et saepe ipsa eaque. Molestias aspernatur dicta recusandae accusamus quibusdam, labore voluptas tenetur adipisci mollitia ad. Est, id mollitia.',
         4,
         '.menu .menu__container'
     ).render();

     new menuCard(
         "images/tabs/Coffee3f.jpg",
         "Drinks",
         'Drinks',
         'Drinks - Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda maiores, incidunt et saepe ipsa eaque. Molestias aspernatur dicta recusandae accusamus quibusdam, labore voluptas tenetur adipisci mollitia ad. Est, id mollitia.',
         0.5,
         '.menu .menu__container'
     ).render();
     

     /*??onverter */

     const inputRub = document.querySelector('#rub');
    const inputUsd = document.querySelector('#usd');
    const inputLe = document.querySelector('#le');

    inputRub.addEventListener('input', ()=>{
        const request = new XMLHttpRequest(); // ???????????????????? ????????????

        request.open('GET', 'scripts/current.json'); // ??????????
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8'); //?????????? (?????? ????????????????, ?????? ??????, ??????????????????) ??????????????????
        request.send(); // ?????????? ????????????????

        request.addEventListener('load', ()=>{
            //request.addEventListener('readystatechange', ()=>{ //???????????? ???????????????????? ??????????????
            if( request.status === 200){
                //if(request.readyState === 4 && request.status === 200){
                    // console.log(request.response); //?????????? ???? ??????????????
                    const data = JSON.parse(request.response); //???????????????????? ??????????
                    inputUsd.value =(+inputRub.value / data.current.usd).toFixed(2);
                    inputLe.value =(+inputRub.value / data.current.le).toFixed(2);


                }else{
                    inputUsd.value = "??????-???? ?????????? ???? ??????";
                    inputLe.value = "??????-???? ?????????? ???? ??????";
                }
            });


    
    
    
    
    
    });

 })