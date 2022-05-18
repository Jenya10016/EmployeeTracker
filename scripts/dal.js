const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employee_tracker',
    password: '!Password1'
});

function getAllEmployees(cb) {
    const sql = `SELECT e.id AS "Id",
                    e.first_name AS "First Name",
                    e.last_name AS "Last Name", 
                    r.title AS "Job Title",
                    d.name AS "Department", 
                    r.salary AS "Salary",
                    IFNULL(CONCAT(m.first_name, ' ', m.last_name), '')  AS "Manager"
                FROM employee AS e
                LEFT JOIN employee AS m ON e.manager_id = m.id
                LEFT JOIN role AS r ON e.role_id = r.id
                LEFT JOIN department AS d ON r.department_id = d.id`;

    connection.query(sql, function(err, results) {
        cb(results);
    });
}

function getEmployeesRoles(cb) {
    const sql = `SELECT e.id,
                    e.first_name,
                    e.last_name, 
                    r.title AS role
                FROM employee AS e
                LEFT JOIN role AS r ON e.role_id = r.id`;

    connection.query(sql, function(err, results) {
        cb(results);
    });
}

function getManagers(cb) {
    const sql = `SELECT e.id AS "Id",
                    CONCAT(e.first_name, ' ', e.last_name) AS Name, 
                    r.title AS "Job Title",
                    d.name AS "Department"
                FROM employee AS e
                LEFT JOIN role AS r ON e.role_id = r.id
                LEFT JOIN department AS d ON r.department_id = d.id
                WHERE e.manager_id IS NULL`;

    connection.query(sql, function(err, results) {
        cb(results);
    });
}

function getAllRoles(cb) {
    const sql = `SELECT r.id AS "Id",
                        r.title AS "Title", 
                        d.name AS "Department", 
                        r.salary AS "Salary"
                FROM role AS r 
                LEFT JOIN department AS d ON r.department_id = d.id`;

    connection.query(sql, function(err, results) {
        cb(results);
    });
}

function getAllDepartments(cb) {
    const sql = `SELECT d.id AS "Id",
                        d.name AS "Department" 
                FROM department AS d`
    connection.query(sql, function(err, results) {
        cb(results);
    });
}

function addDepartment(name) {
    const sql = "INSERT INTO department (name) VALUES (?)";
    connection.query(sql, [name])
}

function addRole(title, salary, dept_id) {
    const sql = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
    connection.execute(sql, [title, salary, dept_id])
}

function addEmployee(first_name, last_name, role_id, manager_id) {
    const sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
    connection.query(sql, [first_name, last_name, role_id, manager_id])
}

function updateEmployeeRole(employee_id, role_id) {
    const sql = "UPDATE employee SET role_id = (?) WHERE id = (?)";
    connection.query(sql, [role_id, employee_id])
}

function closeConnection() {
    connection.end();
}

module.exports = {getAllEmployees, getAllDepartments, getAllRoles, addDepartment, addRole, addEmployee, getManagers, getEmployeesRoles, updateEmployeeRole, closeConnection };
