INSERT INTO department (name)
VALUES ('Sales'), ('Finance'), ('Human resources'), ('Legal'), ('Executives');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Technician', 100000, 1),
    ('Sales Manager', 80000, 1),
    ('Supervisor', 150000, 2),
    ('Financial Advisor', 120000, 2),
    ('Accountant', 160000, 3),
    ('HR Rep', 100000, 3),
    ('HR Manager', 150000, 3),
    ('Legal Assistant', 150000, 4),
    ('Lawyer', 200000, 4),
    ('Manager', 250000, 5),
    ('Director', 300000, 5),
    ('VP', 500000, 5),
    ('CEO', 1000000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Blake', 'Daruty', 1, NULL),
    ('Mike', 'Chan', 2, NULL),
    ('Ashley', 'Rodriguez', 2, NULL),
    ('Kevin', 'Tupik', 3, NULL),
    ('Kunal', 'Singh', 1, 1),
    ('Michelle', 'Obama', 4, 4),
    ('Sarah', 'Lourd', 2, 2),
    ('Anita', 'Baker', 1, NULL),
    ('Katie', 'Smith', 2, 1),
    ('Mark', 'Taylor', 2, 2),
    ('Ben', 'Folds', 4, 3),
    ('Jill', 'Johnson', 4, NULL),
    ('Jack', 'Bauer', 5, 4),
    ('Chloe', 'O''Brian', 5, 4),
    ('Kim', 'Bauer', 5, 4),
    ('David', 'Palmer', 5, 4),
    ('Michelle', 'Dessler', 5, 4),
    ('Dennis', 'Rodman', 5, 5),
    ('Michael', 'Jordan', 5, 5),
    ('Larry', 'Bird', 5, 5),
    ('Bill', 'Gates', 5, NULL),
    ('Steve', 'Jobs', 5, 5),
    ('Jeff', 'Bezos', 5, NULL);
