/* Wires UI components to the Rig */
define('main', [
  'js/tools/chart',
  'js/mechanics/Rig',
  'js/runner/EventStack',
  'lib/fontawesome/fontawesome.min',
],
  function (Chart, Rig, EventStack, fontawesome) {
    const rig = new Rig();
    const startRun = $(".fa-circle-play");
    const eventStack = new EventStack();

    $(startRun).on('click', (e) => {
      // const { files } = e.target;
      // const f = new DataFileReader(files[0]);
      $.getJSON('./data/ebike-path.json', function (data) {
        const events = data.points;
        if (events) {
          const readAsEvents = setInterval(function () {
            if (events.length === 0) {
              clearInterval(readAsEvents);
              console.log("Chart complete");
            } else {
              function callback() {
                chart.data.labels.push(rig.asc.timestamp);
                chart.data.datasets[0].data.push({
                  x: rig.asc.timestamp,
                  y: rig.motor.current,
                  loc: rig.asc.location
                });
                chart.data.datasets[1].data.push({
                  x: rig.asc.timestamp,
                  y: rig.cannibal.current,
                });
                chart.data.datasets[3].data.push({
                  x: rig.asc.timestamp,
                  y: rig.asc.enclosingZone === null ? 0 : 1,
                });
              }
              chart.update();
              rig.setState(events.shift(), callback);
              eventStack.push(rig);
            }
          }, 100);
        }
      })
    })
    // function range(size, startAt = 0, interval = 1) {
    //   return [...Array(size).keys()].map(i => (i + startAt) * interval);
    // }
    const chart = new Chart(document.getElementById('chart-1'), {
      type: 'line',
      data: {
        datasets: [{
          label: 'Ebike power',
          yAxisID: 'motor',
          data: eventStack.history.map(rState => {
            return {
              x: rState.asc.timestamp,
              y: rState.motor.current * rState.motor.voltage,
              loc: rState.asc.location
            }
          }),
          fill: false,
          borderColor: '#de5e33',
          tension: 0.1,
          pointRadius: 2
        },
        {
          label: 'Cannibal input power', // blue
          yAxisID: 'cannibal',
          data: eventStack.history.map(rState => {
            return {
              x: rState.asc.timestamp,
              y: rState.motor.current,
              loc: rState.asc.location
            }
          }),
          fill: false,
          borderColor: '#33ceff',
          tension: 0.1,
          pointRadius: 2
        },
        {
          label: 'Speed', // green
          yAxisID: 'speed',
          data: eventStack.history.map(rState => {
            return {
              x: rState.cannibal.timestamp,
              y: rState.speed,
              loc: rState.asc.location
            }
          }),
          fill: false,
          borderColor: '#66AA42',
          tension: 0.1,
          pointRadius: 2
        },
        {
          label: 'Zone',
          yAxisID: 'zone',// yellow
          data: eventStack.history.map(rState => {
            return {
              x: rState.asc.timestamp,
              y: rState.cannibal.current,
            }
          }),
          fill: {
            target: 'origin',
            above: '#ffdd004f',   // Area will be red above the origin
          },
          borderColor: 'transparent',
          tension: 0.1,
          pointRadius: 1
        },
        ]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (item) => {
                return `${item.raw.y} A at  ${item.raw.x} (${item.raw.loc.lat}, ${item.raw.loc.lng})`
              }
            },
          },
        },
        animation: {
          y: {
            duration: 0,
            from: 0
          }
        },
        scales: {
          'cannibal': {
            type: 'linear',
            position: 'left',
            max: 120,
            min: 0,
            ticks: {
              callback: function (value, index, ticks) {
                return value + 'W';
              }
            },
            border: {
              color: '#33ceff'
            }
          },
          'motor': {
            type: 'linear',
            position: 'left',
            max: 30,
            min: 0,
            // grid: {
            //   color: 'rgba(255,0,0,0.1)',
            //   borderColor: 'red'
            // },
            ticks: {
              callback: function (value, index, ticks) {
                return value + 'W';
              }
            },
            border: {
              color: '#de5e33'
            }
          },

          'speed': {
            type: 'linear',
            position: 'right',
            max: 50,
            min: 0,
            ticks: {
              callback: function (value, index, ticks) {
                return value + 'kph';
              }
            },
            border: {
              color: '#66AA42'
            }
          },

          'zone': {
            type: 'linear',
            position: 'right',
            max: 1,
            min: 0,
            ticks: {
              callback: function (value, index, ticks) {
                return "";
              },
              min: 0,
              max: 1,
              stepSize: 1,
              autoSkip: true,
              maxTicksLimit: 2
            },
            gridLines: {
              drawBorder: false,
              display: false
            },
            border: {
              color: "transparent"
            }
          }
        }
      }
    });
  });


