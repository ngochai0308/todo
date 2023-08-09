const uri = 'https://localhost:7120/api/ToDolist';
let todos = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => {
            /*document.querySelector('body').innerText = "Không kết nối được api";*/
            console.error('Unable to get items.', error);
        });
            
}

function addItem() {
    let txtTitle = document.getElementById('add-title');
    let txtDescription = document.getElementById('add-description');
    const item = {
        title: txtTitle.value.trim(),
        description: txtDescription.value.trim()
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            txtTitle.value = '';
            txtDescription.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'GET',
    }).then(res => res.json()).then(data => {
        console.log(data);
        let confirmed = confirm(`Bạn có chắc muốn xóa ${data.title} không?`);
        if (confirmed) {
            fetch(`${uri}/${id}`, {
                method: 'DELETE'
            })
                .then(() => getItems())
                .catch(error => console.error('Unable to delete item.', error));
        }
    });


}

function displayEditForm(id) {
    const item = todos.find(item => item.id === id);

    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-title').value = item.title;
    document.getElementById('edit-description').value = item.description;
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        title: document.getElementById('edit-title').value.trim(),
        description: document.getElementById('edit-description').value.trim()
    };

    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    $('#myModal').modal('hide');

    return false;
}


function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
    if (data == null) {
        
    }
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('class', 'btn btn-primary');
        editButton.setAttribute('data-toggle', 'modal');
        editButton.setAttribute('data-target', '#myModal');
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('class', 'btn btn-danger');
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let textNodetitle = document.createTextNode(item.title);
        td1.appendChild(textNodetitle)

        let td2 = tr.insertCell(1);
        let textNodedescription = document.createTextNode(item.description);
        td2.appendChild(textNodedescription);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);
    });

    todos = data;
}
window.addEventListener('load', function() {
    // Khi trang web đã tải xong, ẩn hiệu ứng loading
    var loadingOverlay = document.querySelector('.loading-overlay');
    loadingOverlay.style.display = 'none';
    
    // Hiển thị nội dung trang web
    var contain = document.querySelector('.contain');
    contain.style.display = 'block';
});