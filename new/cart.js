class Cart {
    constructor(){
        //Инконка поверх корзины, отображающая количество продуктов в корзине
        this.count = document.querySelector('.cart__count');
        this.basket = document.querySelector('.drop');
        this.total = document.querySelector('.goods__total');
        //Общее количество товаров в корзине
        this.countProduct = 0;

        //массив, где хранятся элементы товаров в корзине
        this.productsArr = [];
    }

    /**
     *Функция добавления товара в корзину       
     *Проверяет есть ли такой товар уже в корзине           
     *Если есть - меняет количество конкретного товара, если нет - добавляет товар      
     * @param {*} product  продукт, который добавляют в корзину     
     */
    addProductInBasket(product){   
        if(this.isProductInBacket(product.dataset.id)){
            this.addCountProduct(product.dataset.id);
        }
        else{
            this.addNewProduct(product);
        } 
        this.countProduct++; 
        this.changeCountBadge();  
        this.sumTotal();  
    }

    /**
     *Функция считаем сумму всех товаров в корзине      
     *Если корзина пуста - выводит пустое поле      
     *Если нет - умножает цену товара на его количество и суммирует всю стоимость
     */
    sumTotal(){
        if(this.productsArr.length == 0){
            this.total.querySelector('.drop__total').innerText = "";
            return 
        }
        let sum = 0;
        this.productsArr.forEach(function(product){
            let price = parseInt(product.price.split(' ').join(''));
            let count = +product.count;
            sum += price * count;
        })
        this.total.querySelector('.drop__total').innerText =`${sum} ₽`;
    }


    /**
     *Функция проверяет есть ли уже такой продукт в корзине
     *Возвращает true если продукт уже есть, false - если нет
     * @param {*} id id добавляемого продукта
     * @returns 
     */
    isProductInBacket(id){
        for (let i = 0; i < this.productsArr.length; i++) {
            if(this.productsArr[i].id == id){
                return true;
            }
        }
        return false;
    }

    /**
     *Функция увеличивающая количество конкретного товара на 1
     *
     * @param {*} id продукт в корзине, у которого необходимо поменять количество
     */
    addCountProduct(id){
        let product = this.getProductById(id);
        product.querySelector('.goods__count').value ++;
        for (let i = 0; i < this.productsArr.length; i++) {
            if(this.productsArr[i].id == id){
                this.productsArr[i].count++;
            }
        }
    }

    /**
     *Возвращает новый объект продукта
     *
     * @param {*} product
     * @returns
     * @memberof Cart
     */
    getNewObjProduct(product){
        return {
            id: product.dataset.id,
            name: product.querySelector('.product__name').innerText,
            src: product.querySelector('img').src,
            price: product.querySelector('.product__price').innerText,
            count: 1
        }
    }

    /**
     *Функция добавляет новый элемен товара       
     *Добавляет элементу новые параметры и добавляет в разметку     
     *Создает событие нажатия на кнопку delete этого элемента       
     * @param {*} product  продукт, который добавляют в корзину
     */
    addNewProduct(product){
        let objProduct = this.getNewObjProduct(product);
        //Добавляем элемент в разметку перед подсчетом общей суммы
        this.total.insertAdjacentHTML('beforebegin', this.getProductHTML(objProduct));
        this.productsArr.push(objProduct);
        this.addEventsListener(objProduct.id);    
    }

    getProductById(id){
        return this.basket.querySelector(`.goods[data-id='${id}']`);
    }
    
    addEventsListener(id){
        let product = this.getProductById(id);
        let buttonDelete = product.querySelector('.goods__delete');
        let count = product.querySelector('.goods__count');
        buttonDelete.addEventListener('click', this.handlerEventDelete.bind(this));
        count.addEventListener('change', this.handlerEventChangeCount.bind(this));
    }

    handlerEventChangeCount(evt){
        let product = this.getProductById(evt.currentTarget.parentNode.dataset.id);
        this.countProduct--;
        this.changeCountBadge();
        this.sumTotal(); 
    }

    /**
     *Обработка события - нажатие на кнопку удалить продукт из корзины
     *
     */
    handlerEventDelete(evt){
        let parent = evt.currentTarget.parentNode;
        let count = +parent.querySelector('.goods__count').value;
        this.deleteProduct(parent.dataset.id);
        this.countProduct = this.countProduct - count;
        parent.remove();
        this.changeCountBadge();
        this.sumTotal(); 
    }

    /**
     *Функция удаляет продукт из массива с продуктами в корзине
     *
     * @param {*} id id продукта, который надо удалить
     */
    deleteProduct(id){
        for (let i = 0; i < this.productsArr.length; i++) {
            if(this.productsArr[i].id == id){
                this.productsArr.splice(this.productsArr[i], 1);
            }
        }
    }

    /**
     *Функция изменяет маркер с количеством товаров на иконке корзины
     *Если товаров в корзине нет - маркер убирается и в корзину добавляется сообщение 'В корзине пусто'
     */
    changeCountBadge(){
        if(this.countProduct == 0){
            this.count.style.display = 'none';  
            this.total.querySelector('.drop__info').innerText = 'В корзине пусто' ;        
        }
        else{
            this.count.style.display = 'block';  
            this.count.innerHTML = this.countProduct;
            this.total.querySelector('.drop__info').innerText = 'Total:';
        }  
    }

   
    /**
     *Возвращает готовую разметку продукта в корзине
     *
     * @param {Object} objProduct
     * @returns
     */
    getProductHTML(objProduct){
        return  `<div class="goods" data-id="${objProduct.id}">
                    <img src="${objProduct.src}" alt="" class="goods__img">
                    <div class="goods__text">
                        <p class="goods__name">${objProduct.name}</p>
                        <p class="goods__price">${objProduct.price}</p>
                    </div>
                    <input class="goods__count" type="number" value="${objProduct.count}">
                    <p class = "goods__number">&nbsp;шт</p>
                    <div class="goods__delete"><i class="far fa-trash-alt">q</i></div>
                </div>`
        
    }
}
