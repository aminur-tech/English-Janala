// three button create
const createElements = (arr) =>{
    const htmlElements = arr.map((el) => `<span class = "btn">${el}</span>`)
    return (htmlElements.join(' '))
}

// manage spinner
const manageSpinner = (status) =>{
    if(status === true){
        document.getElementById('spinner').classList.remove("hidden")
        document.getElementById('word-container').classList.add("hidden")
    }
    else{
        document.getElementById('spinner').classList.add("hidden")
        document.getElementById('word-container').classList.remove("hidden")
    }
}

// voice 
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}


// load lesson
const loadLesson = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then((json) => displayLesson(json.data))
}

// remove active btn
const removeActive = () => {
    const lessonButtons = document.querySelectorAll('.btn-lesson')
    lessonButtons.forEach((btn) => btn.classList.remove("active"))
}


const loadLevelWord = (id) => {
    manageSpinner(true) //add spinner
    // console.log(id)
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    // console.log(url)
    fetch(url)
        .then((res) => res.json())
        .then((json) => {
            removeActive() //remove all btn
            const clickBtn = document.getElementById(`lesson-btn-${id}`)
            // console.log(clickBtn)
            clickBtn.classList.add("active") //add active btn
            displayLevelWord(json.data)

        })
}

// modal load
const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    // console.log(url)
    const res = await fetch(url)
    const details = await res.json()
    displayLoadDetail(details.data)
}

// model display
const displayLoadDetail = (word) => {
    // console.log(word)
    const detailsContainer = document.getElementById('details-container')
    // console.log(detailsContainer)
    detailsContainer.innerHTML = `
<div class="space-y-5">
                <div>
                    <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2>
                    <p class="font-bold">Meaning</p>
                    <p>${word.meaning}</p>
                </div>

                <div>
                    <p class="font-bold">Example</p>
                    <div>${word.sentence}</div>
                </div>

                <div>
                    <h2 class="font-bold font-bangla">সমার্থক শব্দ গুলো</h2>
                    <div class="mt-4 space-x-4">${createElements(word.synonyms)} </div>
                </div>
                <button class="btn bg-[#422AD5] text-white">Complete Learning</button>
            </div>
            <div class="modal-action">
                <form method="dialog">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn">Close</button>
                </form>
            </div>`
    document.getElementById('my_modal_5').showModal();
}

// display word
const displayLevelWord = (words) => {
    // console.log(words)
    const worldContainer = document.getElementById('word-container')
    worldContainer.innerHTML = ''

    if (words.length === 0) {
        worldContainer.innerHTML = `
         <div class="text-center font-bangla col-span-full space-y-4 p-10">
        <img class="mx-auto" src="./assets/alert-error.png" alt="">
        <p class="text-xl font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="text-4xl font-bold">নেক্সট Lesson এ যান</h2>
    </div>`
    }

    words.forEach(word => {
        // console.log(word)
        const card = document.createElement('div')
        card.innerHTML = `
        <div class="bg-white text-center shadow-sm rounded-xl py-8 px-5 space-y-4 ">
        <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যাইনি"}</h2>
        <p class="font-medium text-xl">Meaning /Pronounciation</p>
        <div class="font-bold text-2xl">${word.meaning ? word.meaning : "অর্থ পাওয়া যাইনি"}/${word.
                pronunciation ? word.
                pronunciation : "pronunciation পাওয়া যাইনি"}</div>
        <div class="flex justify-between ">
            <button  onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
            <button onclick = "pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80] "><i class="fa-solid fa-volume-high"></i></button>
        </div>
    </div>
        `
        worldContainer.append(card)

    });
    manageSpinner(false) //spinner used
}



// display lesson
const displayLesson = (lessons) => {
    // console.log(lessons)
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = ''
    for (lesson of lessons) {
        // console.log(lesson)
        const btnDiv = document.createElement('div');
        btnDiv.innerHTML = `
         <button id = "lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary btn-lesson"><i class="fa-solid fa-book-open"></i> lesson-${lesson.level_no} </button>`
        levelContainer.append(btnDiv)
    }
}
loadLesson()

// search
document.getElementById('btn-search').addEventListener('click', ()=>{
    removeActive()
    const Input = document.getElementById('btn-input')
    const inputValue = Input.value.trim().toLowerCase()
    // console.log(inputValue)
    fetch("https://openapi.programming-hero.com/api/words/all")
    .then(res => res.json())
    .then(data =>{
        const allData = data.data;
        // console.log(allData)
        const filterWords = allData.filter((word) => word.word.toLowerCase().includes(inputValue))
        displayLevelWord(filterWords)

    })
})