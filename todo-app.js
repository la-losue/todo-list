

(function () {
    let arrayTodos = [];
    //заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title
        return appTitle

    };
    //форма для создания тела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let ButtonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        ButtonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;

        input.addEventListener('input', function () { //
            if (input.value != "") {
                button.disabled = false;
            } else {
                button.disabled = true;
            }

        })



        ButtonWrapper.append(button);
        form.append(input);
        form.append(ButtonWrapper);

        return {
            form,
            input,
            button
        };
    };
    //список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list
    };
    //item
    function createTodoItemElement(name) {
        let item = document.createElement('li');

        //кнопки перемещаем в элемент., который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button')
        let deleteButton = document.createElement('button');

        //устанавливаем стили для элемента списка, а так же для размещения кнопок в его
        //правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        let randomId = Math.random() * 15.75;
        item.id = randomId.toFixed(2);
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        //вкладываем кнопки в отдельный эелемент, чтобы они объеденились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        //пиложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
            buttonGroup
        };


    }

    //true/false 
    const changeItemDone = (arr, item) => {
        arr.map(elems => {
            if (elems.id === item.id && elems.done === false) {
                elems.done = true;
            } else if (elems.id === item.id && elems.done === true) {
                elems.done = false
            }
        });


    }
    //выделить дело как сделанное
    function completeItemDone(item, doneButton) {
        doneButton.addEventListener('click', function () {

            arrayTodos = JSON.parse(localStorage.getItem(key));
            item.classList.toggle('list-group-item-success');
            changeItemDone(arrayTodos, item);

            localStorage.setItem(key, JSON.stringify(arrayTodos));


        })
    }
    //удалить дело
    function deleteItemButton(item, deleteButton) {
        deleteButton.addEventListener('click', function () {
            arrayTodos = JSON.parse(localStorage.getItem(key));
            const newList = arrayTodos.filter(obj => obj.id != item.id);
            localStorage.setItem(key, JSON.stringify(newList))
            item.remove();
        });
    }

    

    async function createTodoApp(container, title = 'Задачи', key) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        //Сервер
        //Отправим запрос на список всех дел
        // const response = await fetch("http://localhost:3000/api/todos")
        // const todoItemList = await response.json()

        //Преобразуем получившийся выше список в DOM дерево
        // todoItemList.forEach(todoItem => {
        //     const todoItemElement = createTodoItemElement(todoItem)
        //     todoList.append(todoItemElement.item)
        // })

        //localStorage
        if (localStorage.getItem(key)) {
            arrayTodos = JSON.parse(localStorage.getItem(key));
            for (const obj of arrayTodos) {
                const todoItemElement = createTodoItemElement(todoItemForm.input.value);

                todoItemElement.item.textContent = obj.name;
                todoItemElement.item.id = obj.id;

                if (obj.done == true) {
                    todoItemElement.item.classList.add('list-group-item-success')
                } else {
                    todoItemElement.item.classList.remove('list-group-item-success');
                };

                completeItemDone(todoItemElement.item, todoItemElement.doneButton);
                deleteItemButton(todoItemElement.item, todoItemElement.deleteButton);

                todoList.append(todoItemElement.item);
                todoItemElement.item.append(todoItemElement.buttonGroup)

            }
        }

        //браузер создает событие submit на форме по нажатию Enter или на кнопку создания тела
        todoItemForm.form.addEventListener('submit', async function (e) {
            e.preventDefault();
            //игнорируем создание элемента если ничего не введено
            if (!todoItemForm.input.value) {
                return
            }

            // const response = await fetch("http://localhost:3000/api/todos", {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         name: todoItemForm.input.value.trim(),
            //         owner: 'Maxim'
            //     }),
            //     headers: {
            //         'Content-type': 'application/json'
            //     }
            // })
            // const todoItem = await response.json()
            

            let todoItemElement = createTodoItemElement(todoItemForm.input.value);

            completeItemDone(todoItemElement.item, todoItemElement.doneButton);
            deleteItemButton(todoItemElement.item, todoItemElement.deleteButton)

            let localStorageData = localStorage.getItem(key);
            if (localStorageData == null) {
                arrayTodos = []
            } else {
                arrayTodos = JSON.parse(localStorageData)
            }
            // создадим функцию добавления объекта в массив дел
            const createItemObj = () => {
                let itemObj = {}
                itemObj.name = todoItemForm.input.value;
                itemObj.id = todoItemElement.item.id;
                itemObj.done = false;
                arrayTodos.push(itemObj)
            }
            createItemObj(arrayTodos);
            //добавим массив дел в localStorage
            localStorage.setItem(key, JSON.stringify(arrayTodos));
            //создаем и добавляем в список новое дело с названием из поля ввода
            todoList.append(todoItemElement.item);
            //обнуляем значение в поле, чтобы не пришлость стирать его вручную
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;


        })
    }
    window.createTodoApp = createTodoApp;


})();