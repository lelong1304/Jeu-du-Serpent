window.onload = function() {
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var snakee;
    var applee;
    var widthInBlock = canvasWidth/blockSize;
    var heigbtInBlock = canvasHeight/blockSize;
    var score;
    
    init();
    
    function init(){
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid black";
        canvas.style.margin = "20px auto";
        canvas.style.display = "block";
        
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }
   
    function refreshCanvas(){
        snakee.advance();
        if (snakee.checkCollision()){
            // game over
            gameOver();
        }
        else {
            if (snakee.isEatingApple(applee)){
                // Le serpent a mangé la pomme
                score++;
                snakee.ateApple = true;
                do {
                    applee.setNewPosition();
                } while (applee.isOnSnake(snakee))
                
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            snakee.draw();
            applee.draw();
            drawScore();
            setTimeout(refreshCanvas,delay);
        }
       
    }
        
    function gameOver(){
        ctx.save();
        ctx.fillText("Game Over", 5, 15);
        ctx.fillText("Appuyer sur la touch Espace pour rejouer", 5, 30);
        
        ctx.restore();
        
    }
    function restart(){
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }
    function drawScore(){
        ctx.save();
        ctx.fillText(score.toString(), 5, canvasHeight - 5);
        ctx.restore();
    }
    function drawBlock(ctx, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x ,y ,blockSize, blockSize);
    }
    
    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for (var i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }  
            ctx.restore();
        };
        
        this.advance = function(){
            var nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0]--;
                    break;
                case "right":
                    nextPosition[0]++;
                    break;
                case "down":
                    nextPosition[1]++;
                    break;
                case "up":
                    nextPosition[1]--;
                    break;
                default:
                    throw("invalid Direction");
                    
            }
            this.body.unshift(nextPosition);
            if (!this.ateApple){
                this.body.pop();
            }
            else this.ateApple = false;
        };
        this.setDirection = function(newDirection){
            var allowedDirection;
            switch(this.direction){
                case "left":
                case "right":
                    allowedDirection = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirection = ["left", "right"];
                    break;
                 default:
                    throw("invalid Direction");
            }
            if (allowedDirection.indexOf(newDirection) > -1 ){
                this.direction = newDirection;
            }
        };
        this.checkCollision = function(){
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlock - 1;
            var maxY = heigbtInBlock - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true;
            }
            for (var i = 0; i < rest.length ; i++){
                if (snakeX === rest[i][0] && snakeY === rest[i][1]){
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        };
        
        this.isEatingApple = function(appleToEat){
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1] )
                return true;
            else return false;
          
        };
        
        
    }
    
    function Apple(position){
        this.position=position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#ff9900";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x,y,radius,0,Math.PI*2,true);
            ctx.fill();
            ctx.restore();
        };
        
        this.setNewPosition = function(){
            var newX = Math.round(Math.random() * (widthInBlock - 1));
            var newY = Math.round(Math.random() * (heigbtInBlock - 1));
            this.position = [newX, newY];
        };
        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;
            for (var i = 0; i < snakeToCheck.body.length; i++){
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }
    
    document.onkeydown = function handleDown(e){
        var key = e.keyCode;
        var newDirection;
        switch (key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up"
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
             default:
                return;
        }
        snakee.setDirection(newDirection);
    }
    
}