const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "12345",
  database: "company_db",
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Connected to the database!");

  runApp();
});

// Main function to run the application
function runApp() {
  inquirer
    .prompt({
      name: "action",
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
        "Update an employee manager",
        "View employees by manager",
        "View employees by department",
        "Delete a department",
        "Delete a role",
        "Delete an employee",
        "View total utilized budget of a department",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
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
          updateEmployeeRole();
          break;
        case "Update an employee manager":
          updateEmployeeManager();
          break;
        case "View employees by manager":
          viewEmployeesByManager();
          break;
        case "View employees by department":
          viewEmployeesByDepartment();
          break;
        case "Delete a department":
          deleteDepartment();
          break;
        case "Delete a role":
          deleteRole();
          break;
        case "Delete an employee":
          deleteEmployee();
          break;
        case "View total utilized budget of a department":
          viewDepartmentBudget();
          break;
        case "Exit":
          connection.end();
          return;
      }
    });
}

// Function to view all departments
function viewDepartments() {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) {
      console.log("Error fetching departments:", err);
      return runApp();
    }
    
    console.log("Departments:");
    results.forEach((department) => {
      console.log(`ID: ${department.id}, Name: ${department.name}`);
    });
    
    runApp();
  });
}


// Function to view all roles
function viewRoles() {
  connection.query(
    "SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id",
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      console.table(results);
      runApp();
    }
  );
}

// Function to view all employees
function viewEmployees() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id",
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      console.table(results);
      runApp();
    }
  );
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Enter the department name:",
        validate: (input) => {
          if (input.trim() === "") {
            return "Please enter a department name.";
          }
          return true;
        },
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        { name: answer.name },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Department added successfully!");
          }
          runApp();
        }
      );
    });
}

// Function to add a role
function addRole() {
  connection.query("SELECT * FROM department", (err, departments) => {
    if (err) {
      console.log(err);
      return;
    }
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter the role title:",
          validate: (input) => {
            if (input.trim() === "") {
              return "Please enter a role title.";
            }
            return true;
          },
        },
        {
          name: "salary",
          type: "input",
          message: "Enter the role salary:",
          validate: (input) => {
            if (isNaN(input) || input.trim() === "") {
              return "Please enter a valid salary.";
            }
            return true;
          },
        },
        {
          name: "department",
          type: "list",
          message: "Select the department for the role:",
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id,
          })),
        },
      ])
      .then((answer) => {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department,
          },
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Role added successfully!");
            }
            runApp();
          }
        );
      });
  });
}

// Function to add an employee
function addEmployee() {
  connection.query("SELECT * FROM role", (err, roles) => {
    if (err) {
      console.log(err);
      return;
    }
    connection.query("SELECT * FROM employee", (err, employees) => {
      if (err) {
        console.log(err);
        return;
      }
      inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "Enter the employee's first name:",
            validate: (input) => {
              if (input.trim() === "") {
                return "Please enter the employee's first name.";
              }
              return true;
            },
          },
          {
            name: "lastName",
            type: "input",
            message: "Enter the employee's last name:",
            validate: (input) => {
              if (input.trim() === "") {
                return "Please enter the employee's last name.";
              }
              return true;
            },
          },
          {
            name: "role",
            type: "list",
            message: "Select the employee's role:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
          {
            name: "manager",
            type: "list",
            message: "Select the employee's manager:",
            choices: [
              { name: "None", value: null },
              ...employees.map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              })),
            ],
          },
        ])
        .then((answer) => {
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: answer.role,
              manager_id: answer.manager,
            },
            (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Employee added successfully!");
              }
              runApp();
            }
          );
        });
    });
  });
}

// Function to update an employee's role
function updateEmployeeRole() {
  connection.query("SELECT * FROM employee", (err, employees) => {
    if (err) {
      console.log(err);
      return;
    }
    connection.query("SELECT * FROM role", (err, roles) => {
      if (err) {
        console.log(err);
        return;
      }
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Select the employee to update:",
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          {
            name: "role",
            type: "list",
            message: "Select the new role for the employee:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((answer) => {
          connection.query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [answer.role, answer.employee],
            (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Employee role updated successfully!");
              }
              runApp();
            }
          );
        });
    });
  });
}

// Function to update an employee's manager
function updateEmployeeManager() {
  connection.query("SELECT * FROM employee", (err, employees) => {
    if (err) {
      console.log(err);
      return;
    }
    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Select the employee to update:",
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
        {
          name: "manager",
          type: "list",
          message: "Select the new manager for the employee:",
          choices: [
            { name: "None", value: null },
            ...employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          ],
        },
      ])
      .then((answer) => {
        connection.query(
          "UPDATE employee SET manager_id = ? WHERE id = ?",
          [answer.manager, answer.employee],
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Employee manager updated successfully!");
            }
            runApp();
          }
        );
      });
  });
}

// Function to view employees by manager
function viewEmployeesByManager() {
  connection.query(
    "SELECT manager.id AS manager_id, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name, employee.id AS employee_id, employee.first_name AS employee_first_name, employee.last_name AS employee_last_name, role.title AS role_title FROM employee LEFT JOIN employee manager ON employee.manager_id = manager.id LEFT JOIN role ON employee.role_id = role.id ORDER BY manager.id, employee.id",
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      console.table(results);
      runApp();
    }
  );
}

// Function to view employees by department
function viewEmployeesByDepartment() {
  connection.query(
    "SELECT department.id AS department_id, department.name AS department_name, employee.id AS employee_id, employee.first_name AS employee_first_name, employee.last_name AS employee_last_name, role.title AS role_title FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY department.id, employee.id",
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      console.table(results);
      runApp();
    }
  );
}

// Function to delete a department
function deleteDepartment() {
  connection.query("SELECT * FROM department", (err, departments) => {
    if (err) {
      console.log(err);
      return;
    }
    inquirer
      .prompt([
        {
          name: "department",
          type: "list",
          message: "Select the department to delete:",
          choices: departments.map((department) => department.name),
        },
      ])
      .then((answer) => {
        connection.query(
          "DELETE FROM department WHERE name = ?",
          [answer.department],
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Department deleted successfully!");
            }
            runApp();
          }
        );
      });
  });
}

// Function to delete a role
function deleteRole() {
  connection.query("SELECT * FROM role", (err, roles) => {
    if (err) {
      console.log(err);
      return;
    }
    inquirer
      .prompt([
        {
          name: "role",
          type: "list",
          message: "Select the role to delete:",
          choices: roles.map((role) => role.title),
        },
      ])
      .then((answer) => {
        connection.query(
          "DELETE FROM role WHERE title = ?",
          [answer.role],
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Role deleted successfully!");
            }
            runApp();
          }
        );
      });
  });
}

// Function to delete an employee
function deleteEmployee() {
  connection.query("SELECT * FROM employee", (err, employees) => {
    if (err) {
      console.log(err);
      return;
    }
    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Select the employee to delete:",
          choices: employees.map(
            (employee) =>
              `${employee.first_name} ${employee.last_name}`
          ),
        },
      ])
      .then((answer) => {
        const [firstName, lastName] = answer.employee.split(" ");
        connection.query(
          "DELETE FROM employee WHERE first_name = ? AND last_name = ?",
          [firstName, lastName],
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Employee deleted successfully!");
            }
            runApp();
          }
        );
      });
  });
}

// Function to view the total utilized budget of a department
function viewDepartmentBudget() {
  connection.query(
    "SELECT department.id AS department_id, department.name AS department_name, SUM(role.salary) AS total_budget FROM department LEFT JOIN role ON department.id = role.department_id LEFT JOIN employee ON role.id = employee.role_id GROUP BY department.id, department.name",
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      console.table(results);
      runApp();
    }
  );
}
