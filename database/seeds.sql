use employee_tracker;

INSERT INTO department(name) 
VALUES('Sales'),
      ('Engineering'),
      ('Finance'),
      ('Legal');
            
INSERT INTO role(title, salary, department_id)
    VALUES('Sales Manager', 120000, (SELECT id FROM department WHERE name = 'Sales')),
		  ('Sales Person', 85000, (SELECT id FROM department WHERE name = 'Sales')),
          ('Tech Lead', 150000, (SELECT id FROM department WHERE name = 'Engineering')),
          ('Web Developer', 100000, (SELECT id FROM department WHERE name = 'Engineering')),
          ('Accountant', 80000, (SELECT id FROM department WHERE name = 'Finance')),          
          ('Payroll Admin', 75000, (SELECT id FROM department WHERE name = 'Finance')),
          ('Lawyer', 160000, (SELECT id FROM department WHERE name = 'Legal')),          
          ('Paralegal', 80000, (SELECT id FROM department WHERE name = 'Legal'));       
         use employee_tracker;

INSERT INTO employee(first_name, last_name, role_id, manager_id)
    VALUES('Todd', 'Packer', (SELECT id FROM role WHERE title = 'Sales Manager'), NULL),
          ('Phyllis ', 'Vance', (SELECT id FROM role WHERE title = 'Sales Person'), NULL),
          ('Gabe', 'Lewis', (SELECT id FROM role WHERE title = 'Tech Lead'), NULL),
          ('Creed', 'Bratton', (SELECT id FROM role WHERE title = 'Web Developer'), NULL),
          ('Charles', 'Miner', (SELECT id FROM role WHERE title = 'Accountant'), NULL),
          ('Darryl', 'Philbin', (SELECT id FROM role WHERE title = 'Payroll Admin'), NULL),
          ('Meredith ', 'Palmer', (SELECT id FROM role WHERE title = 'Lawyer'), NULL),
          ('Toby', 'Flenderson', (SELECT id FROM role WHERE title = 'Paralegal'), NULL);


UPDATE employee SET manager_id = (SELECT id FROM (SELECT id FROM employee WHERE last_name = 'Palmer') as m) WHERE last_name = 'Flenderson';
UPDATE employee SET manager_id = (SELECT id FROM (SELECT id FROM employee WHERE last_name = 'Miner') as m) WHERE last_name = 'Philbin';
UPDATE employee SET manager_id = (SELECT id FROM (SELECT id FROM employee WHERE last_name = 'Lewis') as m) WHERE last_name = 'Bratton';
UPDATE employee SET manager_id = (SELECT id FROM (SELECT id FROM employee WHERE last_name = 'Packer') as m) WHERE last_name = 'Vance';
