const btnSend = document.getElementById("email-btn");
const roulette = document.getElementById("box-roulette");
const form = document.getElementById("email-form");

btnSend.addEventListener("click", (e) => {
  e.preventDefault();
  const emailInput = document.getElementById("email").value;

  if (emailInput === "") {
    alert("Por favor, ingrese su correo electrónico.");
  } else {
    registerUser();
  }
});

function appearRoulette() {
  roulette.classList.remove("disabled");
  form.classList.add("disabled");
  funcRoulette();
}

function registerUser() {

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;

  const userEmail = localStorage.setItem("email", email);


  fetch('http://localhost:4000/registrar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nombre, email })
  })
    .then(response => response.json())
    .then(() => appearRoulette())
    .catch(error => {
      console.error('Error:', error);
    });

}

function funcRoulette() {
  (function ($) {
    $.fn.extend({
      roulette: function (options) {
        var defaults = {
          angle: 0,
          angleOffset: -45,
          speed: 10000,
          easing: "easeInOutElastic",
        };

        var opt = $.extend(defaults, options);

        return this.each(function () {
          var o = opt;
          var data = [
            { color: '#ff9f00', text: '5% OFF EN CDC' },
            { color: '#7984eb', text: '10% OFF EN CDC' },
            { color: '#169ed8', text: '15% OFF EN CDC' },
            { color: '#60b236', text: 'RELOJ CASTEL' },
            { color: '#ff193d', text: 'REINTENTALO' },
            { color: '#ff4b00', text: 'KIT CASTEL' },
          ];

          var $wrap = $(this);
          var $btnStart = $wrap.find("#btn-start");
          var $roulette = $wrap.find(".roulette");
          var wrapW = $wrap.width();
          var angle = o.angle;
          var angleOffset = o.angleOffset;
          var speed = o.speed;
          var esing = o.easing;
          var itemSize = data.length;
          var itemSelector = "item";
          var labelSelector = "label";
          var d = 360 / itemSize;
          var borderTopWidth = wrapW;
          var borderRightWidth = tanDeg(d);

          for (i = 1; i <= itemSize; i += 1) {
            var idx = i - 1;
            var rt = i * d + angleOffset;
            var itemHTML = $('<div class="' + itemSelector + '">');
            var labelHTML = '';
            labelHTML += '<p class="' + labelSelector + '">';
            labelHTML += '	<span class="text">' + data[idx].text + '<\/span>';
            labelHTML += '<\/p>';

            $roulette.append(itemHTML);
            $roulette.children("." + itemSelector).eq(idx).append(labelHTML);
            $roulette.children("." + itemSelector).eq(idx).css({
              "left": wrapW / 2,
              "top": -wrapW / 2,
              "border-top-width": borderTopWidth,
              "border-right-width": borderRightWidth,
              "border-top-color": data[idx].color,
              "transform": "rotate(" + rt + "deg)"
            });

            var textH = parseInt(((2 * Math.PI * wrapW) / d) * .5);

            $roulette.children("." + itemSelector).eq(idx).children("." + labelSelector).css({
              "height": textH + 'px',
              "line-height": textH + 'px',
              "transform": 'translateX(' + (textH * 1.3) + 'px) translateY(' + (wrapW * -.3) + 'px) rotateZ(' + (90 + d * .0) + 'deg)'
            });
          }

          function tanDeg(deg) {
            var rad = deg * Math.PI / 180;
            return wrapW / (1 / Math.tan(rad));
          }

          $btnStart.on("click", function () {
            rotation();
          });

          function rotation() {
            var completeA = 360 * r(5, 10) + r(0, 360);

            $roulette.rotate({
              angle: angle,
              animateTo: completeA,
              center: ["50%", "50%"],
              easing: $.easing.esing,
              callback: function () {
                var currentA = $(this).getRotateAngle() % 360; // Ángulo final
                var adjustedAngle = (currentA + 8.6) % 360; // Ajuste para compensar el selector a 90 grados
                console.log(adjustedAngle)
                var index = Math.floor((360 - adjustedAngle) / d) % itemSize;
                if (data[index].text === "REINTENTALO") {

                }
                else {
                  updatePrize(data[index].text); // Actualiza el premio
                  console.log(data[index].text)
                  finalMessage(data[index].text);
                }// Índice del premio

              },
              duration: speed
            });
          }

          function r(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          }

          function updatePrize(prizeText) {
            const prize = document.getElementById("prize");
            prize.textContent = prizeText; // Actualiza el texto con el premio
          }
        });
      }
    });

  })(jQuery);

  $(function () {
    $('.box-roulette').roulette();
  });
}


function finalMessage(premioText) {

  const finalMessage = document.getElementById("finalMessage");
  finalMessage.classList.remove("disabled")

  const premio = premioText;

  const email = localStorage.getItem("email")

  fetch('http://localhost:4000/premio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, premio })
  })
    .then(response => response.json())
    .catch(error => {
      console.error('Error:', error);
    });



  var count = 200;
  var defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });

}


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./serviceWorker.js')
      .then((registration) => {
        console.log('Service Worker registrado con éxito:', registration);
      })
      .catch((error) => {
        console.log('Error al registrar el Service Worker:', error);
      });
  });
}

