define('main', [
  'js/tools/Draggable',
  'js/tools/Gsap',
  'js/tools/chart',
],
  function (Draggable, gsap, Chart) {
    gsap.gsap.registerPlugin(Draggable);
    function getValues(dvalues, u) {
      let values = [], unit = u ? u : 1;
      if (dvalues.indexOf("[") > -1) {
        const start = parseInt(dvalues.substring(1, dvalues.indexOf("-")));
        const end = parseInt(dvalues.substring(dvalues.indexOf("-") + 1, dvalues.length));
        for (let i = start; i <= end; i += unit) {
          values.push(i);
        }
      } else {
        values = inputslider.dataset.values.split(',')
      }
      return values;
    }

    $(".loading-indicator").attr("style", "display: none !important")

    document.querySelectorAll('.inputslider').forEach(
      (inputslider) => {
        let unit = 1;
        if (inputslider.dataset.unit) {
          unit = parseInt(inputslider.dataset.unit);
        }
        let values = getValues(inputslider.dataset.values, unit);

        let value = parseFloat(inputslider.dataset.value),
          min = parseFloat(values.first()),
          max = parseFloat(values.last()),
          input = inputslider.querySelector('input'),
          area = inputslider.querySelector('.area'),
          knob = inputslider.querySelector('.knob'),
          fill = inputslider.querySelector('.fill');


        values.forEach(
          (value, i) => {
            values[i] = value = parseFloat(value);

            let span = document.createElement('span');
            span.innerText = value;
            span.setAttribute('data-value', value);

            if (i == 0) {
              span.addClass('selected');
              input.value = value;
            }

            span.style.left = gsap.gsap.utils.mapRange(min, max, 0, 100, value) + '%';

            inputslider.querySelector('.values').appendChild(span);
          }
        );
        Draggable.default.create(knob, {
          type: 'x',
          edgeResistance: 1,
          bounds: area,
          throwProps: false,
          // onDrag: function () {
          //   handleInputslider(this, false, unit);
          // },
          onDragEnd: function () {
            handleInputslider(this, false, unit);
          }
        }
        );
      }
    );

    function handleInputslider(instance, snap, unit) {

      let inputslider = instance.target.closest('.inputslider'),
        fill = inputslider.querySelector('.fill'),
        values = getValues(inputslider.dataset.values, unit),
        min = parseFloat(values.first()),
        max = parseFloat(values.last()),
        xPercent = gsap.gsap.utils.mapRange(0, instance.maxX, 0, 100, instance.x),
        relativeValue = gsap.gsap.utils.mapRange(0, instance.maxX, min, max, instance.x),
        finalValue = gsap.gsap.utils.snap(values, relativeValue),
        snapX = gsap.gsap.utils.mapRange(min, max, 0, instance.maxX, finalValue),
        fillWidth = gsap.gsap.utils.mapRange(0, instance.maxX, 0, 100, snapX);

      if (snap) {
        gsap.gsap.to(instance.target, { duration: .2, x: snapX });
        gsap.gsap.to(fill, { duration: .2, width: fillWidth + '%' });
      } else {
        values.forEach(
          (value, i) => {
            values[i] = parseFloat(value);
          }
        );
      }
      fill.style.width = xPercent + '%';
      inputslider.querySelectorAll('.values span').forEach(
        (span) => {
          if (parseFloat(span.dataset.value) == finalValue) {
            span.addClass('selected');
          } else {
            span.removeClass('selected');
          }
        }
      );

      inputslider.querySelector('input').value = finalValue;
      // if (inputslider.id === "torqueSensor") ebike.setTorqueReading(finalValue);
      // else if (inputslider.id === "cadenceSensor") ebike.setCadenceReading(finalValue);
      // else if (inputslider.id === "currentSensor") ebike.setMotorCurrent(finalValue);
      // else if (inputslider.id === "rpmSensor") ebike.rpm = finalValue;
      // printState();
    }
    $("#start").on("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      const start = $(e.currentTarget);
      if (start.hasClass("started")) {
        start.removeClass("started");
        start.addClass("btn-primary");
        start.removeClass("btn-secondary");
        start[0].innerHTML = "Start";
        $("#pause").attr("disabled", true);
        timer.stop();
      } else {
        start.addClass("started");
        start.removeClass("btn-primary");
        start.addClass("btn-secondary");
        start[0].innerHTML = "Stop";

        timer = startTimer(0, "timer");
        $("#pause").removeAttr("disabled");
        $("#pause").off("click");
        $("#pause").on("click", function (event) {
          event.stopPropagation();
          event.preventDefault();
          const el = $(event.currentTarget);
          const paused = el.hasClass("paused")
          if (!paused) {
            timer.pause();
            el.addClass("paused");
            el.removeClass("btn-primary");
            el.addClass("btn-danger");
            el[0].innerHTML = "Resume";
          } else {
            timer.resume();
            el.removeClass("paused");
            el.addClass("btn-primary");
            el.removeClass("btn-danger");
            el[0].innerHTML = "Pause";

          }
        })
      }
    })

    // const testCaseSelector = $("#test-case-selector");
    // testCaseSelector.append("<option value=''></option>");
    // const testCases = bs.getAllSpecs();
    // models.forEach(m => testCaseSelector.append("<option value='" + JSON.stringify(m) + "'>" + m.name + "</option>"));
    // testCaseSelector.on("change", function (e) {
    //   $(".loading-indicator").show();
    //   const optionSelected = JSON.parse($(this).val());
    //   const specRealizer = new SpecRealizer(optionSelected.id);
    //   ebike = specRealizer.getEbikeEntity();
    //   ebike.init();
    //   printState();
    //   // Hide all
    //   const availableSS = ebike.availableSupportSettings.split(",");
    //   $(".support-setting").empty();
    //   availableSS.forEach(ss => {
    //     $(".support-setting").append(
    //       '<input type="radio" class="btn-check support-setting-input" name="btnradioss" id="btnradioss' + ss + '"' +
    //       'autocomplete = "off" value = "' + ss + '" >' +
    //       '<label class="btn btn-outline-primary" for="btnradioss' + ss + '">' + ss + '</label>'
    //     )
    //   })
    //   $(".support-setting-input").on("change", function () {
    //     ebike.supportSetting = parseInt(this.value);
    //     printState();

    //   })
    //   $(".loading-indicator").attr("style", "display: none !important");

    // })

    const fileInput = $(".files")
    const reportTable = $("#assets tbody");
    let mpArray = new Array();

    $(fileInput).on('change', (e) => {
      const { files } = e.target;
      const f = new DataFileReader(files[0]);
      const check = function () {
        const events = f.getEvents();
        if (events) {
        }
        setTimeout(check, 1000);
      }

      check();


    });
    function range(size, startAt = 0, interval = 1) {
      return [...Array(size).keys()].map(i => (i + startAt) * interval);
    }
    const chart = new Chart(document.getElementById('chart-container-1'), {
      type: 'line',
      data: {
        labels: range(50, 0, 4),
        datasets: [{
          label: 'Cannibal power input vs rig speed',
          data: [{x: 0, y:0}, {x:12, y:5},{x:32, y: 10},{x:60,y: 15},{x:96,y: 20},{x:140,y: 25},{x:192, y:30}],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Cannibal power input vs rig speed with resistance',
          data: [{x: 0, y:0}, {x:12, y:4},{x:32, y: 8},{x:60,y: 13},{x:96,y: 17},{x:140,y: 23},{x:192, y:27}],
          fill: false,
          borderColor: 'rgb(192,75, 192)',
          tension: 0.1
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (item) => {
                return `${item.label} W cannibal i/p: ${item.formattedValue} km/h`
              }
            },
          },
        },
        onClick: (e) => {
        }
      }
    });


  });