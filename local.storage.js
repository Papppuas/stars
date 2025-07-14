function saveToLocal(repo){
    const savedReposData = localStorage.getItem('repositories')
    let savedRepos = []
    if(savedReposData) {
        savedRepos = JSON.parse(savedReposData)
    }
    if (savedRepos.some(item => item.id === repo.id)){
        return
    }
    savedRepos.push({
        id: repo.id,
        name: repo.name,
        owner: { login: repo.owner.login},
        stargazers_count: repo.stargazers_count
    })

    localStorage.setItem('repositories', JSON.stringify(savedRepos))
    return savedRepos
}

document.addEventListener('DOMContentLoaded', () => {
        const savedReposData = localStorage.getItem('repositories');
        if (!savedReposData) return;
        const savedRepos = JSON.parse(savedReposData);
            savedRepos.forEach(repo => {

                const container = document.createElement('div');
                container.className = 'repo';

                const info = document.createElement('div');
                info.className = 'repo-info';
                info.innerHTML = `Name: ${repo.name} <br> Owner: ${repo.owner?.login || repo.owner}<br> Stars: ${repo.stargazers_count}`;

                const delBtn = document.createElement("button");
                delBtn.className = 'delete-btn';
                delBtn.textContent = 'удалить';

                delBtn.addEventListener('click', () => {
                    container.remove();
                    removeLocal(repo.id);
                });

                container.appendChild(info);
                container.appendChild(delBtn);
                repoList.appendChild(container);
    })})



function removeLocal(repoId) {
    const savedReposData = localStorage.getItem('repositories');
        let savedRepos = JSON.parse(savedReposData);
        savedRepos = savedRepos.filter(repo => repo.id !== repoId);
        localStorage.setItem('repositories', JSON.stringify(savedRepos));
}