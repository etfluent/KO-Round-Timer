//BEGIN Timer Code https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
  function CountDownTimer(duration, granularity) {
    this.duration = duration;
    this.granularity = granularity || 1000;
    this.tickFtns = [];
    this.running = false;
  }

  CountDownTimer.prototype.start = function() {
    document.getElementById("startButton").disabled = true;
    if (this.running) {
      return;
    }
    this.running = true;
    var start = Date.now(),
        that = this,
        diff, obj;

    (function timer() {
      diff = that.duration - (((Date.now() - start) / 1000) | 0);
      
      if (diff > 0) {
        setTimeout(timer, that.granularity);
      } else {
        diff = 0;
        that.running = false;
      }

      obj = CountDownTimer.parse(diff);
      that.tickFtns.forEach(function(ftn) {
        ftn.call(this, obj.minutes, obj.seconds);
      }, that);
    }());
  };

  CountDownTimer.prototype.onTick = function(ftn) {
    if (typeof ftn === 'function') {
      this.tickFtns.push(ftn);
    }
    return this;
  };

  CountDownTimer.prototype.expired = function() {
    return !this.running;
  };

  CountDownTimer.parse = function(seconds) {
    return {
      'minutes': (seconds / 60) | 0,
      'seconds': (seconds % 60) | 0
    };
  };
  //END Timer Code

  window.onload = function() {

    var display = document.querySelector('#time');
        
    
    document.querySelector('button').addEventListener('click', function () {
      var timeInputMin = parseInt(document.getElementById("timeInputMin").value*60),
          timeInputSec = parseInt(document.getElementById("timeInputSec").value),
          timeInput = timeInputMin + timeInputSec,
          timer = new CountDownTimer(timeInput),
          timeObj = CountDownTimer.parse(timeInput);

      format(timeObj.minutes, timeObj.seconds);
  
      timer.onTick(format).onTick(buttonSet);//.onTick(restart);
      console.log(timeInput);
      timer.start();
    });

    // function restart() {
    //   if (this.expired()) {
    //     timer = new CountDownTimer(timeInput);
    //     document.getElementById('endBell').play();
    //     setTimeout(function() { timer.start(); }, 2000);
    //   }
    // }

    function buttonSet(){
      if(this.expired()){
        setTimeout(function() {document.getElementById("startButton").disabled = false;}, 1000);
        document.getElementById('endBell').play();
      }
    }

    function format(minutes, seconds) {
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      display.textContent = minutes + ':' + seconds;
      document.getElementById("gauge-fill").style.width = (((parseInt(minutes*60)+parseInt(seconds))/(parseInt(this.duration)))*100)+"%";

    }
  };