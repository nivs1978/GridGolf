class Dice {
    constructor(container) {
        this.container = container;
        this.container.innerHTML = '<svg id="dice1" viewBox="0 0 100 100" width="4vh" height="4vh">'+
                    '<rect width="100" height="100" rx="15" ry="15" fill="white" stroke="black" stroke-width="5"/>'+
                    '<circle id="dot1" cx="50" cy="50" r="8" fill="black"/>'+
                    '<circle id="dot2" cx="20" cy="20" r="8" fill="black"/>'+
                    '<circle id="dot3" cx="80" cy="20" r="8" fill="black"/>'+
                    '<circle id="dot4" cx="20" cy="80" r="8" fill="black"/>'+
                    '<circle id="dot5" cx="80" cy="80" r="8" fill="black"/>'+
                    '<circle id="dot6" cx="20" cy="50" r="8" fill="black"/>'+
                    '<circle id="dot7" cx="80" cy="50" r="8" fill="black"/>'+
                '</svg>';
    }

    #show(no) {
        const dots = {
            1: ['dot1'],
            2: ['dot2', 'dot5'],
            3: ['dot1', 'dot2', 'dot5'],
            4: ['dot2', 'dot3', 'dot4', 'dot5'],
            5: ['dot1', 'dot2', 'dot3', 'dot4', 'dot5'],
            6: ['dot2', 'dot3', 'dot4', 'dot5', 'dot6', 'dot7']
        };
    
        const allDots = ['dot1', 'dot2', 'dot3', 'dot4', 'dot5', 'dot6', 'dot7'];
    
        allDots.forEach(dot => {
            document.getElementById(dot).style.display = 'none';
        });
    
        dots[no].forEach(dot => {
            document.getElementById(dot).style.display = 'block';
        });
    }
    
    throw() {
        const randomNumber = Math.floor(Math.random() * 6) + 1;
        let count = 0;
        const interval = setInterval(() => {
            this.#show(Math.floor(Math.random() * 6) + 1);
            count++;
            if (count >= 10) {
                clearInterval(interval);
                this.#show(randomNumber);
            }
        }, 50);
        return randomNumber;
    }        


}