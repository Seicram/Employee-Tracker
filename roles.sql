<!--create table for roles-->
CREATE TABLE roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_title VARCHAR(100) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT,

<!--foreign key constraints-->
  FOREIGN KEY (department_id) REFERENCES departments (department_id) ON DELETE CASCADE
);
