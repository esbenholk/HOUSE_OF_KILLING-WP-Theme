/**
 * File tickers.js.
 *
 * handles the tickers
 */


jQuery(document).ready(function($) {
  ticker("ticker1");

  if(document.getElementById("footer")){
    ticker("ticker2");
  }
 
  
  function ticker(element) {
    
    var ticker = document.getElementById(element);

    var headlines = ticker.querySelector(".headlines");
    var links = headlines.getElementsByTagName("a");
    var left = headlines.offsetLeft;
    var animId;

    headlines.addEventListener("mouseenter", function() {
      cancelAnimationFrame(animId);
    });

    headlines.addEventListener("mouseleave", function() {
      moveHeadLines();
    });

    moveHeadLines();

    function moveHeadLines() {
      left--;
      if (left <= -links[0].offsetWidth) {
        left += links[0].offsetWidth;
        headlines.appendChild(links[0]);
      }
      headlines.style.left = left + "px";
      animId = requestAnimationFrame(moveHeadLines);
    }
  }



});

