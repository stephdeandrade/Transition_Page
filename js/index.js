import { Item } from './item.js';
import { Preview } from './preview.js';

// body

const body = document.body;

// Content element

const contentEl = document.querySelector('.content');

// frame element
const frameEl = document.querySelector('.frame');


//top and bottom overlay

const overlayRows = [...document.querySelectorAll('.overlay__row')];

//Preview
const previews = [];
[...document.querySelectorAll('.preview')].forEach(preview => previews.push(new Preview(preview)));


const items = [];
[...document.querySelectorAll('.item')].forEach((item, pos) => items.push(new Item(item, previews[pos])));

const openItem = item => {
    gsap.timeline({
        defaults: {
            duration: 1,
            ease: 'power3.inOut',    
        }
    })
    .add(() => {
        //Pointer events none to the content
        contentEl.classList.add('content--hidden');
    }, 'start')

    .addLabel('start', 0)
    .set([item.preview.DOM.innerElements, item.preview.DOM.backCtrl], {
        opacity: 0,
    }, 'start')
    .to(overlayRows, {
        scaleY: 1,
    }, 'start')

    .addLabel('content', 'start+=0.6')

    .add(() => {
        body.classList.add('preview-visible');

        gsap.set(frameEl, {
            opacity: 0,
        }, 'start')
        item.preview.DOM.el.classList.add('preview--current');
    }, 'content')
    //Image animation
    .to([item.preview.DOM.image, item.preview.DOM.imageInner], {
        startAt: {y: pos => pos ? '101%' : '-101%'},
        y: '0%'
    }, 'content')

    .add(() => {
        for (const line of item.preview.multiLines) {
            line.in();
        }
        gsap.set(item.preview.DOM.multiLineWrap, {
            opacity: 1,
            delay: 0.1,
        })
    }, 'content')

    .to(frameEl, {
        ease: 'expo',
        startAt: {y: '-100%', opacity: 0},
        opacity: 1,
        y: '0%'
    }, 'content+=0.3')
    .to(item.preview.DOM.innerElements, {
        ease: 'expo',
        startAt: {yPercent: 101},
        yPercent: 0, 
        opacity: 1
    }, 'content+=0.3')
    .to(item.preview.DOM.backCtrl, {
        opacity: 1
    }, 'content')
};

const closeItem = item => {
    gsap.timeline({
        defaults: {
            duration: 1,
            ease: 'power3.inOut',    
        }
    })
    .addLabel('start', 0)
    .to(item.preview.DOM.innerElements, {
        yPercent: -101,
        opacity: 0,
    }, 'start')
    .add (() => {
        for (const line of item.preview.multiLines) {
            line.out();
        }
    }, 'start')

    .to(item.preview.DOM.backCtrl, {
        opacity: 0,
    }, 'start')

    .to(item.preview.DOM.image, {
        y: '101%'
    }, 'start')
    .to(item.preview.DOM.imageInner, {
        y: '-101%'
    }, 'start')

    // animate frame

    .to(frameEl, {
        opacity: 0,
        y: '-100%',
        onComplete: () => {
            body.classList.remove('preview-visible');
            gsap.set(frameEl, {
                opacity: 1,
                y: '0%'
            })
        }
    }, 'start')

    .addLabel('grid', 'start+=0.6')

    .to(overlayRows, {
        //ease: 'expo',
        scaleY: 0,
        onComplete: () => {
            item.preview.DOM.el.classList.remove('preview--current');
            contentEl.classList.remove('content--hidden');
        }
    }, 'grid')


};

for (const item of items) {
    //Open item
    item.DOM.link.addEventListener('click', () => openItem(item));
    // Close item
    item.preview.DOM.backCtrl.addEventListener('click', () => closeItem(item));
};