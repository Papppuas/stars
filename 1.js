const searchInput = document.getElementById('search');
const autocomplete = document.getElementById('autocomplete');
const repoList = document.getElementById('repo-list');
const localRepo = JSON.parse(localStorage.getItem('repositories')) || []
console.log(localRepo)
function debounce(callback, interval = 3500) {
    let timeoutId;

    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback(...args);
        }, interval);
    };
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
                if(Array.isArray(localRepo) && localRepo.some(item => item.id === repo.id)){
                    div.style.backgroundColor = 'green'
                }
                autocomplete.appendChild(div)
            })
        })


})
searchInput.addEventListener('input', () => { debouncedSearch()});

