const API_URL = 'https://api.github.com/users/';

const main = document.querySelector('#main');
const form = document.querySelector('#user-form');
const search = document.querySelector('#search');

const getRepos = async (username) => {
  try {
    const { data } = await axios(API_URL + username + '/repos?sort=created');
    addReposToCard(data);
  } catch (error) {
    createErrorCard('There is a problem fetching Repositories');
  }
};

const getUser = async (username) => {
  try {
    const { data } = await axios(API_URL + username);
    getRepos(username);
    createUserCard(data);
  } catch (error) {
    if (error.response.status === 404) {
      createErrorCard('There is not user with that name');
    }
  }
};

const createErrorCard = (message) => {
  const errorCardHTML = ` <div class="card">
           <h3>${message}</h3>
        </div>`;

  main.innerHTML = errorCardHTML;
};

const createUserCard = (user) => {
  const cardHTML = ` <div class="card">
            <div>
                <img src=${user.avatar_url} alt=${user.name} class="avatar">
            </div>
            <div class="user-info">
                <h2>${user.name}</h2>
                <p>${user.bio ? user.bio : ''}</p>
                <ul>
                    <li>${user.followers}<strong>Followers</strong> </li>
                    <li>${user.following}<strong>Following</strong></li>
                    <li>${user.public_repos}<strong>Repositories</strong></li>
                </ul>
                <div id="repos">
                </div>
            </div>
        </div>`;

  main.innerHTML = cardHTML;
};

const addReposToCard = (repos) => {
  const reposEl = document.querySelector('#repos');
  repos.slice(0, 10).forEach((repo) => {
    const repoEl = document.createElement('a');
    repoEl.classList.add('repo');
    repoEl.href = repo.html_url;
    repoEl.target = '_blank';
    repoEl.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = search.value;

  if (username) {
    getUser(username);
    search.value = '';
  }
});
