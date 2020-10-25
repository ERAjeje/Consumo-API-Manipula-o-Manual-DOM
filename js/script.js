let api = [];
const url = 'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
let result = [];

let input = document.querySelector('#inputName');
let search = document.querySelector('#search');
let results = document.querySelector('#results');
let statistics = document.querySelector('#statistics');
let resultedFilter = [];

let countFemine = 0;
let countMasc = 0;
let sumAge = 0;
let mediaAge = 0;
let numberFormat = null;

getApi();
window.addEventListener('load', () => {
    search.addEventListener('click', onSubmit)
    input.addEventListener('keyup', onEnterSubmit)
    input.addEventListener('focus', changeButton)
    input.addEventListener('keyup', changeButton)
    preventFormSubmit();
    numberFormat = Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2});
    render();
});

async function getApi() {
    api = await fetch(url);
    api = await api.json();

    api = api.results.map(obj => {
        const { name, dob, gender, picture } = obj;
        return {
            firstName: name.first,
            lastName: name.last,
        
            age: dob.age,
            gender,
            thumbnail: picture.thumbnail
        };
    })
    result = api;
}

function preventFormSubmit() {
    function handleFormSubmit(event) {
        event.preventDefault();
    }

    var form = document.querySelector('form');
    form.addEventListener('submit', handleFormSubmit);
}

function onEnterSubmit(event) {
    if (event.key === 'Enter') {
        onSubmit();
    }
}

function onSubmit() {
    resultedFilter = [];
    let key = input.value.toLowerCase();

    let aux = result.filter(value => {
        const name = value.firstName + " " + value.lastName
        return name.toLowerCase().includes(key)
    });
    resultedFilter = [...aux];
    render();
}

function changeButton() {
    var hasText = !!input.value && input.value.trim() !== '';
    if (hasText) search.classList.remove('disabled');
}

function createResults() {
    let ul = '<ul>';

    resultedFilter.forEach(person => {
        const { firstName, lastName, age, thumbnail } = person;
        const li = `
            <li class="colection-item avatar row center">
                <div class="person">
                    <div><img src="${thumbnail}" class="circle"></div>
                    <div><span class="title">${firstName} ${lastName} ${age} anos</span></div>
                </div>
            </li>
        `;
        ul += li;
    });
    results.innerHTML += ul
}

function createTitle() {
    if (resultedFilter.length !== 0) {
        const h2_filtred = `<h2>${resultedFilter.length} usuário(s) encontrado(s)</h2>`;
        const h2_statistics = `<h2>Estatísticas</h2>`;
        results.innerHTML = h2_filtred;
        statistics.innerHTML = h2_statistics;
    } else {
        const h2_filtred = `<h2>Nenhum Usuário filtrado</h2>`;
        const h2_statistics = `<h2>Nada a ser exibido</h2>`;
        results.innerHTML = h2_filtred;
        statistics.innerHTML = h2_statistics;
    }
}

function createStatistics() {
    const intl = Intl.NumberFormat("pt-BR", {maximumFractionDigits: 2})
    sumAge = 0;
    sumAge = resultedFilter.reduce((i, curr) => {
        return i + curr.age
    }, 0);
    mediaAge = 0;
    mediaAge = sumAge / resultedFilter.length;
    countFemine = 0;
    countMasc = 0;
    countMasc = resultedFilter.reduce((i, curr) => {
        if (curr.gender === 'male')
            return i + 1;
        else
            return i + 0;
    }, 0);
    countFemine = resultedFilter.reduce((i, curr) => {
        if (curr.gender === 'female')
            return i + 1;
        else
            return i + 0;
    }, 0);
    const ul = `
        <ul>
            <li><strong>Sexo Masculino</strong>: ${countMasc}</li>
            <li><strong>Sexo Feminino</strong>: ${countFemine}</li>
            <li><strong>Soma das idades</strong>: ${sumAge}</li>
            <li><strong>Média das idades</strong>: ${formatedNumber(mediaAge)}</li>
        </ul>
    `;
    if (resultedFilter.length != 0)
        statistics.innerHTML += ul;
}

function render() {
    createTitle();
    createResults();
    createStatistics()
}

function formatedNumber(number) {
    return numberFormat.format(number);
}