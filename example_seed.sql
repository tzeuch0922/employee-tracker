INSERT INTO department (name) VALUE 
    ('Software');

INSERT INTO role (department_id, title, salary) VALUE
    (1, 'Software Engineer', 78000),
    (1, 'Senior Software Engineer', 145000),
    (1, 'Software Manager', 125000);

INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUE
    ('Joe', 'Bednarz', NULL, 3),
    ('Tony', 'Zeuch', 1, 1),
    ('Cedric', 'Hawley', 1, 2);