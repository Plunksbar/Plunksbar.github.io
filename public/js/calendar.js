const date = new Date();

const months = { 'def':["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                    'short': ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]};
const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo",];

let selection = {}
const resetSelection = function() {
    selection = {}
    renderCalendar();
    renderRightBar();
}

let lastSubmitted = {}
const submitSelection = function() {
    let submitted = document.querySelector('#submitted');
    let lastSubmitted = selection;
    let list = "";
    for(let [key, value] of Object.entries(lastSubmitted)) {
        list += `<div class="month-div"><div class="selected-month">${months.def[key]}</div><div class="days-list">`
        for(let [idx, day] of value.sort((a, b) => {return a - b;}).entries()) {
            list += `<div class="selected-day">${day},</div>`
        }
        list += '</div></div>'
    }
    submitted.innerHTML = list;
    // To fill when backside is implemented
}

document.querySelector('.date p').innerHTML = `${days[date.getDay()]} ${date.getDate()} ${months.short[date.getMonth()]}, ${date.getFullYear()}`

const renderRightBar = function() {
    const selectionList = document.querySelector('.selected-days');
    let list = "";
    for(let [key, value] of Object.entries(selection)) {
        list += `<div class="month-div"><div class="selected-month">${months.def[key]}</div><div class="days-list">`
        for(let [idx, day] of value.sort((a, b) => {return a - b;}).entries()) {
            list += `<div class="selected-day">${day},</div>`
        }
        list += '</div></div>'
    }
    selectionList.innerHTML = list;
    monthAddListeners();
}

const renderCalendar = function() {
    date.setDate(1);

    const monthDays = document.querySelector('.days');

    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    const firstDayIndex = date.getDay() - 1 === -1 ? 6 : date.getDay() - 1;
    const lastDayIndex = new Date(date.getFullYear(), date.getMonth(), 0).getDay() - 1;
    const nextDays = 42 - lastDay - firstDayIndex;

    document.querySelector('.date h1').innerHTML = months.def[date.getMonth()];

    let day = "";
    for (let x = firstDayIndex; x > 0; x--) {
        day += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
    };

    for (let i = 1; i <= lastDay; i++) {
        if( !(i === new Date().getDate() && date.getMonth() == new Date().getMonth())) {
            
            day += `<div class="day"`;
        } else {
            day += `<div class="today day"`;
        } 
        if (selection[date.getMonth()] !== undefined && selection[date.getMonth()].includes(i)) {
            day += ` style="background-color: #719bbd;"`
        }
        day += `>${i}</div>`
    };
    for (let j = 1; j <= nextDays; j++) {
        day += `<div class="next-date">${j}</div>`;
    };
    monthDays.innerHTML = day;
}

let actionToDo = {'mode': -1, 'modeSelected':false}; // 1 for instert, 0 for substract
const resetAction = function() {actionToDo.mode = -1; actionToDo.modeSelected = false};
const enterDate = function(month, day) {
    if (month in selection) {
        selection[month].push(day);
    } else {
        selection[month] = []
        selection[month].push(day);
    }
}
const toogleSelection = function(target) {
    let selectedDate = new Date(date.getFullYear(), date.getMonth(), target.innerHTML);
    let _month = selectedDate.getMonth();
    let _day = selectedDate.getDate();;
    if (target.style.backgroundColor === "") {
        if (!(actionToDo.modeSelected) || actionToDo.mode === 1) {
            target.style.backgroundColor = "#719bbd";

            enterDate(_month, _day);
            renderRightBar();
            actionToDo.modeSelected = true;
            actionToDo.mode = 1;
        }

    } else {
        if (!(actionToDo.modeSelected) || actionToDo.mode === 0) {
            target.style.backgroundColor = "";

            selection[_month].splice(selection[_month].indexOf(_day), 1);
            if (selection[_month].length === 0) {delete selection[_month]} //Delete the month key from the Object if it is empty
            renderRightBar();
            actionToDo.modeSelected = true;
            actionToDo.mode = 0;
        }
    }
}
const selectElement = function(e, input) {
    let target = e.target;
    let mouse = e.buttons;
    if(target.className === 'day' || target.className === 'today day') {
        if(input === 'click') {
            toogleSelection(target);
        } else if(input === 'hover' && (mouse === 1 || mouse === 3)) {
            toogleSelection(target);
        }
    }
}

document.querySelector('.days').addEventListener('mouseover', (e) => {selectElement(e,'hover')});
document.querySelector('.days').addEventListener('mousedown', (e) => {selectElement(e,'click')});
document.addEventListener('mouseup', () => {if (actionToDo.modeSelected) {resetAction()}})

document.querySelector('.prev').addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

document.querySelector('.next').addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

const monthAddListeners = function (){
    document.querySelectorAll('.selected-month').forEach(item => {
        item.addEventListener('click', (e) => {
            date.setMonth(months.def.indexOf(e.target.textContent));
            renderCalendar();
        });
    });
};

/*Slider Selector*/
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

$(document).ready(function () {
    $("#demo").keypress(function(e) {
        var value = this.innerHTML;
        if (isNaN(String.fromCharCode(e.which))) e.preventDefault();
        $("#demo").keyup(function(e) {
            if (this.innerHTML > 100) {
                this.innerHTML = 100;
            }
            if (this.innerHTML[0] === '0') {
                this.innerHTML = this.innerHTML.substring(1);
            }
            slider.value = this.innerHTML;
        });
    });
});

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
}

renderCalendar();