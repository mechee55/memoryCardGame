// place all the cards in the array
let card = document.getElementsByClassName('card')
let cardsInArray = [...card]
let openedCards = []
let matchedCard = document.getElementsByClassName('match')
const deck = document.getElementById('card-deck')
const popup = document.querySelector('#popup1')

// game timer
let timer = document.querySelector('.timer')
let second = 0
let minute = 0
var interval

function time () {
  interval = setInterval(function () {
    timer.innerHTML = `${minute} mins ${second} secs`
    second++
    if (second === 60) {
      minute++
      second = 0
    }
  }, 1000)
}

// count moves
let counter = document.querySelector('.moves')
const stars = document.querySelectorAll('.fa-star')
let allStars = [...stars]
let moves = 0

function count () {
  moves++
  counter.innerHTML = moves
  if (moves === 1) {
    time()
  }

  // the stars decrease as the moves' number go up
  // if the move's number is more than 8, and less than 11,
  // hide the 3rd star
  if (moves > 8 && moves < 11) {
    allStars[2].style.visibility = 'collapse'
  } else if (moves > 14) {
    allStars[1].style.visibility = 'collapse'
    allStars[2].style.visibility = 'collapse'
  }
}

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
}

function startGame () {
  cardsInArray = shuffle(cardsInArray)
  // loop through to remove all exisiting classes from each card
  for (let i = 0; i < cardsInArray.length; i++) {
    [].forEach.call(cardsInArray, function (item) {
      deck.appendChild(item)
    })
    cardsInArray[i].classList.remove('show', 'open', 'match', 'disabled')
  }
  // reset moves
  moves = 0
  counter.innerHTML = moves
  for (let i = 0; i < 3; i++) {
    allStars[i].style.visibility = 'visible'
  }

  // reset timer
  let timer = document.querySelector('.timer')
  timer.innerHTML = '0 mins 0 secs'
  clearInterval(interval)
}

// shuffles cards when page is loads
document.body.onload = startGame()

// toggles open and show class to display cards
let displayCard = (e) => {
  e.target.classList.toggle('open')
  e.target.classList.toggle('show')
  e.target.classList.toggle('disabled')
}

// loop through the array to add event listeners to each card
for (let i = 0; i < cardsInArray.length; i++) {
  card = cardsInArray[i]
  card.addEventListener('click', displayCard)
  card.addEventListener('click', cardOpen)
  card.addEventListener('click', congratsMessage)
}

// add opened cards to openedCards list and check if the cards match
function cardOpen () {
  openedCards.push(this)
  if (openedCards.length === 2) {
    count()
    if (openedCards[0].type === openedCards[1].type) {
      matched()
    } else {
      unmatched()
    }
  }
}

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
  Array.prototype.filter.call(cardsInArray, function (card) {
    card.classList.add('disabled')
  })
}

// enable cards and disable matched cards
function enable () {
  Array.prototype.filter.call(cardsInArray, function (card) {
    card.classList.remove('disabled')
    for (let i = 0; i < matchedCard.length; i++) {
      matchedCard[i].classList.add('disabled')
    }
  })
}

function congratsMessage () {
  if (matchedCard.length === 16) {
    popup.classList.add('show')
    clearInterval(interval)

    let finalTime = timer.innerHTML
    let starRating = document.querySelector('.stars').innerHTML

    document.getElementById('moveResult').innerHTML = moves
    document.getElementById('starRating').innerHTML = starRating
    document.getElementById('timeResult').innerHTML = finalTime
    closePopup()
  }
}

let closeIcon = document.querySelector('.close')
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
