const searchInput = document.getElementById('search');
const autocomplete = document.getElementById('autocomplete');
const repoList = document.getElementById('repo-list');

function debounce(callback, interval = 1500) {
    let timeoutId;

    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback(...args);
        }, interval);
    };
}

function addRepository(repo) {
    const container = document.createElement('div');
    container.className = 'repo'

    const info = document.createElement('div');
    info.className = 'repo-info'
    info.innerHTML = `Name: ${repo.name} <br> Owner: ${repo.owner.login}<br> Stars: ${repo.stargazers_count}`;

    const delBtn = document.createElement("button")
    delBtn.className = 'delete-btn';
    delBtn.textContent = 'удалить';
    delBtn.addEventListener( 'click', () => {
        container.remove()
    })
    container.appendChild(info);
    container.appendChild(delBtn);
    repoList.appendChild(container);
}


const debouncedSearch = debounce(() => {
    const query = searchInput.value
    autocomplete.innerHTML  = ''

    if(!query) return
    fetch(`https://api.github.com/search/repositories?q=${(query)}&per_page=5`)
        .then( res => {
            if(res.status === 403 || res.status === 429){
                const elError = document.createElement('div')
                elError.className = 'autocomplete-error'
                elError.textContent = 'превышен лимит запросов'
                autocomplete.appendChild(elError)
                throw new Error('лимит запросов превышен')

            }
            return res.json()
        })
        .then(data => {
            if (!data.items || data.items.length === 0) {
                autocomplete.innerHTML = 'Ничего не найдено';
                return
            }
            data.items.forEach(repo => {
                const div = document.createElement('div')
                div.className = 'autocomplete-children'

                const repoName = document.createElement('div')
                repoName.className = 'autocomplete-children-name'
                repoName.textContent = repo.name

                const repoStars = document.createElement('div')
                repoStars.className = 'autocomplete-children-stars'
                repoStars.textContent = `Stars: ${repo.stargazers_count}`;
                div.appendChild(repoName)
                div.appendChild(repoStars)


                div.addEventListener( 'click', () => {
                    addRepository(repo);
                    autocomplete.innerHTML = '';
                    searchInput.value = '';
                })
                autocomplete.appendChild(div)
            })
        })


})
searchInput.addEventListener('input', () => { debouncedSearch()});

