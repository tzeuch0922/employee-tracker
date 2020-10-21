const inquirer = require('inquirer');
const query = require('./queries.js');

// Intro
console.log('//////////////////////////////////////////////////////////////////');
console.log('//////////                                              //////////');
console.log('//////////                                              //////////');
console.log('//////////               EMPLOYEE TRACKER               //////////');
console.log('//////////                                              //////////');
console.log('//////////                                              //////////');
console.log('//////////////////////////////////////////////////////////////////');

function mainMenu()
{
    inquirer.prompt(
    {
        name: "main",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Done"
        ]
    })
    .then((answer) =>
    {
        switch(answer.main)
        {
            case "View all departments":
                displayDepartments();
                break;
            case "View all roles":
                displayRoles();
                break;
            case "View all employees":
                displayEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee role":
                updateRole();
                break;
            case "Done":
                query.endConnection();
                break;
        }
    });
}

function displayDepartments()
{
    query.displayDepartments(mainMenu);
}

function displayRoles()
{
    query.displayRoles(mainMenu);
}

function displayEmployees()
{
    query.displayEmployees(mainMenu);
}

function addDepartment()
{
    inquirer.prompt(
    {
        name: 'department',
        type: 'input',
        message: 'What is the name of the department?',
        validate: function(value)
        {
            if(value)
            {
                return true;
            }
            return 'Please enter the name of the department.';
        }
    })
    .then((answer) =>
    {
        query.addDepartment(answer.department, mainMenu);
    })
}

async function addRole()
{
    let departments = await query.query(query.getDepartments());
    let names = [];
    departments.forEach(({name}) => 
    {
        names.push(name);
    });
    inquirer.prompt(
    [
        {
            name: 'role',
            type: 'input',
            message: 'What is the name of the role?',
            validate: function(value)
            {
                if(value)
                {
                    return true;
                }
                return 'Please enter the name of the role.';
            }
        },
        {
            name: 'salary',
            type: 'number',
            message: 'What is the salary for this role?',
            validate: function(value)
            {
                if(value)
                {
                    return true;
                }
                return 'Please enter a valid salary.';
            }
        },
        {
            name: 'department',
            type: 'list',
            message: 'Which department should this role be listed under?',
            choices: names
        }
    ])
    .then((answer) =>
    {
        query.addRole(answer.role, answer.salary, answer.department, mainMenu);
    })
}

async function addEmployee()
{
    let roles = await query.query(query.getRoles());
    let employees = await query.query(query.getEmployees());
    let roleList = [];
    let managerList = [];
    roles.forEach(({title}) => 
    {
        roleList.push(title);
    });
    employees.forEach(({name}) =>
    {
        managerList.push(name);
    });
    managerList.push('none');
    inquirer.prompt(
    [
        {
            name: 'first_name',
            type: 'input',
            message: "What is the employee's first name?",
            validate: function(value)
            {
                if(value)
                {
                    return true;
                }
                return "Please enter the employee's first name.";
            }
        },
        {
            name: 'last_name',
            type: 'input',
            message: "What is the employee's last name?",
            validate: function(value)
            {
                if(value)
                {
                    return true;
                }
                return "Please enter the employee's last name.";
            }
        },
        {
            name: 'role',
            type: 'list',
            message: "What is the employee's title?",
            choices: roleList
        },
        {
            name: 'manager',
            type: 'list',
            message: "Who is the employee's manager?",
            choices: managerList
        }
    ])
    .then((answer) =>
    {
        query.addEmployee(answer.first_name, answer.last_name, answer.role, answer.manager, mainMenu);
    })
}

async function updateRole()
{
    let roles = await query.query(query.getRoles());
    let employees = await query.query(query.getEmployees());
    let roleList = [];
    let employeeList = [];
    roles.forEach(({title}) =>
    {
        roleList.push(title);
    });
    employees.forEach(({name}) =>
    {
        employeeList.push(name);
    });
    inquirer.prompt(
    [
        {
            name: "employee",
            type: "list",
            message: "Which employee needs their role updated?",
            choices: employeeList
        },
        {
            name: "role",
            type: "list",
            message: "What is the employee's new title?",
            choices: roleList
        }
    ])
    .then((answer) =>
    {
        query.updateRole(answer.employee, answer.role, mainMenu);
    });
}

mainMenu();
// setTimeout(mainMenu(), 2000);