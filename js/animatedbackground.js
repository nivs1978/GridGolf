class AnimatedBackground {
    constructor(container) {
        this.container = container;
        this.container.innerHTML = '<svg viewBox="0 0 100 200" style="height: 80%; position: absolute; top: 10%; left: 50%; transform: translateX(-50%);" xmlns="http://www.w3.org/2000/svg">' +
        '<g stroke="white" stroke-opacity="0.5">' +
        '    <line x1="10" y1="0" x2="-50" y2="200" />' +
        '    <line x1="30" y1="0" x2="-10" y2="200" />' +
        '    <line x1="50" y1="0" x2="30" y2="200" />' +
        '    <line x1="70" y1="0" x2="70" y2="200" />' +
        '    <line x1="90" y1="0" x2="110" y2="200" />' +
        '    <line x1="110" y1="0" x2="150" y2="200" />' +

        '    <line x1="0" y1="0" x2="100" y2="0" />' +
        '    <line x1="0" y1="20" x2="100" y2="20" />' +
        '    <line x1="0" y1="50" x2="100" y2="50" />' +
        '    <line x1="0" y1="90" x2="100" y2="90" />' +
        '    <line x1="0" y1="140" x2="100" y2="140" />' +
        '    <line x1="-20" y1="199" x2="120" y2="199" />' +
        '</g>' +
        '<ellipse' +
        '    cx="50.120647"' +
        '    cy="158.82379"' +
        '    rx="15.222426"' +
        '    ry="5.3278494"' +
        '    fill="white"' +
        '    id="ellipse6"' +
        '        style="fill:#c26833;fill-opacity:1;stroke-width:0.380561" />' +
        '     <path' +
        '        style="fill:#ffffff;stroke-width:0.380561"' +
        '        d="m 35.929494,160.77622 c 7.514992,-5.14814 23.027101,-4.97027 28.425959,0.0708 -5.774776,4.48622 -23.242144,4.40291 -28.425959,-0.0708 z"' +
        '        id="path834" />' +
        '     <rect x="48" y="10" width="4" height="154" fill="#ffa500" id="rect8" style="stroke-width:1.13033" />' +
        '     <polygon id="flag" points="90,40 52,40 52,10 90,10" fill="#ff0000" />' +
        '</svg>';
        this.waveFlagId = null;
        this.mainAnimationRun = true;
    }

    waveFlag(timestamp) {
        const amplitude = 2;
        const frequency = 300;
        let degree = timestamp / frequency;
        let degreeStep = Math.PI / 12;
        const points = [
            { x: 52, y: 10 },
            { x: 60, y: 10 + amplitude * 0.5 * Math.sin(degree + (degreeStep--)) },
            { x: 65, y: 10 + amplitude * Math.sin(degree + (degreeStep--)) },
            { x: 70, y: 10 + amplitude * Math.sin(degree + (degreeStep--)) },
            { x: 75, y: 10 + amplitude * Math.sin(degree + (degreeStep--)) },
            { x: 80, y: 10 + amplitude * Math.sin(degree + (degreeStep--)) },
            { x: 85, y: 10 + amplitude * Math.sin(degree + (degreeStep--)) },
            { x: 90, y: 10 + amplitude * Math.sin(degree + (degreeStep--)) },
            { x: 90, y: 40 + amplitude * Math.sin(degree + (degreeStep++)) },
            { x: 85, y: 40 + amplitude * Math.sin(degree + (degreeStep++)) },
            { x: 80, y: 40 + amplitude * Math.sin(degree + (degreeStep++)) },
            { x: 75, y: 40 + amplitude * Math.sin(degree + (degreeStep++)) },
            { x: 70, y: 40 + amplitude * Math.sin(degree + (degreeStep++)) },
            { x: 65, y: 40 + amplitude * Math.sin(degree + (degreeStep++)) },
            { x: 60, y: 40 + amplitude * 0.5 * Math.sin(degree + (degreeStep++)) },
            { x: 52, y: 40 }
        ];
    
        const pointsString = points.map(point => `${point.x},${point.y}`).join(' ');
        flag.setAttribute('points', pointsString);
    
        if (this.mainAnimationRun) {
            this.waveFlagId = requestAnimationFrame(this.waveFlag.bind(this));
        }
    }
    

    start() {
        this.mainAnimationRun = true;
        this.waveFlag(0);
    }

    stop() {
        this.mainAnimationRun = false;
        cancelAnimationFrame(this.waveFlagId);
    }
}