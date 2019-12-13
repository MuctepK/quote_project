const baseUrl = 'http://localhost:8000/api/v1/';

function getFullPath(path) {
    path = path.replace(/^\/+|\/+$/g, '');
    path = path.replace(/\/{2,}/g, '/');
    return baseUrl + path + '/';
}

function makeRequest(path, method, auth=true, data=null) {
    let settings = {
        url: getFullPath(path),
        method: method,
        dataType: 'json'
    };
    if (data) {
        settings['data'] = JSON.stringify(data);
        settings['contentType'] = 'application/json';
    }
    if (auth) {
        settings.headers = {'Authorization': 'Token ' + getToken()};
    }
    return $.ajax(settings);
}

function saveToken(token) {
    localStorage.setItem('authToken', token);
}

function getToken() {
    return localStorage.getItem('authToken');
}

function removeToken() {
    localStorage.removeItem('authToken');
}

function logIn(username, password) {
    const credentials = {username, password};
    let request = makeRequest('login', 'post', false, credentials);
    request.done(function(data, status, response) {
        console.log('Received token');
        saveToken(data.token);
        formModal.modal('hide');
        checkAuth()
    }).fail(function(response, status, message) {
        console.log('Could not get token');
        console.log(response.responseText);
    });
}

function logOut() {
    let request = makeRequest('logout', 'post', true);
    request.done(function(data, status, response) {
        console.log('Cleaned token');
        removeToken();
        checkAuth()
    }).fail(function(response, status, message) {
        console.log('Could not clean token');
        console.log(response.responseText);
    });
}

let logInForm, quoteForm, homeLink, enterLink, exitLink, createLink, editLink, deleteLink, formSubmit, formTitle, content, formModal,
    usernameInput, passwordInput, authorInput, textInput, emailInput, textEditInput, ratingInput, statusInput;

function setUpGlobalVars() {
    logInForm = $('#log_in_form');
    quoteForm = $('#quote_form');
    homeLink = $('#home_link');
    enterLink = $('#enter_link');
    exitLink = $('#exit_link');
    createLink = $('#create_link');
    editLink = $('#edit_link');
    deleteLink = $('#delete_link');
    formSubmit = $('#form_submit');
    formTitle = $('#form_title');
    content = $('#content');
    formModal = $('#form_modal');
    usernameInput = $('#username_input');
    passwordInput = $('#password_input');
    authorInput = $('#author_input');
    textInput = $('#text_input');
    emailInput = $('#email_input');
    textEditInput = $('#text_edit_input');
    ratingInput = $('#')
}

function setUpAuth() {
    logInForm.on('submit', function(event) {
        event.preventDefault();
        logIn(usernameInput.val(), passwordInput.val());
    });

    enterLink.on('click', function(event) {
        event.preventDefault();
        logInForm.removeClass('d-none');
        quoteForm.addClass('d-none');
        formTitle.text('Войти');
        formSubmit.text('Войти');
        formSubmit.off('click');
        formSubmit.on('click', function(event) {
            logInForm.submit();
        });
    });

    exitLink.on('click', function(event) {
        event.preventDefault();
        logOut();
    });
    quoteForm.on('submit', function(event){
        event.preventDefault();
        CreateQuote(textInput.val(), authorInput.val(), emailInput.val());
    });
    createLink.on('click', function(event){
        event.preventDefault();
        logInForm.addClass('d-none');
        quoteForm.removeClass('d-none');
        formTitle.text('Создать цитату');
        formSubmit.text('Создать');
        formSubmit.off('click');
        formSubmit.on('click', function(event){
            quoteForm.submit();
        })
    });
    editLink.on('click', function(event){
       event.preventDefault();
       quoteForm.removeClass('d-none');
        formTitle.text('Изменить цитату');
        formSubmit.text('Создать');
    });
    deleteLink.on('click', function (event) {
        event.preventDefault();

    })
}

function checkAuth() {
    let token = getToken();
    if(token) {
        enterLink.addClass('d-none');
        exitLink.removeClass('d-none');
        createLink.removeClass('d-none');
        $('.edit_btn').removeClass('d-none');
        $('.delete_btn').removeClass('d-none');
    } else {
        enterLink.removeClass('d-none');
        exitLink.addClass('d-none');
        createLink.addClass('d-none');
        $('.edit_btn').addClass('d-none');
        $('.delete_btn').addClass('d-none');
    }
}

function rateChange(id, type) {
    let request = makeRequest(type+'_rating/'+id, 'patch', false);
    request.done(function(data, status, response) {
        console.log(type + 'd rating of quote with id ' + id + '.');
        $('#rating_' + id).text('Рейтинг цитаты: ' + data.rating);
        console.log(data);
    }).fail(function(response, status, message) {
        console.log('Could not change rating of  quote with id ' + id + '.');
        console.log(response.responseText);
    });
}
function CreateQuote(text, author, email){
    const credentials = {text, author, email};
    let request = makeRequest('quotes', 'post', true, credentials);
    request.done(function(data, status, response) {
        console.log('Created new quote');
        formModal.modal('hide');
        $('#content').empty();
        getQuotes();
    }).fail(function(response, status, message) {
        console.log('Error during creating');
        console.log(response.responseText);
    });
}
function quoteDelete(id){
    let request = makeRequest('quotes/'+id, 'delete', true);
    request.done(function(data, status, response){
        console.log("Deleted quoted with id " + id);
        $(`#quote_${id}`).remove();
    }).fail( function(response, status, message){
        console.log("Could not delete quote with id "+ id);
        }

    )
}
function quoteDetail(id){
    let quote = $(`#quote_${id}`);
                let content = $('#content');
                content.children().each(function(_,item){
                    item = $(item);
                    if (item.attr('id')!==quote.attr('id')) item.addClass('d-none');
                });
                let backBtn = $(document.createElement("a"));
                backBtn.addClass("btn btn-info ");
                backBtn.text("Назад");
                content.append(backBtn);
                backBtn.on('click', function(event){
                    event.preventDefault();
                    content.children().each(function(_,item){
                    $(item).removeClass("d-none");
                });
                    backBtn.remove();
                })
}
function addButtonHandlers(id){
        $(`.change_rating_${id}`).on('click', function(event) {
                event.preventDefault();
                rateChange(id, $(event.target).data("type"));
            });

        $(`#delete_link_${id}`).on('click', function(event){
            event.preventDefault();
            quoteDelete(id);
        });
        $(`#edit_link_${id}`.on('click'), function(event){
            event.preventDefault();

        })
        $(`#view_detail_${id}`).on('click', function(event){
            event.preventDefault();
            quoteDetail(id);
        });
}


function getQuotes() {
    let request = makeRequest('quotes', 'get', false);
    request.done(function(data, status, response) {
        console.log(data);
        data.forEach(function(item, index, array) {
            content.append($(`<div class="card my-4" id="quote_${item.id}">
                <h3 class="mt-4 text-center">Цитата с номером <a href="" id="view_detail_${item.id}">${item.id}</a></h3>
                <p class="text-center">${item.text}</p>
                <h5 class="text-right mr-5" id="rating_${item.id}">Рейтинг цитаты:  ${item.rating}</h5>
                <div class="row justify-content-end mr-5 mx-0">
                <p><a href="#" class="btn btn-success mr-2 change_rating_${item.id}" data-type="increase">+</a></p>
                <p><a href="#" class="btn btn-danger change_rating_${item.id}" data-type="decrease">-</a></p>
                </div>
                <div class="row mx-0">
                <p><a href="" class="btn btn-info mr-2 edit_btn" id="edit_link_${item.id}">Изменить</a></p>
                <p><a href="" class="btn btn-warning delete_btn" id="delete_link_${item.id}">Удалить</a></p>
                </div>
            </div>`));
            addButtonHandlers(item.id);
        });
    }).fail(function(response, status, message) {
        console.log('Could not get quotes.');
        console.log(response.responseText);
    });
}


$(document).ready(function() {
    setUpGlobalVars();
    setUpAuth();
    getQuotes();
    checkAuth();
});