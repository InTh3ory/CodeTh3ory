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
    monies: 100000000000,
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
            img: 'assets/acre.png',
            w: 5,
            h: 5,
            instances: [],
        },
        wall: {
            label: 'Wall',
            cost: 50,
            img: 'assets/wall.png',
            w: 1,
            h: 1,
            instances: [],
        },
        sentry: {
            label: 'Sentry',
            cost: 50,
            img: 'assets/sentry.png',
            w: 1,
            h: 1,
            instances: [],
        },
    },
    farmBuildings: {
    },
    shop: {
        rabbit: {
            label: 'Rabbit',
            cost: 100,
            rate: 1,
            produced: 0,
            size: 1,
            instances: [],
            cap: 1,
        },
        goat: {
            label: 'Goat',
            cost: 1000,
            rate: 10,
            produced: 0,
            size: 2,
            cap: 2,
            instances: [],
        },
        sheep: {
            label: 'Sheep',
            cost: 10000,
            rate: 100,
            produced: 0,
            size: 2.2,
            cap: 3,
            instances: [],
        },
        alpaca: {
            label: 'Alpaca',
            cost: 100000,
            rate: 1000,
            produced: 0,
            size: 2.8,
            cap: 4,
            instances: [],
        },
        camel: {
            label: 'Camel',
            cost: 1000000,
            rate: 10000,
            produced: 0,
            size: 3.2,
            cap: 5,
            instances: [],
        },
        bison: {
            label: 'Bison',
            cost: 10000000,
            rate: 1,
            produced: 0,
            size: 4,
            cap: 6,
            instances: [],
        },
        muskox: {
            label: 'Muskox',
            cost: 100000000,
            rate: 1,
            produced: 0,
            size: 4,
            cap: 7,
            instances: [],
        },
        woollyMammoth: {
            label: 'Woolly Mammoth',
            cost: 10000000000,
            rate: 1,
            produced: 0,
            size: 8,
            cap: 20,
            instances: [],
        }
    },
};

const shopItemHandler = (e) => {
    const key = e.target.getAttribute('data-key');
    const itemState = state.shop[key];
    if (ss.landSize() - ss.animalCap() >= itemState.cap) {
        if (itemState.cost <= state.monies) {
            state.cart.push(key);
        }
    } else {
        console.log('Not enough space!')
    }
    rs.shop();
};
const landscapeItemHandler = (e) => {
    const key = e.target.getAttribute('data-key');
    const itemState = state.landscapeShop[key];
    if (itemState.cost <= state.monies) {
        state.cart.push(key);
    }
    rs.landscapeShop();
}

const update = () => {
    state.moniesPerSecond = 0;

    Object.entries(state.shop).forEach(([key, value]) => {
        if (value.instances.length) {
            state.monies += (value.instances.length * value.rate) / 10;
            state.moniesPerSecond += value.instances.length * value.rate;
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
    },

};
// Shared Services
const ss = {
    animalCap: () => {
        const animalCap = Object.values(state.shop).reduce((acc, curr) => {
            acc += curr.instances.length * curr.cap;
            return acc;
        }, 0);
        return animalCap;
    },
    landSize: () => state.landscapeShop.acre.instances.length * (state.landscapeShop.acre.w * state.landscapeShop.acre.h)
};
const rs = {
    all: () => {
        rs.shop();
        rs.landscapeShop();
    },
    shop: () => {
        const shopContainer = document.getElementById('shop-container');
        shopContainer.innerHTML = '';
    
        const list = document.createElement('ul');
        
        let ownsPreviousEntry = false;
        Object.entries(state.shop).forEach(([key, value], i) => {
            if (state.monies >= value.cost || ownsPreviousEntry || value.instances.length || !i) {
                const li = document.createElement('li');
    
                if (ss.landSize() - ss.animalCap() < value.cap) {
                    li.classList.add('disabled');
                }
    
                li.addEventListener('click', shopItemHandler);
                li.setAttribute('data-key', key);

                const itemsInCart = state.cart.filter(i => i === key).length;
                const itemCost = (value.instances.length + itemsInCart + 1) * value.cost;

                const label = document.createTextNode(`${value.label} ${Math.round(itemCost)} - Owned ${value.instances.length}`);
                li.appendChild(label);
                list.appendChild(li);
            }
            ownsPreviousEntry = !!value.instances.length;
        });
    
        shopContainer.appendChild(list);

            // Total Animal Size / Land Size

        const landSizeSpan = document.getElementById('land-size');
        landSizeSpan.innerHTML = '';
        txt = document.createTextNode(`${ss.animalCap()} / ${ss.landSize()} Capacity`);
        landSizeSpan.appendChild(txt);
    },
    landscapeShop: () => {
        const shopContainer = document.getElementById('landscape-container');
        shopContainer.innerHTML = '';
    
        const list = document.createElement('ul');
        
        let ownsPreviousEntry = false;
        Object.entries(state.landscapeShop).forEach(([key, value], i) => {
            if (state.monies >= value.cost || ownsPreviousEntry || value.instances.length || !i) {
                const li = document.createElement('li');
                li.addEventListener('click', landscapeItemHandler);
                li.setAttribute('data-key', key);

                const itemsInCart = state.cart.filter(i => i === key).length;
                const itemCost = (value.instances.length + itemsInCart + 1) * value.cost;

                const label = document.createTextNode(`${value.label} ${Math.round(itemCost)} - Owned ${value.instances.length}`);
                li.appendChild(label);
                list.appendChild(li);
            }
            ownsPreviousEntry = !!value.instances.length;
        });
    
        shopContainer.appendChild(list);
    },
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
    rs.shop();
    rs.landscapeShop();
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
                rs.shop();
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