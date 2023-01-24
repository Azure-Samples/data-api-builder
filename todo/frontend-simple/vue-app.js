const API = "/data-api/v1/todo";
var HEADERS = { 'Accept': 'application/json', 'Content-Type': 'application/json' };

// visibility filters
const filters = {
    all: function (todos) {
        return todos;
    },
    active: function (todos) {
        return todos.filter(function (todo) {
            return !todo.completed;
        });
    },
    completed: function (todos) {
        return todos.filter(function (todo) {
            return todo.completed;
        });
    }
};

// app Vue instance
var app = new Vue({
    // app initial state
    data: {
        todos: [],
        newTodo: "",
        editedTodo: null,
        visibility: "all",
        userId: null,
        userName: null
    },

    // initialize data 
    // by loading it from REST API
    created: function () {       
        this.getUserInfo().then( res => {
            this.loadTodos();        
        })        
    },

    // computed properties
    // http://vuejs.org/guide/computed.html
    computed: {
        filteredTodos: function () {
            return filters[this.visibility](this.todos);
        },
        remaining: function () {
            return filters.active(this.todos).length;
        },
        allDone: {
            get: function () {
                return this.remaining === 0;
            },
            set: function (value) {
                this.todos.forEach(function (todo) {
                    todo.completed = value;
                });
            }
        }
    },

    filters: {
        pluralize: function (n) {
            return n === 1 ? "item" : "items";
        }
    },

    methods: {
        getUserInfo: function() {
            return fetch('/.auth/me')
            .then(res => {
                return res.json();
            })
            .then(res => {
                const { clientPrincipal } = res;
                this.userId = clientPrincipal?.userId ?? null;
                this.userName = clientPrincipal?.userDetails ?? null;                
                // This is needed for now as SWA CLI is not yet able reverse proxy the  connection to DAB
                if (this.userId != undefined)
                    HEADERS["X-MS-CLIENT-PRINCIPAL"] = btoa(JSON.stringify(clientPrincipal));                
            });
        },

        loadTodos: function () {
            fetch(API, { headers: HEADERS, method: "GET" })
            .then(res => {
                return res.json();
            })
            .then(res => {
                this.todos = res == null ? [] : res.value;
            });        
        },

        addTodo: function () {
            var value = this.newTodo && this.newTodo.trim();
            if (!value) {
                return;
            }
            fetch(API, { headers: HEADERS, method: "POST", body: JSON.stringify({ title: value, owner_id: this.userId ?? "public" }) })
                .then(res => {
                    if (res.ok) {
                        this.newTodo = ''
                        return res.json();
                    }
                }).then(res => {
                    this.todos.push(res.value[0]);
                })
        },

        completeTodo: function (todo) {
            fetch(API + `/id/${todo.id}`, { headers: HEADERS, method: "PATCH", body: JSON.stringify({ completed: todo.completed }) });
        },

        completeAll: function () {
            this.todos.forEach(t => {
                this.completeTodo(t);
            })
        },

        removeTodo: function (todo) {
            var id = todo.id;
            fetch(API + `/id/${id}`, { headers: HEADERS, method: "DELETE" }).
                then(res => {
                    if (res.ok) {
                        var index = this.todos.indexOf(todo);
                        this.todos.splice(index, 1);
                    }
                })
        },

        editTodo: function (todo) {
            this.beforeEditCache = todo.title;
            this.editedTodo = todo;
        },

        doneEdit: function (todo) {
            if (!this.editedTodo) {
                return;
            }
            this.editedTodo = null;
            todo.title = todo.title.trim();
            if (!todo.title) {
                this.removeTodo(todo);
            } else {
                fetch(API + `/id/${todo.id}`, { headers: HEADERS, method: "PATCH", body: JSON.stringify({ title: todo.title }) });
            }
        },

        cancelEdit: function (todo) {
            this.editedTodo = null;
            todo.title = this.beforeEditCache;
        },

        removeCompleted: function () {
            filters.completed(this.todos).forEach(t => {
                this.removeTodo(t);
            });
        }
    },

    // a custom directive to wait for the DOM to be updated
    // before focusing on the input field.
    // http://vuejs.org/guide/custom-directive.html
    directives: {
        "todo-focus": function (el, binding) {
            if (binding.value) {
                el.focus();
            }
        }
    }
});

// mount Vue app
app.$mount("#vueapp");

// handle routing
function onHashChange() {
    var visibility = window.location.hash.replace(/#\/?/, "");
    if (filters[visibility]) {
        app.visibility = visibility;
    } else {
        window.location.hash = "";
        app.visibility = "all";
    }
}
window.addEventListener("hashchange", onHashChange);
onHashChange();

