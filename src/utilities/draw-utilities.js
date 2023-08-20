import { GameVars } from "../game-variables";

export const drawSprite = (canvas, sprite, pixelSize = 1, startX = 0, startY = 0, colorIds = null) => {
    const ctx = canvas.getContext("2d");
    sprite.forEach((row, y) => row.forEach((val, x) => {
        if (val !== null) {
            ctx.fillStyle = colorIds ? colorIds[val] || val : val;
            ctx.fillRect(
                (startX * pixelSize) + (x * pixelSize),
                (startY * pixelSize) + (y * pixelSize),
                pixelSize,
                pixelSize);
        }
    }));
};

export const createElem = (parentElem, elemType, id, classList, width, height, backgroundColor, clickFn, endClickFn) => {
    let elem = document.createElement(elemType);
    if (id) elem.id = id;
    if (classList) classList.forEach((e) => elem.classList.add(e));
    if (width) elem.width = width;
    if (height) elem.height = height;
    if (backgroundColor) elem.style.backgroundColor = backgroundColor;
    if (clickFn) {
        elem.addEventListener(GameVars.isMobile ? 'click' : 'mousedown', clickFn);
        // if (GameVars.isMobile) elem.addEventListener('touchmove', clickFn);
    }
    if (endClickFn) elem.addEventListener(GameVars.isMobile ? 'touchend' : 'mouseup', endClickFn);
    parentElem.appendChild(elem);
    return elem;
}