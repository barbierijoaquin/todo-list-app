class Task{
    constructor(name, priority, category, startDate, endDate){
        this.name = name;
        this.priority = priority;
        this.category = category;
        this.startDate = startDate;
        this.endDate = endDate;
        this.completed = false;
        this.subtasks = [];
    }
    toggleCompleted(){
        this.completed = !this.completed;
    }
}

