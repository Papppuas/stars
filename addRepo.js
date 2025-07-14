function addRepository(repo) {
    if (localRepo.some(item => item.id === repo.id)){
       const dublikat = document.createElement('div')
        dublikat.className = 'dublikat'
        dublikat.textContent = 'Данный репозиторий уже добавлен'
        repoList.prepend(dublikat)
        setTimeout(() => {
            dublikat.remove();
        },5000)
        return
    }
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
        removeLocal(repo.id);
    })
    container.appendChild(info);
    container.appendChild(delBtn);
    repoList.appendChild(container);

    saveToLocal(repo)
}