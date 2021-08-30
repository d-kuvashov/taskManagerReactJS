import React from 'react';
import ReactDOM from 'react-dom';
//import data from './data.json';
import Cookies from 'universal-cookie';
import './index.css';
import xml_data from './xml_data.js';
import XMLParser from 'react-xml-parser';
let clickCount = 1;
let xml = new XMLParser().parseFromString(xml_data);
let firstInfo = [];
let data = [];
let a = 0;
firstInfo = xml.children;
while (firstInfo.length !== a) {
    data.push(firstInfo[a].attributes);
    a++;
}

function Time() {
    let date = new Date();
    let currentTime = [];
    let result = [];
    let dayOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let day = date.getDay()
    currentTime[0] = date.getHours();
    currentTime[1] = date.getMinutes();
    if (currentTime[1] < 10)
        currentTime[1] = '0' + currentTime[1];
    result[0] = dayOfTheWeek[day];
    result[1] = currentTime.join(':');
    return result;
}

function dynamicResize() {
    let cookies = new Cookies();
    let arrayOfData = [];
    let a = 0;
    while (cookies.get(JSON.stringify(a)) !== undefined) {
        arrayOfData.push(cookies.get(JSON.stringify(a)));
        a++;
    }
    let height = [];
    for (let i = 0; i < arrayOfData.length; i++) {
        let dateS = new Date(arrayOfData[i].dateStart)
        let dateF = new Date(arrayOfData[i].dateFinish)
        height[i] = dateF.getHours() - dateS.getHours();
        if (dateF.getMinutes() > 0)
            height[i]++;
    }
    for (let h = 0; h < 24; h++)
        document.getElementById('id' + h).style.paddingBottom = 1 + "px";
    for (let i = 0; i < arrayOfData.length; i++) {
        if (document.getElementById('task' + i).clientHeight > 18 * height[i]) {
            let dateS = new Date(arrayOfData[i].dateStart)
            let dateF = new Date(arrayOfData[i].dateFinish)
            let a = dateF.getHours() - dateS.getHours();
            let q = (document.getElementById('task' + i).clientHeight - 18 * height[i]) / a;
            for (let h = 0; h < 24; h++) {
                if (dateS.getHours() === h) {
                    for (let c = h; c < h + a; c++) {
                        document.getElementById('id' + c).style.paddingBottom = q + "px";
                    }
                }
            }
        }
        if (document.getElementById('task' + i).clientHeight === 18 * height[i]) {
            let dateS = new Date(arrayOfData[i].dateStart)
            let dateF = new Date(arrayOfData[i].dateFinish)
            let a = dateF.getHours() - dateS.getHours();
            for (let h = 0; h < 24; h++) {
                if (dateS.getHours() === h) {
                    for (let c = h; c < h + a; c++) {
                        document.getElementById('id' + c).style.paddingBottom = 1 + "px";
                    }
                }
            }
        }
    }
}

class FirstRowFirstColumn extends React.Component {
    constructor(props) {
        super(props);
        let currentTime = Time();
        this.state = {
            day: currentTime[0],
            time: currentTime[1]
        };
    }
    componentDidMount() {
        this.intervalID = setInterval(
            () => this.tick(),
            1000
        );
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    tick() {
        let currentTime = Time();
        this.setState({
            day: currentTime[0],
            time: currentTime[1]
        });
    }

    render() {
        return (
            <div>
                <ul><li>
                    {this.state.day}
                </li>
                    <li>
                        {this.state.time}
                    </li>
                </ul>
            </div>
        );
    }
}

class FirstRowThirdColumn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTask: "",
        }
    }
    componentDidMount() {
        this.intervalID = setInterval(() =>
            this.showCurrentTask(),
            30000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    showCurrentTask() {
        let cookies = new Cookies();
        let arrayOfData = [];
        let a = 0;
        while (cookies.get(JSON.stringify(a)) !== undefined) {
            arrayOfData.push(cookies.get(JSON.stringify(a)));
            a++;
        }
        let count = 0;
        let date, dateS, dateF;
        let title = [arrayOfData.length];
        let trueDay = [arrayOfData.length];
        let newHeight = [arrayOfData.length];
        let endMinute = [arrayOfData.length];
        let startHour = [arrayOfData.length + 1]; startHour[0] = 0;
        let endHour = [arrayOfData.length + 1]; endHour[0] = 0;
        let time = new Date();


        arrayOfData.forEach((data, i) => {
            date = new Date(data.dateStart);
            if (time.getDate() === date.getDate()
                && time.getMonth() === date.getMonth()
                && time.getYear() === date.getYear()) {
                trueDay[count] = i;
                count++;
            }
        });

        for (let i = 0; i < count; i++) {
            dateS = new Date(arrayOfData[trueDay[i]].dateStart);
            dateF = new Date(arrayOfData[trueDay[i]].dateFinish);
            title[trueDay[i]] = arrayOfData[trueDay[i]].title;
            startHour[trueDay[i] + 1] = dateS.getHours();
            endHour[trueDay[i] + 1] = dateF.getHours();
            newHeight[trueDay[i]] = endHour[trueDay[i] + 1] - startHour[trueDay[i] + 1];
        }
        if (endHour[count] === 23 && endMinute[count - 1] > 0)
            newHeight[count - 1] += 1;



        let hours = time.getHours();
        let fixLoop = "";
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < newHeight[trueDay[i]]; j++) {
                if (hours === startHour[trueDay[i] + 1] + j) {
                    fixLoop = title[trueDay[i]];
                }
            }
        }
        this.setState({ currentTask: fixLoop })
    }

    render() {
        this.timeoutID = setTimeout(() =>
            this.showCurrentTask(),
            10);
        return (
            <div>
                {this.state.currentTask}
            </div>
        );
    }
}

class SecondRowFirstColumn extends React.Component {
    render() {
        let time = [24];
        for (let i = 0; i < 24; i++) {
            time[i] = JSON.stringify(i);
            if (i < 10)
                time[i] = "0" + time[i];
            time[i] = time[i] + ":00";
        }
        return (
            <ul> {
                time.map((data, i) => {
                    let id = 'id' + i;
                    return (
                        <li id={id} key={i}>
                            {data}
                        </li>
                    );
                })
            }
            </ul>
        )
    }
}

class SecondRowSecondColumn extends React.Component {

    getData() {
        let cookies = new Cookies();
        let arrayOfData = [];
        let a = 0;
        if (cookies.get('0') === undefined) {
            for (let i = 0; i < data.length; i++) {
                cookies.set(JSON.stringify(i), JSON.stringify(data[i]), { path: '/' });
            }
        }


        while (cookies.get(JSON.stringify(a)) !== undefined) {
            arrayOfData.push(cookies.get(JSON.stringify(a)));
            a++;
        }


        let countNew = 0;
        let check1 = [];
        let check2 = [];
        for (let i = 0; i < data.length; i++) {
            for (let h = 0; h < arrayOfData.length; h++) {
                if (data[i].id === arrayOfData[h].id) {
                    check1[countNew] = i;
                    check2[countNew] = h;
                    countNew++;
                }
            }
        }
        if (countNew !== data.length) {
            for (let i = 0; i < data.length; i++) {
                if (check2[i] === undefined) {
                    cookies.set(JSON.stringify(arrayOfData.length), JSON.stringify(data[i]), { path: '/' });
                    arrayOfData.push(cookies.get(JSON.stringify(arrayOfData.length)));
                }
            }
        }

        let currentDate = new Date();

        let newArray = [];
        for (let i = 0; i < arrayOfData.length; i++) {
            let date = new Date(arrayOfData[i].dateStart);
            if (currentDate.getDate() !== date.getDate()
                || currentDate.getMonth() !== date.getMonth()
                || currentDate.getYear() !== date.getYear()) {
                cookies.remove(JSON.stringify(i), { path: '/' });
            } else {
                newArray.push(arrayOfData[i]);
                if (i === arrayOfData.length - 1)
                    for (let i = 0; i < newArray.length; i++) {
                        cookies.set(JSON.stringify(i), JSON.stringify(newArray[i]), { path: '/' });
                    }
            }
        }
        this.addEmptyCells();
    }

    addEmptyCells() {
        let taskCount = 0;
        let trueDay = [];
        let cookies = new Cookies();
        let arrayOfData = [];
        let a = 0;
        while (cookies.get(JSON.stringify(a)) !== undefined) {
            arrayOfData.push(cookies.get(JSON.stringify(a)));
            a++;
        }
        if (cookies.get('0') !== undefined) {
            for (let i = 0; i < arrayOfData.length; i++) {
                let time = new Date();
                let date = new Date(arrayOfData[i].dateStart);
                if (time.getDate() === date.getDate()
                    && time.getMonth() === date.getMonth()
                    && time.getYear() === date.getYear()) {
                    trueDay[taskCount] = i;
                    taskCount++;
                }
            }
            let startHour = [arrayOfData.length + 1]; startHour[0] = 0;
            let endHour = [arrayOfData.length + 1]; endHour[0] = 0;
            let endMinute = [arrayOfData.length];
            for (let i = 0; i < trueDay.length; i++) {
                let dateS = new Date(arrayOfData[trueDay[i]].dateStart);
                let dateF = new Date(arrayOfData[trueDay[i]].dateFinish);
                startHour[i + 1] = dateS.getHours();
                endHour[i + 1] = dateF.getHours();
                endMinute[i] = dateF.getMinutes();
                if (endMinute[i] > 0) {
                    endHour[i + 1]++;
                }
                let emptyCell = [startHour[i + 1] - endHour[i]];
                for (let h = 0; h < startHour[i + 1] - endHour[i]; h++) {
                    emptyCell[h] = "+";
                }
                arrayOfData[i]['before'] = emptyCell;
                if (i !== trueDay.length) {
                    arrayOfData[i]['after'] = emptyCell;
                }
            }

            if (endHour[taskCount] !== 23 || endMinute[taskCount - 1] !== 0) {
                let emptyCell = [24 - endHour[taskCount]];
                for (let h = 0; h < 24 - endHour[taskCount]; h++) {
                    emptyCell[h] = "+";
                }
                arrayOfData[taskCount - 1].after = emptyCell;
            }
            else {
                let emptyCell = [1];
                emptyCell[0] = ""
                arrayOfData[taskCount - 1]['after'] = emptyCell;
            }

            for (let i = 0; i < arrayOfData.length; i++) {
                cookies.remove(JSON.stringify(i), { path: '/' });
            }
            for (let i = 0; i < arrayOfData.length; i++) {
                cookies.set(JSON.stringify(i), JSON.stringify(arrayOfData[i]), { path: '/' });
            }

        } else {
            let emptyCell = [12];
            let emptyCell2 = [11];
            let niceTry = [1];
            niceTry[0] = { "id": '', "title": '', "dateStart": '', "dateFinish": '' };
            for (let h = 0; h < 11; h++) {
                emptyCell2[h] = "+";
            }
            niceTry[0]['before'] = emptyCell2;
            for (let h = 0; h < 12; h++) {
                emptyCell[h] = "+";
            }
            niceTry[0]['after'] = emptyCell;
            cookies.set('nothing', JSON.stringify(niceTry), { path: '/' });
        }
    }

    componentDidMount() {
        this.resize();
    }

    resize() {
        let cookies = new Cookies();
        let arrayOfData = [];
        let a = 0;
        while (cookies.get(JSON.stringify(a)) !== undefined) {
            arrayOfData.push(cookies.get(JSON.stringify(a)));
            a++;
        }
        if (cookies.get('0') !== undefined) {
            let height = [];
            for (let i = 0; i < arrayOfData.length; i++) {
                let dateS = new Date(arrayOfData[i].dateStart)
                let dateF = new Date(arrayOfData[i].dateFinish)
                height[i] = dateF.getHours() - dateS.getHours();
                if (dateF.getMinutes() > 0)
                    height[i]++;
            }
            for (let i = 0; i < arrayOfData.length; i++) {
                document.getElementById('task' + i).style.lineHeight = 18 * height[i] - 1 + "px";
                document.getElementById('task' + i).style.minHeight = 18 * height[i] - 1 + "px";
            }
            let padding = 18;
            for (let i = 0; i < 24; i++) {
                document.getElementById('id' + i).style.paddingTop = (padding - 16) / 2 + "px";
            }


        }
    }

    render() {
        const data = this.props.refresh;
        this.getData();
        this.timeoutID = setTimeout(() => { this.resize() }, 200);
        let cookies = new Cookies();
        let arrayOfData = [];
        let a = 0;

        if (cookies.get('0') !== undefined) {
            while (cookies.get(JSON.stringify(a)) !== undefined) {
                arrayOfData.push(cookies.get(JSON.stringify(a)));
                a++;
            }
        } else
            arrayOfData = cookies.get('nothing');
        let id = [arrayOfData.length];
        for (let i = 0; i < arrayOfData.length; i++) {
            id[i] = 'task' + i;
        }
        console.log(arrayOfData);
        let listOfTasks = [];
        let w = 0;
        for (let i = 0; i < arrayOfData.length; i++) {
            for (let h = 0; h < arrayOfData[i].before.length; h++) {
                if (arrayOfData[i].before[0] !== 0) {
                    listOfTasks[w] = "";
                }
                w++;
            }
            listOfTasks[w] = arrayOfData[i].title;
            id[w] = 'task' + i;
            w++;

        }
        for (let h = 0; h < arrayOfData[arrayOfData.length - 1].after.length; h++) {
            if (arrayOfData[arrayOfData.length - 1].after[0] !== 0) {
                listOfTasks[w] = "";
            }
            w++;
        }
        return (
            <ul className="list">
                {
                    listOfTasks.map((row, i) => {
                        if (row === '') {
                            return (
                                <li className="emptyLiId" id='emptyLiId' key={i}> {row} </li>
                            )
                        } else {
                            if (row !== 0)
                                return (
                                    <li className="notEmptyLi" id={id[i]} key={i}> {row} </li>
                                )
                        }
                    }
                    )
                }
            </ul>
        )
    }

}

class AddNewTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh: true
        };
        this.increaseArray = this.increaseArray.bind(this);
    }

    increaseArray() {
        let text = "";
        let newTaskTimeS;
        let newTaskTimeF;
        let runCode = true;
        let newTaskDateS = new Date();
        let newTaskDateF = new Date();

        //Считывание информации
        text = document.getElementById('newTask').value;
        newTaskTimeS = document.getElementById('startTime').value;
        newTaskTimeF = document.getElementById('endTime').value;

        //Проверка на пустое поле
        if (newTaskTimeS === '' || newTaskTimeF === '' || text === '') {
            alert("Empty!");
            runCode = false;
        }

        //Разбиение времени
        let hourNewTaskS = [], hourNewTaskF = [];
        let minuteNewTaskS = [], minuteNewTaskF = [];
        for (let i = 0; i < 2; i++) {
            hourNewTaskS[i] = newTaskTimeS[i];
            hourNewTaskF[i] = newTaskTimeF[i];
            minuteNewTaskS[i + 3] = newTaskTimeS[i + 3];
            minuteNewTaskF[i + 3] = newTaskTimeF[i + 3];
        }

        //Изменение времени
        newTaskDateS.setHours(hourNewTaskS.join(''));
        newTaskDateS.setMinutes(minuteNewTaskS.join(''));
        newTaskDateF.setHours(hourNewTaskF.join(''));
        newTaskDateF.setMinutes(minuteNewTaskF.join(''));


        let cookies = new Cookies();
        let arrayOfData = [];
        let a = 0;
        while (cookies.get(JSON.stringify(a)) !== undefined) {
            arrayOfData.push(cookies.get(JSON.stringify(a)));
            a++;
        }


        for (var i = 0; i < arrayOfData.length; i++) {
            let checkTimeS = new Date(arrayOfData[i].dateStart);
            let checkTimeF = new Date(arrayOfData[i].dateFinish);
            if (checkTimeS.getHours() === newTaskDateS.getHours()) {
                alert("Choose another time!");
                runCode = false;
            }

            if (newTaskDateF.getHours() === checkTimeS.getHours() &&
                newTaskDateF.getMinutes() >= 1 && runCode === true) {
                alert("Choose another time!");
                runCode = false;
            }

            if (newTaskDateS.getHours() === checkTimeF.getHours()
                && checkTimeF.getMinutes() > 0
                && runCode === true) {
                alert("Choose another time!");
                runCode = false;
            }

            if (newTaskDateF.getHours() === checkTimeS.getHours() &&
                newTaskDateF.getMinutes() >= 1 && runCode === true) {
                alert("Choose another time!");
                runCode = false;
            }

            let checkLengthH = 0, checkLengthM = 0;
            checkLengthH = newTaskDateF.getHours() - newTaskDateS.getHours();
            checkLengthM = newTaskDateF.getMinutes() - newTaskDateS.getMinutes();

            if (checkLengthH < 0 && runCode === true) {
                alert("Wrong!");
                runCode = false;
            }

            if (checkLengthH === 0 && runCode === true && checkLengthM === 0) {
                alert("Wrong!");
                runCode = false;
            }

            for (let h = 0; h < checkLengthH; h++) {
                if (newTaskDateS.getHours() + h === checkTimeS.getHours()
                    && runCode === true) {
                    alert("Choose another time!");
                    runCode = false;
                }
            }

            checkLengthH = checkTimeF.getHours() - checkTimeS.getHours();/////////////////
            for (let h = 0; h < checkLengthH; h++) {
                if (checkTimeS.getHours() + h === newTaskDateS.getHours()
                    && runCode === true) {
                    alert("Choose another time!");
                    runCode = false;
                }
            }
            for (let h = 0; h < checkLengthH; h++) {
                if (newTaskDateF.getHours() === checkTimeF.getHours()
                    && checkTimeF.getMinutes() > 0
                    && runCode === true) {
                    alert("Choose another time!");
                    runCode = false;
                }
            }
        }


        if (runCode) {
            let newTask = { "id": this.makeId(), "title": text, "dateStart": newTaskDateS.toString(), "dateFinish": newTaskDateF.toString() };
            arrayOfData.push(newTask);
            this.showNewTask(arrayOfData);
        }

    }

    makeId() {
        let result = '';
        let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        result += '-';
        for (let i = 0; i < 4; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        result += '-';
        for (let i = 0; i < 4; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        result += '-';
        for (let i = 0; i < 4; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        result += '-';
        for (let i = 0; i < 12; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    showNewTask(arrayOfData) {
        let order = [];
        let rightOrder = [];
        for (let i = 0; i < arrayOfData.length; i++) {
            order[i] = new Date(arrayOfData[i].dateStart);
            rightOrder[i] = order[i].getHours();
        }
        let help;
        for (let j = 0; j < arrayOfData.length; j++)
            for (let i = 1; i < arrayOfData.length; i++) {
                if (rightOrder[i - 1] > rightOrder[i]) {
                    help = rightOrder[i - 1];
                    rightOrder[i - 1] = rightOrder[i];
                    rightOrder[i] = help;
                }
            }
        let data = [];
        for (let j = 0; j < arrayOfData.length; j++)
            for (let i = 0; i < arrayOfData.length; i++) {
                order[i] = new Date(arrayOfData[i].dateStart);
                if (rightOrder[j] === order[i].getHours()) {
                    data.push(arrayOfData[i]);
                }
            }

        clickCount++;
        let button = document.getElementById('cancelButtonId');
        let form = document.getElementById('NewTaskId');
        if (clickCount % 2 === 1) {
            form.style.display = "none";
            button.value = "Add";
            button.style.backgroundColor = "#FEC63D";
            document.getElementById('newTask').value = "";
            document.getElementById('startTime').value = "";
            document.getElementById('endTime').value = "";
        }


        const cookies = new Cookies();
        for (let i = 0; i < arrayOfData.length; i++) {
            cookies.set(JSON.stringify(i), JSON.stringify(data[i]), { path: '/' });
        }
        this.props.updateData(this.state.refresh)
    }

    render() {
        return (
            <form className="AddNewTaskClass" id="AddNewTaskId">
                <input className="newTitle" type="text" id="newTask" />
                <div className="text">Start:</div>
                <input className="startTime" type="time" id="startTime" name="time" />
                <div className="text" >End: </div>
                <input className="endTime" type="time" id="endTime" name="time" />
                <button type="button" className="Add" onClick={this.increaseArray}>Add </button>
            </form>
        )
    }
}

class TwoButtons extends React.Component {
    constructor(props) {
        super(props)
        this.hideForm = this.hideForm.bind(this);
    }
    hideForm() {
        clickCount++;
        let button = document.getElementById('cancelButtonId');
        let form = document.getElementById('NewTaskId');
        if (clickCount % 2 === 1) {
            form.style.display = "none";
            button.value = "Add";
            button.style.backgroundColor = "#FEC63D";
        } else {
            form.style.display = "grid";
            button.value = "Cancel";
            button.style.backgroundColor = "#FF0000";
        }
    }
    render() {
        return (
            <form className="TwoButtonsClass">
                <button type="button" className="StartButtonClass" id="startButtonId">Start</button>
                <input type="button" className="NewOne" onClick={this.hideForm} id="cancelButtonId" value="Add" />
            </form>
        )
    }
}

class Parent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh: false
        }
    }

    updateData = (value) => {
        this.setState({ refresh: value })
    }
    componentDidMount() {
        this.intervalID = setInterval(
            () => dynamicResize(),
            100
        );
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    render() {
        const data = this.state.refresh;
        return (
            <div className="whatsUp">
                <header className="Header"> Timetable</header>
                <div className="FirstRowFirstColumnClass" id="FirstRowFirstColumnId"><FirstRowFirstColumn /></div>
                <div className="FirstRowSecondColumnClass">
                    <ul>
                        <li>Aggregate</li>
                        <li>Machine</li>
                        <li>Unit</li>
                    </ul>
                </div>
                <div className="FirstRowThirdColumnClass" id="FirstRowThirdColumnId"><FirstRowThirdColumn /></div>
                <div className="SecondRowFirstColumnClass"><SecondRowFirstColumn /></div>
                <div className="SecondRowSecondColumnClass" id="SecondRowSecondColumnId"><SecondRowSecondColumn refresh={data} /></div>
                <div className="NewTaskClass" id="NewTaskId"><AddNewTask updateData={this.updateData} /></div>
                <div className="TwoButtons" id="TwoButtonsId"><TwoButtons /></div>
            </div>
        )
    }
}

ReactDOM.render(
    <Parent />,
    document.getElementById('parent'),
);  
