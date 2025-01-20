class Course {
    constructor(ctx, courseWidth, courseHeight) {
        this.ctx = ctx;
        this.courseWidth = courseWidth;
        this.courseHeight = courseHeight;
        this.gridSize = 20;
        this.courseData = Array.from({ length: courseWidth }, () => Array.from({ length: courseHeight }, () => new Tile(GroundType.Rough)));
        this.holeX = -1;
        this.holeY = -1;
        this.teeX = -1;
        this.teeY = -1;
        this.strokePositions = [];
    }

    getGroundColor(type, opacity = 255) {
        var hex = opacity != 255 ? numHex(opacity) : '';
        switch (type) {
            case GroundType.None:
                return '#000000' + hex;
            case GroundType.Rough:
                return '#3A6E3A' + hex;
            case GroundType.Bunker:
                return '#FFFF99' + hex;
            case GroundType.Fairway:
                return '#679553' + hex;
            case GroundType.Forest:
                return '#00ff00' + hex;
            case GroundType.Water:
                return '#088CD1' + hex;
            case GroundType.Green:
                return '#C3D7A4' + hex;
            case GroundType.Hole:
                return '#ffffff' + hex;
            case GroundType.Tee:
                return '#679553' + hex;
        }
    }
    
    
    drawHole(ctx, x, y, drawFlag) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(x * this.gridSize + this.gridSize/2, y * this.gridSize + this.gridSize/2, this.gridSize/4, 0, Math.PI * 2);
        ctx.fill();
    
        if (drawFlag) {
            ctx.fillStyle = 'brown';
            ctx.fillRect(x * this.gridSize + this.gridSize * 0.4, y * this.gridSize - this.gridSize/4, this.gridSize/5, this.gridSize);
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(x * this.gridSize + this.gridSize/2, y * this.gridSize - this.gridSize/4);
            ctx.lineTo(x * this.gridSize + this.gridSize, y * this.gridSize);
            ctx.lineTo(x * this.gridSize + this.gridSize/2, y * this.gridSize+ this.gridSize/8);
            ctx.fill();
        }
    }
    
    drawBall(ctx, x, y, a = 1)
    {
        ctx.fillStyle = 'rgba(255, 255, 255, '+ a +')';
        ctx.beginPath();
        ctx.arc(x * this.gridSize + this.gridSize/2, y * this.gridSize + this.gridSize/2, this.gridSize/4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawTree(ctx, x, y) {
        // Draw trunk
        ctx.fillStyle = 'brown';
        ctx.fillRect(x + this.gridSize * 0.4, y + this.gridSize/2, this.gridSize/5, this.gridSize/2);
    
        // Draw crown
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(x + this.gridSize/4, y + this.gridSize/2, this.gridSize/4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + this.gridSize*0.75, y + this.gridSize*0.35, this.gridSize/4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + this.gridSize*0.45, y + this.gridSize/5, this.gridSize/4, 0, Math.PI * 2);
        ctx.fill();
    
        // Draw branches
        ctx.strokeStyle = 'brown';
        ctx.lineWidth = 2;
    
        ctx.beginPath();
        ctx.moveTo(x + this.gridSize/2, y + this.gridSize*0.6);
        ctx.lineTo(x+this.gridSize/4, y + this.gridSize*0.4);
        ctx.moveTo(x + this.gridSize/2, y + this.gridSize*0.6);
        ctx.lineTo(x+this.gridSize*0.7, y + this.gridSize*0.35);
        ctx.stroke();
    }

    draw(ctx) {
        for (let x = 0; x < this.courseWidth; x++) {
            for (let y = 0; y < this.courseHeight; y++) {
                const tile = this.courseData[x][y];
                if (tile.type === GroundType.Hole) {
                    ctx.fillStyle = this.getGroundColor(GroundType.Grseen);
                    this.holeX = x;
                    this.holeY = y;
                } else if (tile.type === GroundType.Tee) {
                    ctx.fillStyle = this.getGroundColor(GroundType.Fairway);
                    this.teeX = x;
                    this.teeY = y;
                } else if (tile.type === GroundType.Forest) {
                    ctx.fillStyle = this.getGroundColor(GroundType.Rough);
                } else {
                    ctx.fillStyle = this.getGroundColor(tile.type);
                }
    
                ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
    
                if (tile.type === GroundType.Forest) {
                    this.drawTree(ctx, x * this.gridSize, y * this.gridSize);
                }
    
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
                ctx.strokeRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
            }
        }
    
        this.drawHole(ctx, this.holeX, this.holeY, true);
        let alpha = 1;
        if (this.strokePositions.length > 1) {
            alpha = 0.5;
        }
 
        // loop through strokePositions and draw the ball
        if (this.strokePositions.length > 0) {
            let count=1;
            this.strokePositions.forEach(pos => {
                let alpha = 0.25;
                if (count == this.strokePositions.length) {
                    alpha = 1;
                }
                this.drawBall(ctx, pos.x, pos.y, alpha);
                count++;
            });
        } else {
            this.drawBall(ctx, this.teeX, this.teeY, alpha);
        }

        // Draw lines between stroke positions
        if (this.strokePositions.length > 1) {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.25)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.strokePositions[0].x * this.gridSize + this.gridSize / 2, this.strokePositions[0].y * this.gridSize + this.gridSize / 2);
            for (let i = 1; i < this.strokePositions.length; i++) {
                ctx.lineTo(this.strokePositions[i].x * this.gridSize + this.gridSize / 2, this.strokePositions[i].y * this.gridSize + this.gridSize / 2);
            }
            ctx.stroke();
        }
    }
    
    // Searches the grid for valid moves from the current position to the distance diagonal and stright lines and returns a list of points.
    // Invalid fields are out of bounds, water, and forrest
    // if x, y is in a bunker, the penalty is -2 on the distance
    // if x,y is rough, subtract 1 from the distance
    // if x, y is fairway, add once to distance, except if it's the tee
    getValidMoves(x, y, distance) {
        let validMoves = [];
        const sourceTile = course.courseData[x][y];
        if (x == this.teeX && y == this.teeY) { // Teeing up using driver, 2 extra distance
            distance += 2;
        } else if (sourceTile.type === GroundType.Bunker ) { // Sand is heavy -2 distance
            distance -= 2;
        } else if (sourceTile.type === GroundType.Rough) { // Rough is dificult -1 distance
            distance -= 1;
        } else if (sourceTile.type === GroundType.Fairway) { // Fairway is easy +1 distance
            distance += 1;
        }

        if (distance <= 0) {
            return validMoves;
        }

        if (distance > 1 && sourceTile.type === GroundType.Green) {
            validMoves = this.getValidMoves(x, y, 1);
        }

        // North
        if (y + distance < courseHeight && course.courseData[x][y + distance].type !== GroundType.Water && course.courseData[x][y + distance].type !== GroundType.Forest) {
            validMoves.push({ x: x, y: y + distance });
        }
        // North east
        if (x + distance < courseWidth && y + distance < courseHeight && course.courseData[x + distance][y + distance].type !== GroundType.Water && course.courseData[x + distance][y + distance].type !== GroundType.Forest) {
            validMoves.push({ x: x + distance, y: y + distance });
        }
        // East
        if (x + distance < courseWidth && course.courseData[x + distance][y].type !== GroundType.Water && course.courseData[x + distance][y].type !== GroundType.Forest) {
            validMoves.push({ x: x + distance, y: y });
        }
        // South east
        if (x + distance < courseWidth && y - distance >= 0 && course.courseData[x + distance][y - distance].type !== GroundType.Water && course.courseData[x + distance][y - distance].type !== GroundType.Forest) {
            validMoves.push({ x: x + distance, y: y - distance });
        }
        // South
        if (y - distance >= 0 && course.courseData[x][y - distance].type !== GroundType.Water && course.courseData[x][y - distance].type !== GroundType.Forest) {
            validMoves.push({ x: x, y: y - distance });
        }
        // South west
        if (x - distance >= 0 && y - distance >= 0 && course.courseData[x - distance][y - distance].type !== GroundType.Water && course.courseData[x - distance][y - distance].type !== GroundType.Forest) {
            validMoves.push({ x: x - distance, y: y - distance });
        }
        // West
        if (x - distance >= 0 && course.courseData[x - distance][y].type !== GroundType.Water && course.courseData[x - distance][y].type !== GroundType.Forest) {
            validMoves.push({ x: x - distance, y: y });
        }
        // North west
        if (x - distance >= 0 && y + distance < courseHeight && course.courseData[x - distance][y + distance].type !== GroundType.Water && course.courseData[x - distance][y + distance].type !== GroundType.Forest) {
            validMoves.push({ x: x - distance, y: y + distance });
        }

        return validMoves;
    }

}