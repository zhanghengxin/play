/**
 * Created by viyo on 二〇一八年五月六日
 */
var game={
    RN:4,CN:4,
    data:null,
    score:0,
    state:1,
    GAMEOVER:0,
    RUNNING:1,
    start:function(){
                this.state=this.RUNNING;
                this.score=0;
                this.data=[];
                for(var r=0;r<this.RN;r++){
                    this.data[r]=new Array(this.CN);//this.data.push([]);
                    for(var c=0;c<this.CN;c++){
                        this.data[r][c]=0;
                    }
                }
                this.randomNum();
                this.randomNum();
                this.updateView();
                document.onkeydown = function(e){
                    switch(e.keyCode){
                        case 37: this.moveLeft();break;
                        case 38: this.moveTop();break;
                        case 39: this.moveRight();break;
                        case 40: this.moveDown();break;
                    }
                }.bind(this);           //用onkeydown外的this替换内部的this
                console.log(this.data.join("\n"));
          },
    randomNum:function()                //在一个随机位置生成2或4
        {
            while (true) {
                var r = Math.floor(Math.random() * this.RN);
                var c = Math.floor(Math.random() * this.CN);
                if (this.data[r][c] === 0) {
                    this.data[r][c] = Math.random() < 0.5 ? 2 : 4;
                    break;
                }
            }
     },
    updateView:function(){              //更新数据
        for(var r=0;r<this.RN;r++){
            for(var c=0;c<this.CN;c++){
                var div=document.getElementById("c"+r+c);
                if(this.data[r][c]!=0){
                    div.innerHTML=this.data[r][c];
                    div.className="cell n"+this.data[r][c];
                }else{
                    div.innerHTML="";
                    div.className="cell";
                }
            }
        }
        document.getElementById("score").innerHTML=this.score;
        document.getElementById("gameOver").style.display=this.state===this.GAMEOVER?"block":"none";
                    this.state===this.GAMEOVER&&(
                        document.getElementById("final").innerHTML=this.score
                    );
    },
    moveLeft:function(){
        var before=String(this.data);
        for(var r=0;r<this.RN;r++){
            this.moveLeftInRow(r);
        }
        var after=String(this.data);
        if(after!=before){
            this.randomNum();
            this.isGameOver()&&(this.state=this.GAMEOVER);
            this.updateView();
        }
    },
    moveLeftInRow:function(r){                           //左移1行
        for(var c=0;c<this.CN-1;c++){                    //c从0开始，遍历data中r行，到<CN-1结束
            var nextc=this.getNextInRow(r,c);            //找data中r行c列右侧下一个不为0的位置nextc
            if(nextc==-1){break;}                        //如果nextc是-1，就退出循环
            else{                                        //否则
                if(this.data[r][c]==0){                  //如果r行c列为0
                    this.data[r][c]=this.data[r][nextc]; //将r行nextc列的值赋值给r行c列
                    this.data[r][nextc]=0;               //将r行nextc列的值置为0
                    c--;                                 //c留在原地
                }else if(this.data[r][c]==this.data[r][nextc]){     //否则，如果r行c列等于r行nextc列
                    this.data[r][c]*=2;                             //将r行c列的值*2
                    this.score+=this.data[r][c];                    //将r行c列的新值累加到score属性上
                    this.data[r][nextc]=0;                          //将r行nextc列的值置为0
                }
            }
        }
    },
    getNextInRow:function(r,c){
        for(var i=c+1;i<this.CN;i++){
            if(this.data[r][i]!=0)
                return i;
        }
        return -1;
    },
    moveRight:function(){
        this.xExchangge();
        this.moveLeft();
        this.xExchangge();
        this.updateView();
    },
    moveTop:function(){
        this.middleExchange();
        this.moveLeft();
        this.middleExchange();
        this.updateView();
    },
    moveDown:function(){
        this.middleExchange();
        this.moveRight();
        this.middleExchange();
        this.updateView();
    },
    xExchangge:function(){
        for(var i=0;i<4;i++){
            for(var j=0;j<2;j++){
                this.data[i][j]^=this.data[i][3-j];
                this.data[i][3-j]^=this.data[i][j];
                this.data[i][j]^=this.data[i][3-j];
            }
        }
    },
    middleExchange:function(){
        for(var i=0;i<4;i++){
            for(var j=i+1;j<4;j++){
                this.data[i][j]^=this.data[j][i];
                this.data[j][i]^=this.data[i][j];
                this.data[i][j]^=this.data[j][i];
            }
        }
    },
    isGameOver:function(){
        for(var r=0;r<this.RN;r++){
            for(var c=0;c<this.CN;c++){
//如果当前元素是0或c<this.CN-1且当前元素等于右侧元素或r<this.RN-1且当前元素等于下方元素
                if(this.data[r][c]==0||
                    c<this.CN-1
                    &&this.data[r][c]==this.data[r][c+1]||
                    r<this.RN-1
                    &&this.data[r][c]==this.data[r+1][c]){
                    return false;
                }
            }
        }
        return true;
    }
};
game.start();