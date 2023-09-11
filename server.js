const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const formParser = bodyParser.urlencoded({extended: false});
const jsonParser = bodyParser.json();

const router = express.Router();
app.use('/CompanyServices', router);

// const bl = require('./BusinessLayer.js');
var vm = require('vm');
var fileSync = require('fs');
eval(fileSync.readFileSync('./BusinessLayer.js')+'');

router.delete('/company', (req, res) => { // /form
    let company = req.param("company");
    deleteEverything(company, res);
});

router.get('/department', (req, res) => { // /form
    let company = req.param("company");
    let dept_id = req.param("dept_id");
    // bl.getDepartment(company, dept_id, res);
    getDepartment(company, dept_id, res);
});

router.get('/departments', (req, res) => { // /form
    let company = req.param("company");
    getAllDepartments(company, res);
});

router.put('/department', jsonParser, (req, res) => { // /form
    let dept_id = req.param("dept_id");
    let company = req.param("company");
    let dept_name = req.param("dept_name");
    let dept_no = req.param("dept_no");
    let location = req.param("location");
    updateDepartment(dept_id, company, dept_name, dept_no, location, res);
});

router.post('/department', formParser, (req, res) => {
    let company = req.param("company");
    let dept_name = req.param("dept_name");
    let dept_no = req.param("dept_no");
    let location = req.param("location");
    insertDepartment(company, dept_name, dept_no, location, res);
});

router.delete('/department', formParser, (req, res) => {
    let company = req.param("company");
    let dept_id = req.param("dept_id");
    deleteDepartment(company, dept_id, res);
});

router.get('/employee', (req, res) => {
    let emp_id = req.param("emp_id");
    getEmployee(emp_id, res);
});

router.get('/employees', (req, res) => {
    let company = req.param("company");
    getAllEmployees(company, res);
});

router.post('/employee', formParser, (req, res) => { // /form
    let company = req.param("company");
    let emp_name = req.param("emp_name");
    let emp_no = req.param("emp_no");
    let hire_date = req.param("hire_date");
    let job = req.param("job");
    let salary = req.param("salary");
    let dept_id = req.param("dept_id");
    let mng_id = req.param("mng_id");
    insertEmployee(company, emp_name, emp_no, hire_date, job, salary, dept_id, mng_id, res);
});

router.put('/employee', jsonParser, (req, res) => { // /form
    let company = req.param("company");
    let emp_id = req.param("emp_id");
    let emp_name = req.param("emp_name");
    let emp_no = req.param("emp_no");
    let hire_date = req.param("hire_date");
    let job = req.param("job");
    let salary = req.param("salary");
    let dept_id = req.param("dept_id");
    let mng_id = req.param("mng_id");
    updateEmployee(company, emp_id, emp_name, emp_no, hire_date, job, salary, dept_id, mng_id, res);
});

router.delete('/employee', (req, res) => {
    let emp_id = req.param("emp_id");
    deleteEmployee(emp_id, res);
});

router.get('/timecard', (req, res) => {
    let timecard_id = req.param("timecard_id");
    getTimecard(timecard_id, res);
});

router.get('/timecards', (req, res) => {
    let emp_id = req.param("emp_id");
    getAllTimecards(emp_id, res);
});

router.post('/timecard', formParser, (req, res) => { // /form
    let emp_id = req.param("emp_id");
    let start_time = req.param("start_time");
    let end_time = req.param("end_time");
    insertTimecard(emp_id, start_time, end_time, res);
});

router.put('/timecard', jsonParser, (req, res) => { // /form
    let timecard_id = req.param("timecard_id");
    let start_time = req.param("start_time");
    let end_time = req.param("end_time");
    updateTimecard(timecard_id, start_time, end_time, res);
});

router.delete('/timecard', (req, res) => {
    let timecard_id = req.param("timecard_id");
    deleteTimecard(timecard_id, res);
});

app.listen(port);
