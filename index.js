const inquirer = require('inquirer');
const consoleTable = require('console.table');
const dal = require('./scripts/dal');

const actions = [
    "View all departments",
    "View all roles",
    "View all employees",
    "Add department",
    "Add role",
    "Add employee",
    "Update employee role",
    "Exit"
];

console.log(`
 ___________________________________________________________________________________
|                                                                                   |
|                           Welcome to Employee Tracker.                            |
|___________________________________________________________________________________|

`);

startup();

function startup() {
    showActions();
}

// function to prompt user to select a task
function showActions() {
    inquirer
    .prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "action",
            choices: actions,
          },
    ])
    .then(answer => {
        switch(answer.action) {
            case actions[0] : {
                viewAllDepartments();
                break;
            }
            case actions[1]: {
                viewAllRoles();
                break;
            }
            case actions[2]: {
                viewAllEmployees();
                break; 
            }
            case actions[3]: {
                addDepartment();
                break; 
            }
            case actions[4]: {
                addRole();
                break; 
            }
            case actions[5]: {
                addEmployee();
                break; 
            }
            case actions[6]: {
                updateEmployeeRole();
                break; 
            }
            case actions[7]: {
                quit();
                break; 
            }
            default: {
                break;
            }
        }
    });
};

function viewAllEmployees() {
    dal.getAllEmployees(function(employees) {
        console.log("All Employees:");
        console.table(employees);
        showActions();
    });
    
}

function viewAllRoles() {
    dal.getAllRoles(function(roles) {
        console.log("All Roles:");
        console.table(roles);
        showActions();
    });
}

function viewAllDepartments() {
    dal.getAllDepartments(function(depts) {
        console.log("All Departments:");
        console.table(depts);
        showActions();
    });
}

function addDepartment() {
    inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department: '
    }, ])
    .then(answers => {
        let name = answers.name;
        dal.addDepartment(name);
        console.log(`Added ${name} to the database`); 
        showActions();       
    });
}

function addRole() {
    dal.getAllDepartments(function(depts) {
        const dept_choices = depts.map(({ Department, Id }) => ({ name: Department, value: Id }));
        inquirer.prompt([{
                type: 'input',
                name: 'title',
                message: 'Enter the name/title of the role: '
            },
            {
                type: 'input',
                name: 'salary',
                message: `Enter the salary for the role: `
            },
            {
                type: 'list',
                name: 'dept',
                message: 'Select the department for the role: ',
                choices: dept_choices
            }
        ])
        .then(answers => {
            let title = answers.title;
            let salary = Number(answers.salary);
            let department_id = answers.dept;
            dal.addRole(title, salary, department_id);
            console.log(`Added ${title} to the database`); 
            showActions();       
        });
    });
}

function addEmployee() {
    inquirer.prompt([{
            type: 'input',
            name: 'first_name',
            message: 'Enter the employee\'s first name: '
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the employee\'s last name: '
        }
    ])
    .then(name_answer => {
        let new_fname = name_answer.first_name;
        let new_lname = name_answer.last_name;
        dal.getAllRoles(function(roles) {
            const role_choices = roles.map(({ Title, Id }) => ({ name: Title, value: Id }));
            inquirer.prompt([{
                    type: 'list',
                    name: 'role',
                    message: 'Select the employee\'s role: ',
                    choices: role_choices
                }
            ])
            .then(role_answer => {
                let new_role = role_answer.role;
                dal.getManagers(function(managers) {
                    const emp_choices = managers.map(({ Name, Id }) => ({ name: Name, value: Id }));
                    inquirer.prompt([{
                            type: 'list',
                            name: 'manager',
                            message: 'Select the employee\'s manager: ',
                            choices: emp_choices
                        }
                    ])
                    .then(mgr_answer => {
                        let new_mgr = mgr_answer.manager;
                        dal.addEmployee(new_fname, new_lname, new_role, new_mgr);
                        console.log(`Added ${new_fname} ${new_lname} to the database`); 
                        showActions();       
                    });
                });                
            });
        });
    });
}

function updateEmployeeRole() {
    dal.getEmployeesRoles(function(employeesRoles) {
        const emp_choices = employeesRoles.map(({ first_name, last_name, role, id }) => ({ name:  `${first_name} ${last_name} -- ${role}`, value: id }));
        inquirer.prompt([{
                type: 'list',
                name: 'emp',
                message: 'Select the employee you want to update: ',
                choices: emp_choices
            }])
            .then(answer => {
                let employeeId = answer.emp;
                dal.getAllRoles(function(roles) {
                    const role_choices = roles.map(({ Title, Id }) => ({ name:  Title, value: Id }));
                    inquirer.prompt([{
                        type: 'list',
                        name: 'role',
                        message: 'Select the new role for this employee: ',
                        choices: role_choices
                    }
                ])
                .then(answer => {
                    let roleId = answer.role;
                    dal.updateEmployeeRole(employeeId, roleId);
                    console.log(`Updated Employee's role`); 
                    showActions();       
                });
            });
        });
    });
}

function quit() {
    console.log('Goodbye'); 
    dal.closeConnection();
}