function Sushi(x,y,speed,color,size,sushi,slicedSushi1,slicedSushi2,name){
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.color = color;
    this.size = size;
    this.xSpeed = randomXSpeed(x);
    this.ySpeed = random(-10.4, -7.4);
    this.sushi = sushi;
    this.slicedSushi1 = slicedSushi1;
    this.slicedSushi2 = slicedSushi2;
    this.name = name;
    this.sliced = false;
    this.visible = true;
}
Sushi.prototype.draw = function(){
    if(this.sliced && this.name != 'boom'){
        image(this.slicedSushi1, this.x - 25, this.y, this.size, this.size);
        image(this.slicedSushi2, this.x + 25, this.y, this.size, this.size);
    }else{
        image(this.sushi, this.x, this.y, this.size * (width / 800), this.size * (height / 635));
    }
};


Sushi.prototype.update = function(){
    if(this.sliced && this.name != 'boom'){
        this.x -= this.xSpeed ;
        this.y += this.ySpeed;
        this.ySpeed += gravity*5;
    }else{
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.ySpeed += gravity;
    }
    if(this.y > height){
        this.visible = false;
    }
};

function randomSushi(){
    var x = random(width);
    var y = height;
    var size = noise(frameCount)*20 + 40;
    var col = color(random(255),random(255),random(255));
    var speed = random(3,5);
    var idx = round(random(0,sushiList.length-1));
    var sushi = sushiImgs[idx];
    var slicedSushi1 = slicedsushiImgs[2*idx];
    var slicedSushi2 = slicedsushiImgs[2*idx + 1];
    var name = sushiList[idx];
    return new Sushi(x,y,speed,col,size,sushi,slicedSushi1,slicedSushi2,name);
}

function randomXSpeed(x){
    if( x > width/2 ){
        return random(-2.8,-0.5);
    }else{
        return random(0.5,2.8);
    }
};
