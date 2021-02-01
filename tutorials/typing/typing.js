// const phrase = "A slave named Androcles once escaped from his master and fled to the forest. As he was wandering about there he came upon a Lion lying down moaning and groaning. At first he turned to flee, but finding that the Lion did not pursue him, he turned back and went up to him.";
const phrase = `A dog used to run up quietly to the heels of those he met, and to bite them without notice. His master sometimes suspended a bell about his neck, that he might give notice of his presence wherever he went, and sometimes he fastened a chain about his neck, to which was attached a heavy clog, so that he could not be so quick at biting people's heels. The Dog grew proud of his bell and clog, and went with them all over the market-place. An old hound said to him: "Why do you make such an exhibition of yourself? That bell and clog that you carry are not, believe me, orders of merit, but, on the contrary, marks of disgrace, a public notice to all men to avoid you as an ill-mannered dog.`;
// const phrase = "My name is Jason and this is the best thing ever weee.";
// const phrase = 'sad mad add mad sad add jad fad lad sad mad';
/* 
    Sheep
        Merino, Rambouillet, and Debouillet
        Targhee, Suffolk and Cheviot
        Lincoln and Romney
    Angora Goat
        Cashmere
        Mohair
    Lamas
        Alpacas
        Llamas
        Vicunas
        Guanacos
    Camels

    Rabbits
        Angora
        Jersey Wooly
    
    Bison
    
    Musk Oxen

    Woolly Rhinoceros
    Woolly Mammoth

    https://10fastfingers.com/typing-test/english

*/
const state = {
    streak: 0,
    quality: 1,
    wordIndex: 0,
    wordCount: 0,
    monies: 100000,
    moniesPerSecond: 0,
    recentWords: [],
    cart: [],
    upgrades: {
        shop: {

        },
        farm: {

        },
    },
    landscapeShop: {
        acre: {
            label: 'Acre',
            cost: 50,
            img: 'assets/grass.jpg',
            owned: 0,
            w: 1,
            h: 1,
            locations: [],
        }
    },
    farmBuildings: {
    },
    shop: {
        rabbit: {
            label: 'Rabbit',
            cost: 100,
            rate: 1,
            img: 'assets/rabbit.png',
            owned: 0,
            produced: 0,
            size: 1,
        },
        goat: {
            label: 'Goat',
            cost: 1000,
            rate: 10,
            img: 'assets/goat.png',
            owned: 0,
            produced: 0,
            size: 2,
        },
        sheep: {
            label: 'Sheep',
            cost: 10000,
            rate: 100,
            img: '',
            owned: 0,
            produced: 0,
            size: 5,
        },
        alpaca: {
            label: 'Alpaca',
            cost: 100000,
            rate: 1000,
            img: '',
            owned: 0,
            produced: 0,
            size: 6,
        },
        camel: {
            label: 'Camel',
            cost: 1000000,
            rate: 10000,
            img: '',
            owned: 0,
            produced: 0,
            size: 10,
        },
        bison: {
            label: 'Bison',
            cost: 10000000,
            rate: 1,
            img: '',
            owned: 0,
            produced: 0,
            size: 20,
        },
        muskOx: {
            label: 'Musk Ox',
            cost: 100000000,
            rate: 1,
            img: '',
            owned: 0,
            produced: 0,
            size: 25,
        },
        woollyMammoth: {
            label: 'Woolly Mammoth',
            cost: 10000000000,
            rate: 1,
            img: '',
            owned: 0,
            produced: 0,
            size: 50,
        }
    },
};

const shopItemHandler = (e) => {
    const key = e.target.getAttribute('data-key');
    const itemState = state.shop[key];
    if (itemState.cost <= state.monies) {
        itemState.owned++;
        state.monies -= itemState.cost;
        itemState.cost *= 1.1;
    }
    renderShop();
};
const landscapeItemHandler = (e) => {
    const key = e.target.getAttribute('data-key');
    const itemState = state.landscapeShop[key];
    if (itemState.cost <= state.monies) {
        itemState.owned++;
        state.monies -= itemState.cost;
        itemState.cost *= 1.1;
        state.cart.push(key);
    }
    renderLandscapeShop();
}

const update = () => {
    state.moniesPerSecond = 0;

    Object.entries(state.shop).forEach(([key, value]) => {
        if (value.owned) {
            state.monies += (value.owned * value.rate) / 10;
            state.moniesPerSecond += value.owned * value.rate;
        }
    });

    render();
};

const helpers = {
    text: (value, element) => {
        const span = document.createElement(element);
        const text = document.createTextNode(value);
        span.appendChild(text);
        return span;
    }
};

const render = () => {
    const mpsSpan = document.getElementById("monies-per-second");
    mpsSpan.innerHTML = '';
    let txt = document.createTextNode(state.moniesPerSecond);
    mpsSpan.appendChild(txt);

    const moneySpan = document.getElementById("monies");
    moneySpan.innerHTML = '';
    txt = document.createTextNode(`${Math.round(state.monies)}`);
    moneySpan.appendChild(txt);

    const streakSpan = document.getElementById('streak');
    streakSpan.innerHTML = '';
    txt = document.createTextNode(`${state.streak}`);
    streakSpan.appendChild(txt);

    const activeText = document.getElementsByClassName('active')[0];
    if (activeText && activeText.offsetTop > 20) {
        let current = document.querySelector('.active');
        let prevSibling = current.previousElementSibling;
        while(prevSibling) {
            prevSibling.remove();
            prevSibling = current.previousElementSibling;
        }

        if (document.getElementById('word-container').childElementCount < 50) {
            addWords(phrase, true);
        }
    }

    const register = document.getElementById('wool-register');
    while(state.recentWords.length) {
        const latest = state.recentWords.pop();
        const text = `${latest.word} +${latest.value.toFixed(1)}`;
        const node = helpers.text(text, 'div');
        register.insertBefore(node, register.firstChild);
    }
    while(register.childElementCount > 3) {
        register.lastChild.remove();
    }
};

const renderShop = () => {
    const shopContainer = document.getElementById('shop-container');
    shopContainer.innerHTML = '';

    const list = document.createElement('ul');
    
    let ownsPreviousEntry = false;
    Object.entries(state.shop).forEach(([key, value], i) => {
        if (state.monies >= value.cost || ownsPreviousEntry || value.owned || !i) {
            const li = document.createElement('li');
            li.addEventListener('click', shopItemHandler);
            li.setAttribute('data-key', key);
            const label = document.createTextNode(`${value.label} ${Math.round(value.cost)} - Owned ${value.owned}`);
            li.appendChild(label);
            list.appendChild(li);
        }
        ownsPreviousEntry = !!value.owned;
    });

    shopContainer.appendChild(list);
};
const renderLandscapeShop = () => {
    const shopContainer = document.getElementById('landscape-container');
    shopContainer.innerHTML = '';

    const list = document.createElement('ul');
    
    let ownsPreviousEntry = false;
    Object.entries(state.landscapeShop).forEach(([key, value], i) => {
        if (state.monies >= value.cost || ownsPreviousEntry || value.owned || !i) {
            const li = document.createElement('li');
            li.addEventListener('click', landscapeItemHandler);
            li.setAttribute('data-key', key);
            const label = document.createTextNode(`${value.label} ${Math.round(value.cost)} - Owned ${value.owned}`);
            li.appendChild(label);
            list.appendChild(li);
        }
        ownsPreviousEntry = !!value.owned;
    });

    shopContainer.appendChild(list);
}; // Dupe

const addWords = (phrase, paragraph) => {
    const words = phrase.split(' ');
    const wordContainer = document.getElementById('word-container');

    if (paragraph) {
        wordContainer.appendChild(document.createElement('br'));
        // wordContainer.appendChild(document.createElement('br'));
    }

    words.forEach((word) => {
        const span = document.createElement('span');
        span.setAttribute('data-index', state.wordCount);
        const node = document.createTextNode(word);
        span.appendChild(node);
        wordContainer.appendChild(span);
        if (!state.wordCount) {
            span.classList.add('active');
        }
        state.wordCount++;
    });
}

const init = () => {
    renderShop();
    renderLandscapeShop();
    update();

    addWords(phrase, false);
};

init();        

const baseValueMap = {
    b: 3,
    c: 3,
    d: 3,
    f: 4,
    g: 2,
    h: 4,
    j: 8,
    k: 5,
    m: 3,
    p: 3,
    q: 10,
    v: 4,
    w: 4,
    x: 8,
    y: 4,
    z: 10,
};
const modifiers = [];

let typed = '';
const typeHandler = (e) => {
    const typed = e.target.value;

    const span = document.querySelectorAll(`[data-index="${state.wordIndex}"]`)[0];
    const word = span.innerText;
    const entered = typed.split(' ');
    if (e.keyCode === 32) {
        if (entered[0] === word) {
            let value = 0;
            for (let i = 0; i < typed.length; i++) {
                let increment = baseValueMap[typed[i]] || 1;
                if (state.streak) {
                    increment = increment + (increment * state.streak / 100);
                }
                state.monies += increment;
                value += increment;
                state.streak++;
            }
            state.recentWords.push({ word: entered[0], value: value });
            span.classList.remove('active');
            state.wordIndex++;
            document.querySelectorAll(`[data-index="${state.wordIndex}"]`)[0].classList.add('active');
            e.target.value = e.target.value.replace(entered[0] + ' ', '');
        } else if (entered[0] === '') {
            span.classList.add('mistake');
        } else if (entered.length > 2) {
            // 'the' vs 't t'
            // span.classList.add('mistake');
        } else if (word.includes(entered[0]) && entered[1] === '') {
            // 'the' vs 'th '
            span.classList.add('mistake');
        }

    } else {
        const partial = word.substring(0, entered[0].length);
        if (entered[0] && partial !== entered[0]) {
            span.classList.add('mistake');
            state.streak = 0;
        }
    }

    render();
};

window.addEventListener('DOMContentLoaded', () => {
    const typeInput = document.getElementById('type-input');
    typeInput.addEventListener('keyup', typeHandler);
});

setInterval(update, 100);

const randomWord = () => words[Math.floor(Math.random() * words.length)];