
      var bikemax = 20;
      var gameTop = 30;
      var bikes = new Array();
      var stageW = 800;
      var stageH = 150;
      var messageLayer = new Konva.Layer();
      var layer = new Konva.Layer();
      var score = 0;
      var gameTime = 0;
      var start;
      var finish = false;
      var gameOver = false;

      function distance(a,b) {
        var ax = a.center.x;
        var ay = a.center.y;
        var bx = b.center.x;
        var by = b.center.y;
	var dist = Math.sqrt(Math.pow(bx-ax,2)+Math.pow(by-ay,2)); 
	return dist;
      }

       function computeCenter(s) {
         s.center = {x: s.getX() + s.getWidth()/2,
                            y: s.getY() + s.getHeight()/2,
                            radius: Math.max(s.getWidth(),s.getHeight())/2};
       }

      function nudge(s,dx,dy) {
	s.setX(s.getX()+dx);
	if (s.getY()+dy < gameTop) {
	    s.setY(gameTop);
	} else if (s.getY()+s.getHeight() > stage.getHeight()) {
	    s.setY(stage.getHeight()-s.getHeight());
	} else {
	    s.setY(s.getY()+dy);
	}
	computeCenter(s);
      }
      function checkFinish(s) {
          if (s.getX() >= stage.getWidth() && s.index!=0) {
	      ++score;
              s.done = true;  //kill this bike!
	  } 

      }
      // return true if c2 had to be moved
      function separate(c1, c2) {
        var dist = distance(c1,c2);
        var move = false;

        while (dist < c1.center.radius+c2.center.radius && !c2.done) {
          var x1 = c1.center.x;
          var y1 = c1.center.y;
          var x2 = c2.center.x;
          var y2 = c2.center.y;      
	  var dx = 0, dy = 0;
          dx = (x2-x1)/dist;
          dy = (y2-y1)/dist;
          nudge(c2,dx,dy);
          checkFinish(c2);
          move = true;
          dist = distance(c1,c2);
        }
        return (move);
      }
      // keep checking until nothing needs moving
      function checkCollisions(b) {
          for (var i=0 ; i < bikemax ; i++) {
	     if (!bikes[i].done && bikes[i] != b) {
               if (separate(b,bikes[i])) {
                  checkCollisions(bikes[i]);
               }
             }
          }
	  layer.draw();
      }

      function keepScore() {
          if (start && !gameOver) {
             writeMessage(messageLayer, "Time: "+((gameTime++)/10)+"  Bikes: "+score);
             if (score == bikemax-1) {
                writeMessage(messageLayer, "Done! Time: "+((gameTime++)/10)+"  Bikes: "+score); 
                gameOver = true;
             }
          }
      }

      function writeMessage(messageLayer, message) {
        var context = messageLayer.getContext();
        messageLayer.clear();
        context.font = '12pt Calibri';
        context.fillStyle = 'darkred';
        context.fillText(message, 0,25);
      }
      var stage = new Konva.Stage({
        container: 'container',
        width: stageW,
        height: stageH
      });
      var topLine = new Konva.Line({
	      points: [0, gameTop, stage.getWidth(), gameTop],
	      stroke: 'blue',
	      strokeWidth: 5,
	      lineCap: 'round',
	      lineJoin: 'round'
      });
      var bottomLine = new Konva.Line({
	      points: [0, stage.getHeight(), stage.getWidth(),stage.getHeight()],
	      stroke: 'green',
	      strokeWidth: 10,
	      lineCap: 'round',
	      lineJoin: 'round'
      });

      var imageObj = new Image();
      var imageObj2 = new Image();
      var finish = new Image();
      imageObj.onload = function() {
        var finishline = new Konva.Image({
          x: 720,
          y: stage.getHeight() / 2 - 50,
          image: finish,
          width: 106,
          height: 118
        });
      layer.add(finishline);
      for (var i=0 ; i < bikemax ; i++) {
         bikes[i] = new Konva.Image({
            x: (i==0) ? 50 : 100+Math.random()*(stageW-200),
            y: (i==0) ? 50 : (Math.random()*(stageH-gameTop))+gameTop,
            image: (i==0) ? imageObj2 : imageObj ,
            width: 50,
            height: 40,
            draggable: (i==0) ? true : false 
         });
         bikes[i].index = i;
         bikes[i].done = false;
         computeCenter(bikes[i]);
	 //         bikes[i].center = {x: bikes[i].getX() + bikes[i].getWidth()/2,
	 //                 y: bikes[i].getY() + bikes[i].getHeight()/2,
	 //                 radius: Math.max(bikes[i].getWidth(),bikes[i].getHeight())/2};
         layer.add(bikes[i]);
      }
      bikes[0].on('dragmove', function() {
         //if (finish) return;
         start = 1;
         this.center = {x: this.getX() + this.getWidth()/2,
                            y: this.getY() + this.getHeight()/2,
                            radius: Math.max(this.getWidth(),this.getHeight())/2};
         checkCollisions(this);
         //writeMessage(messageLayer,"");
	 if (this.center.x > stageW-30) {
	     //             writeMessage(messageLayer,"Finished!");
	 }
         layer.draw();
      });
      // Make sure nothing starts overlapping
      for (var i=0 ; i < bikemax ; i++) {
         checkCollisions(bikes[i]);
      }
      layer.add(topLine);
      layer.add(bottomLine);

      layer.draw();
      stage.add(layer);
      stage.add(messageLayer);
      writeMessage(messageLayer,"Drag the Green bike to help the other bikes finish!");

     
     }
      imageObj2.onload = function() {layer.draw()};
      finish.onload = function() {layer.draw()};

      imageObj.src = 'bikeblue.jpg';
      imageObj2.src = 'bikegreen.jpg';
      finish.src = 'finish.jpg';
      loop = setInterval(keepScore, 100);

