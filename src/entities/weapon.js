import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { lineCircleCollision } from "../utilities/collision-utilities";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { convertTextToPixelArt, drawPixelTextInCanvas } from "../utilities/text";
import { getWeaponSprite } from "./sprites";

export class Weapon {
    constructor(x, y, weaponType, handDir, parent, color, size) {
        this.x = x;
        this.y = y;
        this.handDir = handDir;
        this.weaponType = weaponType;
        this.parent = parent
        this.parentDiv = parent.div;
        this.size = size || 2;
        this.sprite = getWeaponSprite(this.weaponType);
        this.isPerformingAction = false;
        this.isPlayer = this.parentDiv.classList.contains("player");

        this.weaponDiv = createElem(this.parentDiv, "div", null, ["weapon"]);
        this.weaponCanv = createElem(this.weaponDiv, "canvas", null, null, this.sprite[0].length * toPixelSize(this.size), this.sprite.length * toPixelSize(this.size));

        this.atkAnimation = this.getWeaponAnimation();

        this.relativePos = this.getRelativePos();
        this.setWeaponPos();
        this.atkLine = this.getWeaponAtkLine();
        this.damagedObjs = new Map();
        this.dmg = this.getDamage();

        this.draw(color);
    }

    getWeaponAnimation() {
        switch (this.weaponType) {
            case WeaponType.FIST:
                return this.weaponCanv.animate({
                    transform: ["translateY(0)", "translateY( " + toPixelSize(this.size * 3) + "px)", "translateY(0)"],
                    easing: ["ease-in", "ease-out", "ease-out"],
                    offset: [0, 0.5, 1]
                }, 100);
            case WeaponType.MORNING_STAR:
                return this.weaponCanv.animate({
                    transform: ["rotate(0)", "rotate(" + 360 * this.handDir + "deg)"],
                    easing: ["ease-in", "ease-out"],
                    offset: [0, 1]
                }, 175);
            case WeaponType.SHIELD:
                return this.weaponCanv.animate({
                    transform: ["translateY(0) scale(1)", "translateY( " + toPixelSize(this.size * 3) + "px)  scale(2)", "translateY(0) scale(1)"],
                    easing: ["ease-in", "ease-out", "ease-out"],
                    offset: [0, 0.5, 1]
                }, 200);
            case WeaponType.SWORD:
                return this.weaponCanv.animate({
                    transform: ["rotate(0)", "rotate(" + 180 * this.handDir + "deg)", "rotate(0)"],
                    easing: ["ease-in", "ease-out", "ease-in"],
                    offset: [0, 0.25, 1]
                }, 250);
            case WeaponType.AXE:
                return this.weaponCanv.animate({
                    transform: ["rotate(0)", "rotate(" + 225 * this.handDir + "deg)", "rotate(0)"],
                    easing: ["ease-in", "ease-out", "ease-in"],
                    offset: [0, 0.35, 1]
                }, 300);
            case WeaponType.SPEAR:
                return this.weaponCanv.animate({
                    transform: ["translateY(0)", "translateY( " + toPixelSize(this.size * 12) + "px)", "translateY(0)"],
                    easing: ["ease-in", "ease-out", "ease-out"],
                    offset: [0, 0.5, 1]
                }, 500);
            case WeaponType.HAMMER:
                return this.weaponCanv.animate({
                    transform: ["rotate(0)", "rotate(" + -270 * this.handDir + "deg)", "rotate(0)"],
                    easing: ["ease-in", "ease-out", "ease-in"],
                    offset: [0, 0.40, 1]
                }, 750);
            case WeaponType.GREATSWORD:
                return this.weaponCanv.animate({
                    transform: ["rotate(0)", "rotate(" + 360 * this.handDir + "deg)"],
                    easing: ["ease-in", "ease-out"],
                    offset: [0, 1]
                }, 1000);
        }
    }

    getRelativePos() {
        switch (this.weaponType) {
            case WeaponType.FIST:
                return { x: this.x + toPixelSize(this.handDir === -1 ? -this.size : this.size * 2), y: this.y + toPixelSize(this.size * 4.5) };
            case WeaponType.SHIELD:
                return { x: this.x + toPixelSize(this.size * 2 * this.handDir), y: this.y + toPixelSize(this.size * 3) };
            case WeaponType.SWORD:
                return { x: this.x + toPixelSize(this.size * 3 * this.handDir), y: this.y - toPixelSize(2), r: -90 };
            case WeaponType.GREATSWORD:
                return { x: this.x + toPixelSize(this.handDir === - 1 ? -(this.size * 10) : this.size * 8), y: this.y - toPixelSize(this.handDir === - 1 ? this.size * 0.5 : this.size * 5.5), r: 45 * this.handDir };
            case WeaponType.SPEAR:
                return { x: this.x + toPixelSize(this.handDir === - 1 ? -(this.size * 2) : this.size * 4), y: this.y + -toPixelSize(this.size) };
            case WeaponType.HAMMER:
                return { x: this.x + toPixelSize(this.handDir === - 1 ? -(this.size * 3) : this.size * 8), y: this.y - toPixelSize(this.handDir === - 1 ? -this.size * 9 : -this.size * 7), r: 135 * this.handDir };
            case WeaponType.AXE:
                return { x: this.x + toPixelSize(this.handDir === - 1 ? -(this.size * 6) : this.size * 7), y: this.y - toPixelSize(this.handDir === - 1 ? -this.size * 2 : 0), r: 45 * this.handDir };
            case WeaponType.MORNING_STAR:
                return { x: this.x + toPixelSize(this.handDir === - 1 ? -(this.size * 5) : this.size * 6), y: this.y - toPixelSize(this.handDir === - 1 ? -this.size * 4 : -this.size * 2), r: 45 * this.handDir };
        }
    }

    setWeaponPos() {
        this.weaponDiv.style.transform = 'translate(' + this.relativePos.x + 'px, ' + this.relativePos.y + 'px)';
        switch (this.weaponType) {
            case WeaponType.SWORD:
                this.weaponCanv.style.transformOrigin = "50% 90%";
                break;
            case WeaponType.GREATSWORD:
            case WeaponType.HAMMER:
            case WeaponType.AXE:
            case WeaponType.MORNING_STAR:
                this.weaponDiv.style.transform += ' rotate(' + this.relativePos.r + 'deg)';
                this.weaponCanv.style.transformOrigin = "50% 100%";
                break;
        }
    }

    getWeaponAtkLine() {
        switch (this.weaponType) {
            case WeaponType.FIST:
            case WeaponType.SHIELD:
                return [
                    { x: this.relativePos.x, y: this.relativePos.y + (this.sprite.length * toPixelSize(this.size)) },
                    { x: this.relativePos.x + (this.sprite[0].length * toPixelSize(this.size)), y: this.relativePos.y + (this.sprite.length * toPixelSize(this.size)) },
                ];
            case WeaponType.SWORD:
                return [
                    { x: this.relativePos.x + (this.sprite[0].length / 2 * toPixelSize(this.size)), y: this.relativePos.y + this.getPecentageValue(90, this.sprite.length * toPixelSize(this.size)) }
                ];
            case WeaponType.GREATSWORD:
            case WeaponType.HAMMER:
            case WeaponType.AXE:
            case WeaponType.MORNING_STAR:
                let anglePoint1 = this.retrieveAnglePoint(
                    this.relativePos.x,
                    this.relativePos.y,
                    this.sprite.length * toPixelSize(this.size),
                    this.relativePos.r + 72.5
                );
                let anglePoint2 = this.retrieveAnglePoint(
                    this.relativePos.x,
                    this.relativePos.y,
                    this.sprite[0].length / 2 * toPixelSize(this.size),
                    this.relativePos.r
                );
                return [
                    { x: anglePoint1.x, y: anglePoint1.y },
                    { x: anglePoint2.x, y: anglePoint2.y },
                ];
            case WeaponType.SPEAR:
                return [
                    { x: this.relativePos.x + toPixelSize(this.size / 2), y: this.relativePos.y + (this.sprite.length * toPixelSize(this.size) / 2) },
                    { x: this.relativePos.x + toPixelSize(this.size / 2), y: this.relativePos.y + (this.sprite.length * toPixelSize(this.size)) },
                ];
        }
    }

    getPecentageValue(partialValue, totalValue) {
        return (partialValue * totalValue) / 100;
    }

    getUpdatedWeaponAtkLine(box, transform) {
        switch (this.weaponType) {
            case WeaponType.FIST:
                return [
                    { x: box.x + this.atkLine[0].x, y: box.y + this.atkLine[0].y + (transform.f * 1.5) },
                    { x: box.x + this.atkLine[1].x, y: box.y + this.atkLine[1].y + (transform.f * 1.5) }
                ];
            case WeaponType.SHIELD:
                return [
                    { x: box.x + this.atkLine[0].x - (toPixelSize(this.size) * (transform.m11 - 1)), y: box.y + this.atkLine[0].y + transform.f * transform.m11 },
                    { x: box.x + this.atkLine[1].x + (toPixelSize(this.size) * (transform.m11 - 1)), y: box.y + this.atkLine[1].y + transform.f * transform.m11 }
                ];
            case WeaponType.SWORD:
                let anglePoint = this.retrieveAnglePoint(
                    box.x + this.atkLine[0].x,
                    box.y + this.atkLine[0].y,
                    this.sprite.length * toPixelSize(this.size),
                    (Math.atan2(transform.b, transform.a) * 180 / Math.PI) + this.relativePos.r
                );
                return [
                    { x: box.x + this.atkLine[0].x, y: box.y + this.atkLine[0].y },
                    { x: anglePoint.x, y: anglePoint.y }
                ];
            case WeaponType.GREATSWORD:
            case WeaponType.HAMMER:
            case WeaponType.AXE:
            case WeaponType.MORNING_STAR:
                let anglePoint2 = this.retrieveAnglePoint(
                    box.x + this.atkLine[0].x,
                    box.y + this.atkLine[0].y,
                    this.sprite.length * toPixelSize(this.size),
                    (Math.atan2(transform.b, transform.a) * 180 / Math.PI) + this.relativePos.r - 90
                );
                return [
                    { x: box.x + this.atkLine[0].x, y: box.y + this.atkLine[0].y },
                    { x: anglePoint2.x, y: anglePoint2.y }
                ];
            case WeaponType.SPEAR:
                return [
                    { x: box.x + this.atkLine[0].x, y: box.y + this.atkLine[0].y + (transform.f * 1.1) },
                    { x: box.x + this.atkLine[1].x, y: box.y + this.atkLine[1].y + (transform.f * 1.1) }
                ];
        }
    }

    retrieveAnglePoint(x, y, length, angle) {
        return {
            x: Math.round(x + length * Math.cos(angle * Math.PI / 180)),
            y: Math.round(y + length * Math.sin(angle * Math.PI / 180))
        };
    }

    update() {
        if (GameVars.atkCanv) {
            if (this.isPerformingAction) {
                let transform = new WebKitCSSMatrix(window.getComputedStyle(this.weaponCanv).transform);
                let newAtkLine = this.getUpdatedWeaponAtkLine(this.parentDiv.getBoundingClientRect(), transform);

                // just for debug
                // const ctx = GameVars.atkCanv.getContext("2d");
                // ctx.beginPath();
                // ctx.moveTo(newAtkLine[0].x, newAtkLine[0].y);
                // ctx.lineTo(newAtkLine[1].x, newAtkLine[1].y);
                // ctx.strokeStyle = 'red';
                // ctx.lineWidth = toPixelSize(1);
                // ctx.stroke();

                if (this.isPlayer) {
                    GameVars.currentRoom.enemies.forEach(enemy => lineCircleCollision(newAtkLine, enemy.collisionObj) && this.dealDmgToBlock(enemy));
                } else {
                    if (lineCircleCollision(newAtkLine, GameVars.player.collisionObj)) this.dealDmgToBlock(GameVars.player);
                }
            }
        }
    }

    dealDmgToBlock(obj) {
        if (!this.damagedObjs.has(obj)) {
            this.damagedObjs.set(obj, true);
            obj.lifeBar.takeDmg(this.dmg);
            if (this.weaponType === WeaponType.SHIELD) obj.validateMovement(
                obj.collisionObj.x + toPixelSize(8 * this.handDir),
                obj.collisionObj.y + toPixelSize(16));
            // drawPixelTextInCanvas(convertTextToPixelArt(this.dmg), GameVars.atkCanv, toPixelSize(1), newAtkLine[0].x / GameVars.pixelSize, newAtkLine[0].y / GameVars.pixelSize, "#edeef7", 2);
        }
    }

    getDamage() {
        switch (this.weaponType) {
            case WeaponType.FIST:
                return 1 * (this.size - 1);
            case WeaponType.SHIELD:
                return 2 * (this.size - 1);
            case WeaponType.SWORD:
                return 3 * (this.size - 1);
            case WeaponType.SPEAR:
                return 4 * (this.size - 1);
            case WeaponType.AXE:
                return 5 * (this.size - 1);
            case WeaponType.MORNING_STAR:
                return 3 * (this.size - 1);
            case WeaponType.HAMMER:
                return 7 * (this.size - 1);
            case WeaponType.GREATSWORD:
                return 9 * (this.size - 1);
        }
    }

    action() {
        if (!this.isPerformingAction) {
            this.isPerformingAction = true;
            this.atkAnimation = this.getWeaponAnimation();
            this.atkAnimation.finished.then(() => {
                this.isPerformingAction = false;
                this.damagedObjs.clear();
            });
        }
    }

    draw(color) {
        drawSprite(this.weaponCanv, this.sprite, toPixelSize(this.size), null, null, { "wc": color });
    }

    destroy() {
        this.weaponDiv.parentNode.removeChild(this.weaponDiv);
    }
}