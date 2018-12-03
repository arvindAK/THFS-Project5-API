const card = document.querySelector('.card');
const modal = document.querySelector('.modal');
let numberOfUsers = 12;

//modified fecth function, converts result to json and handles errors
function fetchData(url) {
  return fetch(url)
  .then(res => res.json())
  .catch(error => console.log("404's sake! That didn't seem to work :/", error));
}

//call to the randomUser API, result is passed to the fillData function
fetchData(`https://randomuser.me/api/?nat=gb,us&results=${numberOfUsers}`)
.then(data => fillData(data.results));

//adds html for each card and modal to the DOM
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
      <p class="modal-cell">${result.phone}</p>
      <p class="modal-city">${result.location.street}, ${result.location.city},
        ${result.location.postcode}</p>
      <p class="modal-birth">Age: ${result.dob.age}</p>
    </div>
    <span class="user-count"></span>
  </div>`
  count +=1;
  }); //end of forEach loop
  card.innerHTML = images;
  modal.innerHTML = modals;
  countItems();
  cardEvents();
  exitModalEvents();
  arrowEvents();
};

//for each card add an event listener that displays the corresponding modal
function cardEvents(){
  document.querySelectorAll(".card-content").forEach(card =>
    card.addEventListener('click', (e) => {
      const cardNumber = e.currentTarget.id.split('-')[1];
      modal.style.display = 'block';
      document.querySelector(`#modal-${cardNumber}`).style.display='grid';
    })
  );
};

//for each close button add event listener to hide the current modal
function exitModalEvents(){
  document.querySelectorAll('.closeBtn').forEach(closeButton =>
    closeButton.addEventListener('click', (e) =>{
      e.currentTarget.parentElement.style.display='none';
      modal.style.display = 'none';
    })
  );
}

//for each arrow button add event listener to hide the current modal and display the next
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

//hide all cards, then show cards that match input
document.querySelector('#search').addEventListener('keyup', ()=>{
  const input = document.querySelector('#search').value.trim().toLowerCase();
  const cardNameArray = Array.from(document.querySelectorAll('.card-name'));
  const modalUserNameArray = Array.from(document.querySelectorAll('.modal-username'));
  const cardEmail = Array.from(document.querySelectorAll('.card-email'));

  //check if card name matches input, return name's card parent
  const matched = cardNameArray.filter(name=>name.innerHTML.includes(input))
  .map(name => name.parentElement.parentElement);

  //check if username matches input, return the modals email parent
  const username = modalUserNameArray.filter(username=>username.innerHTML.includes(input))
  .map(username=> username.nextElementSibling.innerHTML);

  //check if the card email intersects with the modal email, return card parent
  const emailCard = cardEmail.filter(value => -1 !== username.indexOf(value.innerHTML))
  .map(email => email.parentElement.parentElement);

  //remove duplicate card parents
  const matches = [...new Set([...matched ,...emailCard])];

  let match = true;
  document.querySelectorAll('.card-content')
  .forEach(card => card.style.display='none');

  matches.forEach(h2 => h2.style.display='grid');
  numberOfUsers = matches.length
  countItems();
  //trigger notFound function
  numberOfUsers===0 ? match = false : match = true;
  if(document.querySelector('.lost')){
    const element = document.querySelector(".lost");
    element.parentNode.removeChild(element);
  };
  if(!match){notFound(input)};
});

//reassign card and modal id's depending on how many cards are displaying
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
  //update the card count span at the bottom of each modal
  document.querySelectorAll('.user-count').forEach(user =>
    user.innerHTML =
    `User ${Number(user.parentElement.id.split('-')[1])+1} of ${numberOfUsers}`
  );
};

//add not found message
function notFound(input){
  const someHTML = `<div class='lost'>
    <h3 class='missing-title'>Yikes! </h3>
    <span class='missing-message'>It appears "${ input }"
    doesn't match with any of our employees.</span><br>
    <img src="img/notFound.jpg" class="not-found" alt="">
    </img></div>`
  document.querySelector('.header').insertAdjacentHTML('afterEnd', someHTML);
};
