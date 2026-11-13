let subjects =
JSON.parse(localStorage.getItem("subjects_v2")) || [];

let currentSubject = null;

/* ---------- SAVE ---------- */

function saveData(){
    localStorage.setItem(
        "subjects_v2",
        JSON.stringify(subjects)
    );
}

/* ---------- THEME ---------- */

const themeBtn =
document.getElementById("themeToggle");

const savedTheme =
localStorage.getItem("theme");

if(savedTheme === "light"){
    document.body.classList.add("light");
    themeBtn.textContent = "☀";
}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("light");

    const isLight =
    document.body.classList.contains("light");

    themeBtn.textContent =
    isLight ? "☀" : "🌙";

    localStorage.setItem(
        "theme",
        isLight ? "light" : "dark"
    );
});

/* ---------- STATS ---------- */

function updateStats(){

    document.getElementById(
        "totalSubjects"
    ).textContent = subjects.length;

    document.getElementById(
        "completedTopics"
    ).textContent = 0;

    document.getElementById(
        "progressPercent"
    ).textContent = "0%";
}

/* ---------- SUBJECTS ---------- */

function renderSubjects(){

    const list =
    document.getElementById("subjectList");

    list.innerHTML = "";

    subjects.forEach((subject,index)=>{

        const div =
        document.createElement("div");

        div.className = "subject-item";

        div.innerHTML = `
            <span>${subject.name}</span>

            <div style="float:right">

                <button
                    onclick="renameSubject(${index})"
                >
                    ✏
                </button>

                <button
                    onclick="deleteSubject(${index})"
                >
                    🗑
                </button>

            </div>
        `;

        div.onclick = ()=>{
            openSubject(index);
        };

        list.appendChild(div);

    });

    updateStats();
}

/* ---------- ADD ---------- */

document
.getElementById("addSubjectBtn")
.addEventListener("click",()=>{

    const name =
    prompt("Subject Name");

    if(!name) return;

    subjects.push({
        name:name,
        modules:[]
    });

    saveData();
    renderSubjects();

});

/* ---------- DELETE ---------- */

function deleteSubject(index){

    event.stopPropagation();

    if(!confirm("Delete Subject?"))
    return;

    subjects.splice(index,1);

    saveData();
    renderSubjects();
}

/* ---------- RENAME ---------- */

function renameSubject(index){

    event.stopPropagation();

    const newName =
    prompt(
        "Rename Subject",
        subjects[index].name
    );

    if(!newName) return;

    subjects[index].name = newName;

    saveData();
    renderSubjects();
}

/* ---------- OPEN ---------- */

function openSubject(index){

    currentSubject = index;

    document
    .getElementById("workspace")
    .innerHTML = `
        <h2>${subjects[index].name}</h2>

        <br>

        <button id="addModuleBtn">
            + Add Module
        </button>

        <br><br>

        <div id="moduleArea"></div>
    `;

    document
    .getElementById("addModuleBtn")
    .addEventListener("click",addModule);

    renderModules();
}
function addModule(){

    const name =
    prompt("Module Name");

    if(!name) return;

    subjects[currentSubject]
    .modules.push({
        name:name,
        topics:[]
    });

    saveData();

    renderModules();
}


function renderModules(){

    const area =
    document.getElementById("moduleArea");

    if(!area) return;

    area.innerHTML = "";

    subjects[currentSubject]
    .modules
    .forEach((module,index)=>{

        let topicsHTML = "";

       
module.topics.forEach(topic=>{

    topicsHTML += `
        <div
            style="
                margin-left:30px;
                margin-top:8px;
                padding:10px;
                border-left:2px solid #3b82f6;
            "
        >

            📖 ${topic.name}

            <button
                onclick="addSubtopic(${index},'${topic.name}')"
                style="float:right"
            >
                + Subtopic
            </button>

            <button
                onclick="toggleTimer(${index},'${topic.name}')"
                style="float:right;margin-right:5px;"
            >
                ⏱ Timer
                <button
onclick="renameTopic(${index},'${topic.name}')"
>
✏
</button>

<button
onclick="deleteTopic(${index},'${topic.name}')"
>
🗑
</button>
            </button>

            ${
            topic.timerVisible
            ?
            `
            <div
            style="
                margin-top:10px;
                padding:10px;
                background:#0f172a;
                border-radius:10px;
            ">

                ${formatTime(topic.remainingTime)}
                <input
                    type="number"
                    value="${topic.remainingTime/60}"
                    id="time-${index}-${topic.name}"
                    style="width:70px;"
                >

                <button
                    onclick="
                    setTopicTime(
                    ${index},
                    '${topic.name}'
                )
            "
            >
            Set Time
            </button>

                <br><br>

                <button onclick="startTopicTimer(${index},'${topic.name}')">
                    ▶ Start
                </button>

                <button onclick="pauseTopicTimer(${index},'${topic.name}')">
                    ⏸ Pause
                </button>

                <button onclick="resetTopicTimer(${index},'${topic.name}')">
                    ⏹ Reset
                </button>

            </div>
            `
            :
            ""
            }

            ${topic.subtopics.map(s=>`
                <div
                style="
                    margin-left:25px;
                    margin-top:5px;
                ">
                    🔹 ${s}
                </div>
            `).join("")}

        </div>
    `;
});


        area.innerHTML += `
            <div
                style="
                    background:var(--card);
                    padding:15px;
                    border-radius:12px;
                    margin-bottom:10px;
                "
            >

                📚 ${module.name}

                <button
                    onclick="addTopic(${index})"
                    style="float:right"
                >
                    + Topic
                </button>

                ${topicsHTML}

            </div>
        `;
    });
}



            
function addTopic(moduleIndex){

    const topic =
    prompt("Topic Name");
    const minutes =
    prompt("Set timer in minutes");

    if(!minutes) return;
    const minutes =
prompt("Study Time (minutes)");

if(!minutes) return;

    if(!topic) return;

    subjects[currentSubject]
    .modules[moduleIndex]
    .topics.push({

        name: topic,

        completed: false,

        expanded: true,

       timer: minutes * 60,
       remainingTime: minutes * 60,
        timerRunning: false,
        timerVisible: false,

        subtopics: []

    });

    saveData();

    renderModules();
}
function addSubtopic(moduleIndex,topicName){

    const subtopic =
    prompt("Subtopic Name");

    if(!subtopic) return;

    const topic =
    subjects[currentSubject]
    .modules[moduleIndex]
    .topics.find(
        t => t.name === topicName
    );

    topic.subtopics.push(subtopic);

    saveData();

    renderModules();
}
function formatTime(seconds){

    const mins =
    Math.floor(seconds/60);

    const secs =
    seconds%60;

    return `${mins}:${
        secs.toString().padStart(2,"0")
    }`;
}

function toggleTimer(moduleIndex,topicName){

    const topic =
    subjects[currentSubject]
    .modules[moduleIndex]
    .topics.find(
        t=>t.name===topicName
    );

    topic.timerVisible =
    !topic.timerVisible;

    saveData();

    renderModules();
}

function startTopicTimer(
moduleIndex,
topicName
){

    const topic =
    subjects[currentSubject]
    .modules[moduleIndex]
    .topics.find(
        t=>t.name===topicName
    );

    if(topic.timerRunning)
    return;

    topic.timerRunning = true;

    topic.interval =
    setInterval(()=>{

        if(topic.remainingTime > 0){

            topic.remainingTime--;

            renderModules();

        }else{

            clearInterval(
                topic.interval
            );

            topic.timerRunning =
            false;

            alert(
                `🔔 ${topic.name} completed!`
            );
        }

    },1000);
}

function pauseTopicTimer(
moduleIndex,
topicName
){

    const topic =
    subjects[currentSubject]
    .modules[moduleIndex]
    .topics.find(
        t=>t.name===topicName
    );

    clearInterval(
        topic.interval
    );

    topic.timerRunning =
    false;
}

function resetTopicTimer(
moduleIndex,
topicName
){

    const topic =
    subjects[currentSubject]
    .modules[moduleIndex]
    .topics.find(
        t=>t.name===topicName
    );

    clearInterval(
        topic.interval
    );

    topic.remainingTime =
    topic.timer;

    topic.timerRunning =
    false;

    renderModules();
}

function renameTopic(
moduleIndex,
topicName
){

    const topic =
    subjects[currentSubject]
    .modules[moduleIndex]
    .topics.find(
        t=>t.name===topicName
    );

    const newName =
    prompt(
        "Rename Topic",
        topic.name
    );

    if(!newName) return;

    topic.name = newName;

    saveData();

    renderModules();
}
function deleteTopic(
moduleIndex,
topicName
){

    const topics =
    subjects[currentSubject]
    .modules[moduleIndex]
    .topics;

    const index =
    topics.findIndex(
        t=>t.name===topicName
    );

    if(index === -1) return;

    if(!confirm(
        "Delete Topic?"
    )) return;

    topics.splice(index,1);

    saveData();

    renderModules();
}
function setTopicTime(
moduleIndex,
topicName
){

    const topic =
    subjects[currentSubject]
    .modules[moduleIndex]
    .topics.find(
        t=>t.name===topicName
    );

    const mins =
    document.getElementById(
        `time-${moduleIndex}-${topicName}`
    ).value;

    topic.timer =
    Number(mins) * 60;

    topic.remainingTime =
    Number(mins) * 60;

    saveData();

    renderModules();
}
