// place all the cards in the array
let card = document.getElementsByClassName('card')
let cards = [...card]
let openedCards = []

const deck = document.getElementById('card-deck')

let moves = 0
let counter = document.querySelector('.moves')
const stars = document.querySelectorAll('.fa-star')

let matchedCard = document.getElementsByClassName('match')

let closeIcon = document.querySelector('.close')
let popup = document.querySelector('#popup1')

function shuffle (array) {
  let currentIndex = array.length, temporaryValue, randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
};

// shuffles cards when page is refreshed / loads
document.body.onload = startGame()

function startGame () {
  cards = shuffle(cards)
  // remove all exisiting classes from each card
  for (var i = 0; i < cards.length; i++) {
    deck.innerHTML = '';
    [].forEach.call(cards, function (item) {
      deck.appendChild(item)
    })
    cards[i].classList.remove('show', 'open', 'match', 'disabled')
  }
  // reset moves
  moves = 0
  counter.innerHTML = moves

  // reset rating
  for (var i = 0; i < stars.length; i++) {
    stars[i].style.color = '#FFC300'
    stars[i].style.visibility = 'visible'
  }

  // reset timer
  let timer = document.querySelector('.timer')
  timer.innerHTML = '0 mins 0 secs'
  clearInterval(interval)
}

// toggles open and show class to display cards
let displayCard = function (e) {
  e.target.classList.toggle('open')
  e.target.classList.toggle('show')
  e.target.classList.toggle('disabled')
}

// loop to add event listeners to each card
for (let i = 0; i < cards.length; i++) {
  card = cards[i]
  card.addEventListener('click', displayCard)
  card.addEventListener('click', cardOpen)
  card.addEventListener('click', congratsMessage)
}

// add opened cards to openedCards list and check if the cards match
function cardOpen () {
  openedCards.push(this)
  let length = openedCards.length
  if (length === 2) {
    moveCounter()
    if (openedCards[0].type === openedCards[1].type) {
      matched()
    } else {
      unmatched()
    }
  }
};

// when cards match
function matched () {
  openedCards[0].classList.add('match', 'disabled')
  openedCards[1].classList.add('match', 'disabled')
  openedCards[0].classList.remove('show', 'open', 'no-event')
  openedCards[1].classList.remove('show', 'open', 'no-event')
  openedCards = []
}

// when cards don't match
function unmatched () {
  openedCards[0].classList.add('unmatched')
  openedCards[1].classList.add('unmatched')
  disable()
  setTimeout(function () {
    openedCards[0].classList.remove('show', 'open', 'no-event', 'unmatched')
    openedCards[1].classList.remove('show', 'open', 'no-event', 'unmatched')
    enable()
    openedCards = []
  }, 1000)
}

// disable cards temporarily
function disable () {
  Array.prototype.filter.call(cards, function (card) {
    card.classList.add('disabled')
  })
}

// enable cards and disable matched cards
function enable () {
  Array.prototype.filter.call(cards, function (card) {
    card.classList.remove('disabled')
    for (let i = 0; i < matchedCard.length; i++) {
      matchedCard[i].classList.add('disabled')
    }
  })
}

// count player's moves
function moveCounter () {
  moves++
  counter.innerHTML = moves
  // start timer on first click
  if (moves === 1) {
    second = 0
    minute = 0
    startTimer()
  }
  // setting rates based on moves
}

// game timer
let second = 0
let minute = 0
let timer = document.querySelector('.timer')
var interval

function startTimer () {
  interval = setInterval(function () {
    timer.innerHTML = `${minute} mins ${second} secs`
    second++
    if (second === 60) {
      minute++
      second = 0
    }
  }, 1100)
}

function congratsMessage () {
  if (matchedCard.length === 16) {
    clearInterval(interval)
    let finalTime = timer.innerHTML

    popup.classList.add('show')

    let starRating = document.querySelector('.stars').innerHTML

    document.getElementById('finalMove').innerHTML = moves
    document.getElementById('starRating').innerHTML = starRating
    document.getElementById('totalTime').innerHTML = finalTime

    closePopup()
  };
}

function closePopup () {
  closeIcon.addEventListener('click', function () {
    popup.classList.remove('show')
    startGame()
  })
}

function playAgain () {
  popup.classList.remove('show')
  startGame()
}
