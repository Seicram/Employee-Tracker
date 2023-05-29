<!-- employees table -->
CREATE TABLE employees (
  employee_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT,
  manager_id INT,

<!-- foreign key constraints -->
  FOREIGN KEY (role_id) REFERENCES roles (role_id) ON DELETE SET NULL,
  FOREIGN KEY (manager_id) REFERENCES employees (employee_id) ON DELETE SET NULL
);
