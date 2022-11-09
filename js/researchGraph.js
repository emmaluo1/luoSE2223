//Graph CSV data using chart.js

async function getData(){

    const response = await fetch('data/researchGraph.csv');
    const data = await response.text();  // CSV in TEXT format

    const xType = [];   // x-axis labels = type of freshwater
    const ypH = [];  // y-axis values 
    const ySalinity = [];

    const table = data.split('\n').slice(1);  //split by line and remove the 0th row
    console.log(table);

    table.forEach(row => {                // operate on each row
        const columns = row.split(',');  // split each row into columns
        const type = columns[0];         // assign type value
        xType.push(type);               // push type value into array xType

        const pH = columns[1];        // pH values
        ypH.push(pH);              // push pH values into array ypH

        const salinity = columns[2];      // salinity values
        ySalinity.push(salinity);        // push pH values into array ySalinity

    });
    return {xType, ypH, ySalinity};
}

async function createChart(){
    const data = await getData();      //createChart() will wait until getData() processes

    // Configured for chart.JS 3.x and above

const ctx = document.getElementById('myChart');

const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: data.xType,
        datasets: [{
            label: 'pH Levels',
            data: data.ypH,
            backgroundColor: 'rgba(117,139,247,0.2)',
            borderColor: 'rgba(117,139,247,1)',
            borderWidth: 1,
            yAxisID: 'y'
        },
        {
            label: 'Salinity Levels (ppt)',
            data: data.ySalinity,
            backgroundColor: 'rgb(175,105,239,0.2)',
            borderColor: 'rgb(175,105,239,1)',
            borderWidth: 1,
            yAxisID: 'y2'
        },
    ]
    },
    options: {
        responsive: true,                   // Re-size based on screen size
        scales: {                           // x & y axes display options
            x: {
                title: {
                    display: true,
                    text: 'Type of Freshwater',
                    font: {
                        size: 20
                    },
                }
            },
            y: {
                position: 'left',
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'pH Levels',
                    color: 'rgb(117,139,247)',
                    font: {
                        size: 20
                    },
                },
                ticks: {
                    color: 'rgb(117,139,247)',
                    font: {
                        size: 12
                    }
                } 
            },
            y2: {
                position: 'right',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Salinity Levels (ppt)',
                    color: 'rgb(175,105,239)',
                    font: {
                        size: 20
                    },
                },
                ticks: {
                    color: 'rgb(175,105,239)',
                    font: {
                        size: 12
                    }
                } 
            }
        },
        plugins: {                          // title and legend display options
            title: {
                display: true,
                text: 'pH Levels and Salinity Levels (ppt) in Five Types of Freshwater',
                font: {
                    size: 24
                },
                padding: {
                    top: 10,
                    bottom: 30
                }
            },
            legend: {
                position: 'bottom'
            }
        }
    }
});

}

createChart();