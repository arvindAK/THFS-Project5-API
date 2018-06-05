
const wrapper = document.querySelector('.wrapper');
const modal = document.querySelector('.modal');
let numberOfUsers = 12;

function fetchData(url) {
    return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .catch(error => console.log("404's sake! That didn't seem to work :/", error));
}

fetchData(`https://randomuser.me/api/?results=${numberOfUsers}`)
.then(data => fillData(data.results));

function checkStatus(response){
  if (response.ok){
      return Promise.resolve(response);
  } else {
      return Promise.reject(new Error(response.statusText));
  }
}

function fillData(resultList){
  let images = [];
  let modals = [];
  let count = 0;
  resultList.forEach(result=>{
  images +=  `
  <div class="card-content">
    <img class = "card-profile-img" src=${result.picture.large} alt=''>
    <div class="card-body">
      <h3 class="card-name">${result.name.first} ${result.name.last}</h3>
      <p class="card-email">${result.email}</p>
      <p class="card-city">${result.location.city}</p>
    </div>
  </div>`

  modals += `
  <div class="modal-content modal-${count}">
    <span class="closeBtn">&times;</span>
    <i class="fas fa-caret-left left-arrow"></i>
    <i class="fas fa-caret-right right-arrow"></i>
    <div class="modal-body">
      <img class = "modal-profile-img" src=${result.picture.large} alt=''>
      <h2 class="modal-name">${result.name.first} ${result.name.last}</h2>
      <p class="modal-username">${result.login.username}</p>
      <p class="modal-email">${result.email}</p>
      <br><hr><br>
      <p class="modal-city">${result.location.street}, ${result.location.city},
       ${result.location.state}, ${result.location.postcode}</p>
      <p class="modal-cell">${result.phone}</p>
      <p class="modal-birth">Birthday: ${result.dob.split(' ')[0]}</p>
    </div>
    <span class="user-count"></span>
  </div>`
  count +=1;
  }); //end of forEach loop
  wrapper.innerHTML = images;
  modal.innerHTML = modals;
  countItems();
  cardEvents();
  exitModalEvents();
  arrowEvents();
};

function cardEvents(){
  const cardContents = document.querySelectorAll(".card-content");
  cardContents.forEach(card=>
    card.addEventListener('click', (e) => {
      const cardNumber = e.currentTarget.id.split('-')[1];
      modal.style.display = 'block';
      document.querySelector(`#modal-${cardNumber}`).style.display='grid';
    })
  );
};

function exitModalEvents(){
  document.querySelectorAll('.closeBtn').forEach(closeButton =>
    closeButton.addEventListener('click', (e) =>{
      e.currentTarget.parentElement.style.display='none';
      modal.style.display = 'none';
    })
  );
}

function arrowEvents(){
  document.querySelectorAll('.right-arrow').forEach(rightArrow =>
    rightArrow.addEventListener('click', (e) =>{
      let currentModal = e.currentTarget.parentElement.id.split('-')[1];
      e.currentTarget.parentElement.style.display='none';
      if(currentModal==(numberOfUsers-1)){currentModal = -1};
      document.querySelector(`#modal-${Number(currentModal) + 1}`)
      .style.display='grid';
    })
  );
  document.querySelectorAll('.left-arrow').forEach(leftArrow =>
    leftArrow.addEventListener('click', (e) =>{
      let currentModal = e.currentTarget.parentElement.id.split('-')[1];
      e.currentTarget.parentElement.style.display='none';
      if(currentModal==0){currentModal = numberOfUsers};
      document.querySelector(`#modal-${Number(currentModal) - 1}`)
      .style.display='grid';
    })
  );
}

document.querySelector('#search').addEventListener('keyup', ()=>{
  let input = document.querySelector('#search').value.trim().toLowerCase();
  const cardNameNodeList = document.querySelectorAll('.card-name');
  const cardNameArray = Array.from(cardNameNodeList);
  let matched = cardNameArray.filter(name=>name.innerHTML.includes(input));
  document.querySelectorAll('.card-content')
  .forEach(card => card.style.display='none');
  matched.forEach(h2=> h2.parentElement.parentElement.style.display='grid');
  numberOfUsers = matched.length
  countItems();
});


function countItems(){
  let cardCount = 0;
  document.querySelectorAll('.card-content')
  .forEach((card, index) => {
    if(card.style.display != 'none'){
      card.id=`card-${cardCount}`
      document.querySelector(`.modal-${index}`).id = `modal-${cardCount}`;
      cardCount +=1;
    }else{
      card.id=''
      document.querySelector(`.modal-${index}`).id = ''};
  });
};
