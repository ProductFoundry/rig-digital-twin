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
              }
              chart.update();
            }
            rig.setLocation(events.shift(), callback);
            eventStack.push(rig);
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
          label: 'Speed',
          yAxisID: 'speed',
          data: eventStack.history.map(eState => {
            return {
              x: eState.asc.timestamp,
              y: eState.motor.current,
              loc: eState.asc.location
            }
          }),
          fill: false,
          borderColor: '#de5e33',
          tension: 0.1
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
              color: '#33c3f2'
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
              color: '#66a941'
            }
          }
        }
      }
    });
  });


