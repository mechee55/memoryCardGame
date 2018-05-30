// place all the cards in the array
let card = document.getElementsByClassName('card')
let cardsInArray = [...card]
let openedCards = []
let matchedCard = document.getElementsByClassName('match')
const deck = document.getElementById('card-deck')
const popup = document.querySelector('#popup1')

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

let counter = document.querySelector('.moves')
const stars = document.querySelectorAll('.fa-star')
let allStars = [...stars]
let moves = 0

// The function to count the moves on the first match
function countMoves () {
  moves++
  counter.innerHTML = moves

  // the stars decrease as the moves' number go up
  if (moves > 8 && moves < 18) {
    allStars[2].style.visibility = 'collapse'
  } else if (moves > 19) {
    allStars[1].style.visibility = 'collapse'
    allStars[2].style.visibility = 'collapse'
  }
}

// game timer
let timer = document.querySelector('.timer')
let second = 0
let minute = 0
var interval

// The function to count time.  This function has to start on the first click
function countTime () {
  interval = setInterval(function () {
    timer.innerHTML = `${minute} mins ${second} secs`
    second++

    if (second === 60) {
      minute++
      second = 0
    }
  }, 1000)
}

// This function initializes everything.  It does NOT start counting time
function initGame () {
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
  clearInterval(interval)
  second = 0
  timer.innerHTML = '0 mins 0 secs'

  // clear the openCards array from the previous game (NEW AFTER REVIEW!!!!!!!!!!!!!!)
  openedCards = []
}

// shuffles cards when page loads
document.body.onload = initGame()

// toggles open and show class to display cards
let displayCard = (e) => {
  e.target.classList.toggle('open')
  e.target.classList.toggle('show')
  e.target.classList.toggle('disabled')
}

// add opened cards to openedCards list and check if the cards match
function cardOpen () {
  openedCards.push(this)
  if (openedCards.length === 2) {
    countMoves()
    if (openedCards[0].type === openedCards[1].type) {
      matched()
    } else {
      unmatched()
    }
  }

  // If the timer hasn't started, then activate the timer (NEW AFTER REVIEW!!!!)
  if (second === 0) {
    countTime()
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

// loop through the array to add event listeners to each card
for (let i = 0; i < cardsInArray.length; i++) {
  card = cardsInArray[i]
  card.addEventListener('click', displayCard)
  card.addEventListener('click', cardOpen)
  card.addEventListener('click', congratsMessage)
}

let closeIcon = document.querySelector('.close')
function closePopup () {
  closeIcon.addEventListener('click', function () {
    popup.classList.remove('show')
    initGame()
  })
}

// These two functions below are used in the index.html
// REPLAY button
function replay () {
  popup.classList.remove('show')
  initGame()
}

// REFRESH button
function refresh () {
  initGame()

  // Without this clearInterval, the timer starts automatically when ????// refreshed
  clearInterval(interval)
}
