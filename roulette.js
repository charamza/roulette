const items = [
    "http://demo.st-marron.info/roulette/sample/star.png",
	"http://demo.st-marron.info/roulette/sample/flower.png",
	"http://demo.st-marron.info/roulette/sample/coin.png",
	"http://demo.st-marron.info/roulette/sample/mshroom.png",
	"http://demo.st-marron.info/roulette/sample/chomp.png",
];

class Roulette {

    constructor() {
        this.SIZE = 128;
        this.LENGTH = 25;
        this.DURATION = 3000;

        this.progress = 0;

        this.startTime = 0;
        this.lastItem = 0;

        this.level = 0;
        
        this.roulette = document.getElementById("roulette");
        this.items = this.roulette.children;
    }

    init(images) {
        if (!Array.isArray(images)) {
            console.log("You need to pass images as an array!");
        }

        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        for (let i = 0; i < 6; i++) {
            const item = this.items[i];
            
            item.style.position = 'absolute';
            item.style.transform = `translateX(${i * this.SIZE}px)`;
            item.lastChild.src = this.getItem();
        }
    }

    start(lastItem) {
        this.level = 0;
        this.progress = 0;
        this.lastItem = lastItem;
        this.startTime = Date.now();

        for (let i = 0; i < 6; i++) {
            this.items[i].value = 0;
        }

        window.requestAnimationFrame(() => this.update());
    }

    update() {
        this.progress = (Date.now() - this.startTime) / this.DURATION;

        if (this.progress > 1) {
            this.progress = 1;
            this.render();
            return;
        }

        this.render();

        window.requestAnimationFrame(() => this.update());
    }

    render() {
        const off = this.interpolator(this.progress);
        const WIDTH = this.SIZE * 6;

        for (let i = 0; i < 6; i++) {
            const item = this.items[i];
            const base = (i + 1) * this.SIZE - off;
            const index = -Math.floor(base / WIDTH);
            const value = ((base % WIDTH) + WIDTH) % WIDTH - this.SIZE;
            
            item.style.transform = `translateX(${value}px)`;

            if (item.value != index) {
                this.level += index - item.value;

                item.value = index;
                item.lastChild.src = this.getItem();

                if (this.level == this.LENGTH - 3) {
                    item.lastChild.src = this.getItem(this.lastItem);
                }
            }
        }
    }

    interpolator(val) {
        return Math.sin(val * Math.PI / 2) * this.SIZE * this.LENGTH;
    }

    getItem(val) {
        val = typeof val !== "undefined" ? val : Math.floor(Math.random() * items.length);
        return items[val];
    }

}

const roulette = new Roulette();
roulette.init(items);


const btnStart = document.getElementById("roulette-start");
const selectWinner = document.getElementById("roulette-select-winner");

btnStart.onclick = () => roulette.start(parseInt(selectWinner.value, 10)); // KYTIČKA