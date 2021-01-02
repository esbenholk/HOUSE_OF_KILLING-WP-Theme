

(function() {
   
    var images = [
        "https://tarotcars.s3.amazonaws.com/anistonbubblesboy.png",
        "https://stayvirtual.s3.amazonaws.com/sexy-min.png",
        "/wp-content/themes/house_of_killing/icons/ghosticon.png",
        "/wp-content/themes/house_of_killing/icons/HOK.png"

    ];

    document.addEventListener("mousemove", function(e) {
            var logo = document.getElementById("sexy-object");
            logo.src = images[Math.floor(Math.random() * images.length)];
    });

})();
jQuery(document).ready(function($) {
    let gifs = [
        "https://stayvirtual.s3.amazonaws.com/gifs/plansforstraightsociety.gif",
        "https://stayvirtual.s3.amazonaws.com/gifs/loseyourself.gif",
        "https://media.giphy.com/media/egZxuFFv2Fuo/giphy.gif",
        "https://media.giphy.com/media/wo5VKuuDJ4dqM/giphy.gif",
        "https://media.giphy.com/media/IncRxXM0SwW52/giphy.gif",
        "https://media.giphy.com/media/JvjUdyOAuz7BC/giphy.gif",
        "https://media.giphy.com/media/LFpz55LDv6UNy/giphy.gif",
        "https://media.giphy.com/media/yR8D7WUxmDeYU/giphy.gif",
        "https://media.giphy.com/media/zBzDDd80bYmqc/giphy.gif",
        "https://media.giphy.com/media/sUgwDm1SZTIYM/giphy.gif",
        "https://media.giphy.com/media/12AxFxBtmAxjmE/giphy.gif",
        "https://media.giphy.com/media/2vHtQWLManq80/giphy.gif",
        "https://media.giphy.com/media/S84LGdWx8NyM0/giphy.gif",
        "https://media.giphy.com/media/Mv6zU4UiWhprW/giphy.gif",
        "https://media.giphy.com/media/8lIUihFNoopWM/giphy.gif",
        "https://media.giphy.com/media/l0ExpROPyfgMr29rO/giphy.gif",
        "https://media.giphy.com/media/Nh1l0FTpZa6yc/giphy.gif",
        "https://media.giphy.com/media/VrdgzSHqyu45a/giphy.gif",
        "https://media.giphy.com/media/b07kM34snz0Yw/giphy.gif",
        "https://media.giphy.com/media/j0kJJkAAZ5XzfPyaYt/giphy.gif",
        "https://media.giphy.com/media/cmB2M8iPbUHESStDkj/giphy.gif",
        "https://media.giphy.com/media/huClz5uZoKd2mVMTZj/giphy.gif",
        "https://media.giphy.com/media/JoPhZRhuqyp6ZMQlXH/giphy.gif",
        "https://media.giphy.com/media/YN7ucFAj8mmMYiqQgN/giphy.gif",
        "https://media.giphy.com/media/WoiEiD7Mgp133zhjCe/giphy.gif",
        "https://media.giphy.com/media/Pgo81ayYAjJQuKCBQ7/giphy.gif",
        "https://media.giphy.com/media/WtUfKVXTnGPkPXgYYF/giphy.gif",
        "https://media.giphy.com/media/cilH3zxEcaMJbTGUeV/giphy.gif",
        "https://media.giphy.com/media/U5aw40VHGnjgslkruP/giphy.gif",
        "https://media.giphy.com/media/XAZ2RACKVU8ks9mCmd/giphy.gif",
        "https://media.giphy.com/media/QsJKiTwswxeCEdFvDO/giphy.gif",
        "https://media.giphy.com/media/8YHiloXgjXS48jNdHH/giphy.gif",
        "https://media.giphy.com/media/lo5I1jlfSfIxDRBwsW/giphy.gif",
        "https://media.giphy.com/media/4HrMML1yrndbSkP4N2/giphy.gif",
        "https://houseofkillingwebsite.s3.amazonaws.com/packyourstuff/13.gif",
        "https://media.giphy.com/media/xT9IgwE5xUGOJRp8ac/giphy.gif",
        "https://media0.giphy.com/media/edTIBcz8n2vY1W6hFm/giphy.gif",
        "https://media2.giphy.com/media/SI7JNigEh5MFOHNsHs/giphy.gif",
        "https://media0.giphy.com/media/3o751W9UZkl2qIBU7m/giphy.gif",
        "https://media3.giphy.com/media/26wkOSgJXUj7vXAmA/giphy.gif",
        "https://media2.giphy.com/media/3ohjV87lCNeIUSWLQs/giphy.gif",
        "https://media0.giphy.com/media/3otWpClX6kA11rGIIE/giphy.gif",
        "https://media3.giphy.com/media/l1J9NNRLeqv31Zrt6/giphy.gif",
        "https://media3.giphy.com/media/3ohhwiZ4BpOl8owd8s/giphy.gif",
        "https://media0.giphy.com/media/l1J9sOfvlQ0qJhYNG/giphy.gif",
        "https://media3.giphy.com/media/3o6nV30Zl726AAQn4c/giphy.gif",
        "https://media2.giphy.com/media/3o7aDboKukwmgjl9o4/giphy.gif",
        "https://media3.giphy.com/media/TOywBWfWGPp8A/giphy.gif",
        "https://media3.giphy.com/media/oFbMEyPsF8l8I/giphy.gif",
        "https://media3.giphy.com/media/MrhVj8ttq21jO/giphy.gif",
        "https://media0.giphy.com/media/jV8qpHoeKHSso/giphy.gif",
        "https://media2.giphy.com/media/Dox0Kt4jqc2aI/giphy.gif",
        "https://media3.giphy.com/media/aXVQQKKMOET7i/giphy.gif",
        "https://media2.giphy.com/media/2k6dfyXxPO9Yk/giphy.gif?cid=ecf05e47495d3890d1ba75b08e750662d10a9a200fe3c158&rid=giphy.gif",
        "https://media2.giphy.com/media/XZs09O9Zt8PJbBiExV/giphy.gif",
        "https://i.pinimg.com/originals/e7/bb/d7/e7bbd701ee89068c84adec59ab6185ea.gif",
        "https://media3.giphy.com/media/gKedtSA13RmkDpljH3/giphy.gif",
        "https://media1.giphy.com/media/h7FRoZryQfuYuWBRfJ/giphy.gif",
        "https://media0.giphy.com/media/f74gZGGQXhm0mwkLkN/giphy.gif",
        "https://media3.giphy.com/media/fu8i2u9slez5Y8CHAp/giphy.gif",
        "https://media1.giphy.com/media/f7A9wqX1KvBxDqYFov/giphy.gif",
        "https://media0.giphy.com/media/RJb4Tp1vfrCIZXfbSw/giphy.gif",
        "https://media1.giphy.com/media/gHQ7AZDX6UVr70XnaV/giphy.gif",
        "https://media3.giphy.com/media/LmkiCikv9tB9REf1CL/giphy.gif"
        
        
        
    ]

    let menu_open = false;

    //Remove transition delay on products
    setTimeout(function(){ 
        $("body").removeClass('inku-animations-delay');         
    }, 2000);




    setTimeout(function(){ $("body").removeClass('pace-running'); $("body").addClass('pace-done'); }, 4000);


    $(document).on('click', '.nav-btn', function(event) {
        event.preventDefault();
        /* Act on the event */
            $('body').toggleClass('menu-open');
            
            if(menu_open === false){
                menu_open = true;
                setTimeout(() => {
                    $("#archive").css("opacity", "0.6")
                }, 500);
                


             
            } else if (menu_open === true){
                menu_open = false;
                setTimeout(() => {
                    $("#archive").css("opacity", "1")           
                 }, 100);
               
            }
        
    });
   



    let image1 =  $("#image1")[0];
    let image2 =  $("#image2")[0];


    $(document).on('click', '#remix', function(event) {
        event.preventDefault();
        console.log("remix images");
        image1.src = gifs[Math.floor(Math.random() * gifs.length)];
        image2.src = gifs[Math.floor(Math.random() * gifs.length)];
    });

    $(document).ready(function() {
        $("inku-preloader").fadeOut(20000);


        if(window.location === "/"){
            setTimeout(function(){ 
                $('body').toggleClass('menu-open');
            }, 5000);
        }
   


        if(document.getElementById("footer")){
            image1.src = gifs[Math.floor(Math.random() * gifs.length)];
            image2.src = gifs[Math.floor(Math.random() * gifs.length)];
        }

   


        var balls = document.getElementsByClassName("ball");
        if(balls){
        document.onmousemove = function(event){
            var x = event.clientX * 100 / window.innerWidth + "%";
            var y = event.clientY * 100 / window.innerHeight + "%";
        
        
            for(var i=0;i<2;i++){
                balls[i].style.left = x;
                balls[i].style.top = y;
                balls[i].style.transform = "translate(-"+x+",-"+y+")";
            }
            }

    }

  });
  





});


