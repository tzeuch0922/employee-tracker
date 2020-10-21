const mysql = require('mysql2');
const cTable = require('console.table');

require('dotenv').config();

const connection = mysql.createConnection(
{
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: 'employees' 
});

function displayDepartments(menu)
{
    connection.query('SELECT id, name AS department FROM department', function(err, results)
    {
        console.table(results);
        menu();
    });
}

function displayRoles(menu)
{
    connection.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id', function(err, results)
    {
        console.table(results);
        menu();
    });
}

function displayEmployees(menu)
{
    connection.query('SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id', function(err, results)
    {
        console.table(results);
        menu();
    });
}

function getRoles()
{
    return 'SELECT title FROM role';
}

function getDepartments()
{
    return 'SELECT name FROM department';
}

function getEmployees()
{
    return 'SELECT CONCAT(first_name, " ", last_name) AS name FROM employee';
}

function getRoleId()
{
    return 'SELECT id FROM role WHERE title = ?';
}

function getDepartmentId()
{
    return 'SELECT id FROM department WHERE name = ?';
}

function getEmployeeId()
{
    return 'SELECT id FROM employee WHERE first_name = ? AND last_name = ?';
}

function addDepartment(name, menu)
{
    connection.execute('INSERT INTO department (name) VALUE (?)', [name], function(err, results)
    {
        if(err)
        {
            console.log(err);
        }
        menu();
    });
}

async function addRole(title, salary, department, menu)
{
    department = await query(getDepartmentId(), department);
    connection.execute('INSERT INTO role (title, salary, department_id) VALUE (?, ?, ?)', [title, salary, department[0].id], function(err, results)
    {
        if(err)
        {
            console.log(err);
        }
        menu();
    });
}

async function updateRole(name, role, menu)
{
    employee = await query(getEmployeeId(),name.split(" "));
    role = await query(getRoleId(),[role]);
    employee = employee[0].id;
    role = role[0].id;
    connection.execute('UPDATE employee SET role_id = ? WHERE id = ?', [role, employee], (err, results) =>
    {
        if(err)
        {
            throw(err);
        }
        menu();
    });
}

async function addEmployee(first_name, last_name, role, manager, menu)
{
    role = await query(getRoleId(), [role]);
    role = role[0].id;
    if(manager === "none")
    {
        manager = NULL;
    }
    else
    {
        manager = await query(getEmployeeId(), manager.split(" "));
        manager = manager[0].id;
    }
    connection.execute('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE (?, ?, ?, ?)', [first_name, last_name, role, manager], function(err, results)
    {
        if(err)
        {
            console.log(err);
        }
        menu();
    });
}

function endConnection()
{
    connection.end();
}

function query(sqlQuery, params = [])
{
    return new Promise((resolve, reject) =>
    {
        connection.query(sqlQuery, params, (err, results) =>
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(results);
            }
        });
    });
}

module.exports = {
    displayDepartments,
    displayEmployees,
    displayRoles,
    addDepartment,
    addEmployee,
    addRole,
    updateRole,
    getDepartmentId,
    getDepartments,
    getEmployeeId,
    getEmployees,
    getRoleId,
    getRoles,
    query,
    endConnection
};