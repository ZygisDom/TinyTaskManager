$(document).ready(function() {
    let task = [];
    let key = 'tasks';
    let newArrival = loadUp(key);

    function storingLocallyCheck(type) {
        try {
            let storeLocally, x;
            storeLocally = window[type];
            x = '__storage_test__';
            storeLocally.setItem(x, x);
            storeLocally.removeItem(x);
            return true;
        } catch (e) {
            return false;
        }
    }

    function loadUp(key) {
        let newArrival = true;
        if (!storingLocallyCheck('localStorage')) {
            $('main').before(`<p class="text-center alert-danger alert">Local storage is not supported</p>`);
            $('main').hide();
            $('#tasksection').hide();
        } else {
            if (!localStorage.getItem(key)) {

                newArrival = true;
                $('main').before(`<h5 class="text-center alert alert-danger " id="newArrival">Seems like your list is empty. Try adding a task</h5>`);
                $('#tasksection').hide();
                $('#viewlist').hide();
                $("#notification-block").hide();
            } else {
                newArrival = false;
                $('main').hide();
                task = JSON.parse(localStorage.getItem(key));
                getTasks();
                showTaskTotal();
                $("#notification-block").show();
                $('#viewlist').show();
            }
        }
        return newArrival;
    }

    function getTasks() {
        let appendingDiv = "";
        for (let i = 0; i < task.length; i++) {
            let {name: taskName, description: taskDescription, date: datepicker} = task[i],
                appendPriority = setImportance(task[i].priority), taskDiv =
                    `<div class="task-item d-flex justify-content-between align-items-center">
                    <div class="panel-body">
                        <p class="name-desc text-break">Task: ${taskName}</br>Description: ${taskDescription}</p>
                        <span class="label">Task Priority: ${appendPriority}</span> 
                        <p class="deadline">Due Date: ${datepicker}</p>
                    </div>
                    <div class="panel-footer">
                        <span class="checkbox floater">
                        <label class="remove-label d-flex align-items-center">
                            <input type="checkbox" name="removeThis" value="${i}" class="mr-2">
                            <p class="remove-checkbox m-0">Remove</p>
                        </label>
                        </span>
                    </div>
                </div>`;
            appendingDiv += taskDiv;
        }
        $(`#tasksection`).show();
        $('#tasklist').html("").append(appendingDiv);
        showTaskTotal();
    }

    function setImportance(priority) {
        let importance;
        switch (priority) {
            case "1":
                importance = "Low";
                break;
            case "2":
                importance = "Medium";
                break;
            case "3":
                importance = "High";
                break;
            default:
                importance = "Medium";
        }
        return importance;
    }

    function getNewTaskData() {
        let createTask = $('#taskname').val();
        let createDescription = $('#description').val();
        let createDate = $('#datepicker').val();
        let createPriority = $('#priority').val();

        let taskName = {};
        taskName.name = createTask;
        taskName.description = createDescription;
        taskName.date = createDate;
        taskName.priority = createPriority;

        $('#taskname').val("");
        $('#datepicker').val("");
        $('#description').val("");
        $('#priority').val(2);

        task.push(taskName);

        localStorage.setItem(key, JSON.stringify(task));

        $('#tasksection').show();
        getTasks();
    }

    function showTaskTotal() {
        let taskTotal = JSON.parse(localStorage["tasks"]).length;
        $('#task-count').html("Tasks in total: " + taskTotal);
    }

    function handleCheckboxes() {
        let i = [];
        $('input[type=checkbox]').each(function() {
            if (this.checked) {
                i.push($(this).val());
            }
        });
        i.sort(function(start, end) {
            return start - end;
        });
        return i;
    }

    function currentDateNotification() {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;

        let matchedDates = task.filter(item => item.date === today);

        new Notification("Tasks due today", {
            body: `You currently have ${matchedDates.length} tasks that are due today`,
            icon: './images/logo.png'
        });
    }

    function visualAlert() {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();
        let appendingDiv = "";

        today = yyyy + '-' + mm + '-' + dd;

        let matchedDates = task.filter(item => item.date === today);

        let visualAppend =
            `<div id="visual-notification" class="alert alert-danger" role="alert">
                <button type="button" class="close" id="close-visual">×</button>
                <p class="text-break m-0">You currently have ${matchedDates.length} tasks that are due today</p>
            </div>`

        appendingDiv += visualAppend;
        $('#notification-block').html("").append(appendingDiv);

        $('#close-visual').click(function(e) {
            location.reload();
        })
    }

    $('main').submit(function(e) {
        if (!newArrival) {
        } else {
            newArrival = false;
            $('#firstTimeAlert').hide();
        }
        $('#tasksection').show();
        getNewTaskData();
        $('main').hide();
    });

    $('#viewlist').click(function(e) {
        e.preventDefault();
        $('#tasksection').show();
        $('#body-main').hide();
        getTasks();
    });

    $('#add-task-menu').click(function(e) {
        e.preventDefault();
        $('#body-main').show();
        $('main').show()
        $('#tasksection').hide();
        $(document).scrollTop($(document).height());
    });

    $('.removeSelected').click(function(e) {
        e.preventDefault();
        let checkboxIndex = handleCheckboxes();
        while (checkboxIndex.length > 0) {
            let i=checkboxIndex.pop();
            task.splice(i, 1);
        }
        localStorage.setItem(key, JSON.stringify(task));
        if (JSON.parse(localStorage["tasks"]).length === 0) {
            localStorage.clear();
            location.reload();
        }
        $('#tasksection').hide();
        getTasks();
    });

    $('#btn-sort-importance').click(function(e) {
        e.preventDefault();
        task.sort((start, end) => end.priority - start.priority);
        getTasks();
    });

    $('#btn-sort-due').click(function(e) {
        e.preventDefault();
        task.sort((start, end) => new Date(start.date) - new Date(end.date));
        getTasks();
    });

    $('#delete-all-tasks').click(function(e) {
        localStorage.clear();
    });

    function showNotification() {
        currentDateNotification();
    }

    $('#get-todays-tasks-desktop').click(function(e) {
        if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    showNotification();
                }
            })
        }
    });

    $('#get-todays-tasks-audio').click(function(e) {
        let insight = new Audio('./sounds/Insight.mp3');
        insight.play();
    });

    $('#get-todays-tasks-visual').click(function(e) {
        visualAlert();
    });

    $('#get-todays-tasks-custom').click(function(e) {
        let insight = new Audio('./sounds/Insight.mp3');
        insight.play();
        visualAlert();
    });

    setTimeout(function(){
        alert("You've been working for an hour straight, consider taking a five minute break to stretch and move around");
        },
        60000);

});
