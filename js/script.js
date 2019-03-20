
// Klass för varje syssla.
function ListItem(id, task, done){
    this.Id = id;
    this.Task = task;
    this.Done = done;
}

// Den hårdkodade listan som följer med från början.
function todoListBase(){
    var t1 = new ListItem(0, 'Buy groceries', false);
    var t2 = new ListItem(1, 'Reschedule meetings', false);
    var t3 = new ListItem(2, 'Clean the apartment', false);
    var t4 = new ListItem(3, 'Collect parcel', false);
    var todoListBase = [t1, t2, t3, t4];
    return todoListBase;
}

// Hämtar den aktuella sparade listan från local-storage och returnerar den.
function todoList(){
    var string = localStorage.getItem('todoList');
    var todoList = JSON.parse(string);
    return todoList;
}

// Tar bort alla li-element från båda ul-listorna
function wipeLists(){
    var todoParent = document.getElementById('todoList');
    while (todoParent.firstChild) {
        todoParent.removeChild(todoParent.firstChild);
    }
    var hasDoneParent = document.getElementById('hasDoneList');
    while (hasDoneParent.firstChild) {
        hasDoneParent.removeChild(hasDoneParent.firstChild);
    }
}

// Gör egenskapen Done till true för den valda sysslan, sparar den till local storage,
// rensar listorna och skriver ut dem igen.
function finishTask(id, list){
    for(let j = 0; j < list.length; j++) {
        if(list[j].Id === id) {
            list[j].Done = true;
        }
    }
    localStorage.setItem('todoList', JSON.stringify(list));
    wipeLists();
    writeTodoList();
    writeHasDoneList();
}

// Skriver för varje syssla i listan ut ett li-element, ett innehåll och en checkbox med funktion.
function writeTodoList(){
    var list = todoList();
    for(let i = 0; i < list.length; i++){
        if(list[i].Done === false){
            var todoListItem = document.createElement('li');
            todoListItem.id = 'todoListItem' + list[i].Id;
            todoListItem.innerHTML = '- ' + list[i].Task;
            var todoListCheckbox = document.createElement('input');
            todoListCheckbox.type = 'checkbox';
            todoListCheckbox.id = 'checkbox' + list[i].Id;
            todoListCheckbox.onchange = function(){
                finishTask(list[i].Id, list);
            };
            todoListItem.appendChild(todoListCheckbox);
            var listParent = document.getElementById('todoList');
            listParent.appendChild(todoListItem);
        }
    }
}

// Samma som finishTask() fast ändrar Done till false.
function unfinishTask(id, list){

    for(let j = 0; j < list.length; j++) {
        if(list[j].Id === id) {
            list[j].Done = false;
        }
    }

    localStorage.setItem('todoList', JSON.stringify(list));
    wipeLists();
    writeTodoList();
    writeHasDoneList();
}

// Samma som writeTodoList() men för ul-elementet hasDoneList och utgår från sysslor där Done = true.
function writeHasDoneList(){
    var list = todoList();
    for(let i = 0; i < list.length; i++){
        if(list[i].Done === true){
            var hasDoneListItem = document.createElement('li');
            hasDoneListItem.id = 'hasDoneListItem' + list[i].Id;
            hasDoneListItem.innerHTML = '- ' + list[i].Task;
            var hasDoneListCheckbox = document.createElement('input');
            hasDoneListCheckbox.type = 'checkbox';
            hasDoneListCheckbox.id = 'checkbox' + list[i].Id;
            hasDoneListCheckbox.checked = true;
            hasDoneListCheckbox.onchange = function(){
                unfinishTask(list[i].Id, list);
            };
            hasDoneListItem.appendChild(hasDoneListCheckbox);
            var listParent = document.getElementById('hasDoneList');
            listParent.appendChild(hasDoneListItem);
        }
    }
}

// Sorterar antingen utifrån ändring i select-elementet eller om todoListBase skrivs ut
// fast select ändrats innan.
function sortList(path){
    var list;
    var method = document.getElementById('selectedSortingMethod').value;
    if(path === 'select'){
        list = todoList();
    } else{
        list = path;
    }
    if(method === 'Alphabetical'){
        list.sort(function(a, b){
        var x = a.Task.toLowerCase();
        var y = b.Task.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
        });
    } else{
        list.sort(function(a, b){
            return a.Id - b.Id;
        });
    }
    if(path === 'select'){
        localStorage.setItem('todoList', JSON.stringify(list));
        wipeLists();
        writeTodoList();
        writeHasDoneList();
    } else{
        return list;
    }
}

// Tar in värde från text-fält, skapar nytt objekt utifrån det och lägger in det sist(utifrån id) i listan.
function addTask(){
    var newTask = document.getElementById('addTaskTextField').value;
    if(newTask.length > 0){
        list = todoList();
        var newTaskObject = new ListItem(list.length, newTask, false);
        list.push(newTaskObject);
        list = sortList(list);
        localStorage.setItem('todoList', JSON.stringify(list));
        wipeLists();
        writeTodoList();
        writeHasDoneList();
        document.getElementById('addTaskTextField').value = '';
    }
}

// Körs onload. Ser till att man kan uppdatera sidan utan att todoListBase skriver över andra tillagda sysslor.
function init(){
    var currentList = todoList();
    if(currentList === null){
        var todoBase = todoListBase();
        todoBase = sortList(todoBase);
        localStorage.setItem('todoList', JSON.stringify(todoBase));
    } else{
        currentList = sortList(currentList);
        localStorage.setItem('todoList', JSON.stringify(currentList));
    }
    writeTodoList();
    writeHasDoneList();
}

// Nollställer local-storage och initierar listan igen.
function resetToBase(){
    localStorage.removeItem('todoList');
    wipeLists();
    init();
}