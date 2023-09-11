const { Calendar } = require("calendar");
var DataLayer = require("./companydata/index.js");
var dl = new DataLayer("ass2022")
const Department = dl.Department;
const Employee = dl.Employee;
const Timecard = dl.Timecard;

//deletes everything from a company
function deleteEverything(company, res) {
    try {
        if (company == null) {
            return res.json({'error': "Please enter a valid company"});
        }
        response = dl.deleteCompany(company);
        return res.json({'success': response});
    } catch (e) {
        return res.json({'error': 'There is no company with that name!'});
    }
}


//Returns a department based on company and dept_id
function getDepartment(company, dept_id, res) {
    let id = parseInt(dept_id);
    let department = dl.getDepartment(company, id);
    if (department !== null) {
        return res.json({"department": department});
    } else {
        return res.json({'error': 'Dept_id does not exist.'});
    }
}

//returns a list of all departments in the company
function getAllDepartments(company, res) {
    let departments = dl.getAllDepartment(company);
    if (departments !== null) {
        return res.json({'departments': departments});
    } else {
        return res.json({'error': 'There are no departments in this company!'});
    }
}

//inserts new department
function insertDepartment(company, dept_name, dept_no, location, res) {
    let d = new Department(company, dept_name, dept_no, location);
    try {
        if (dl.getDepartmentNo(company, dept_no) !== null) {
            return res.json({'error': 'A department with that a number of '+dept_no+' already exists'});
        } else {
            dept = dl.insertDepartment(d);
            return res.json({'success': dept});
        }
    } catch (e) {
        return res.json({'error': 'Error inserting the department'});
    }
}

//updates existing department
function updateDepartment(dept_id, company, dept_name, dept_no, location, res) {
    d = dl.getDepartment(company, dept_id);
    if(d !== null) {
        d.setCompany(company);
        d.setDeptName(dept_name);
        d.setDeptNo(dept_no);
        d.setLocation(location);
        updatedDept = dl.updateDepartment(d);
        return res.json({'success': updatedDept});
    } else {
        return res.json({'error': 'the department '+dept_id+' does not exist.'});
    }
}

//deletes department from company
function deleteDepartment(company, dept_id, res) {
    if (dl.getDepartment(company, dept_id) !== null) {
        dl.deleteDepartment(company, dept_id);
        return res.json({'success': 'Department ' + dept_id + ' from ' + company + ' deleted'});
    } else {
        return res.json({'error': 'The department wtih an id of '+dept_id+' does not exist'});
    }
}

//returns a employee based on emp_id
function getEmployee(emp_id, res) {
    let employee = dl.getEmployee(emp_id);
    if (employee !== null) {
        return res.json({'employee': employee});
    } else {
        return res.json({'error': 'employee does not exist'});
    }
}

//returns a list of all employees in a company
function getAllEmployees(company, res) {
    let employees = dl.getAllEmployee(company);
    if (employees.length !== 0) {
        return res.json({'employees': employees});
    } else {
        return res.json({'error': 'There are no employees in that company'});
    }
}

//inserts new employee
function insertEmployee(company, emp_name, emp_no, hire_date, job, salary, dept_id, mng_id, res) {

    //check if dept_id exists
    if (dl.getDepartment(company, dept_id) == null) {
        return res.json({'error': 'The department with an id of ' +dept_id+ ' does not exist'});
    }

    //check if date is on a weeekend
    var dt = new Date(hire_date);
    if (dt.getDay() == 6 || dt.getDay() == 5) {
        return res.json({'error':'The date '+hire_date+' is on a weekend'})
    }

    //create employee
    emp = new Employee(emp_name, emp_no, hire_date, job, salary, dept_id, mng_id);
    e = dl.insertEmployee(emp);
    return res.json({'success': e});
}

//updates existing employee
function updateEmployee(company, emp_id, emp_name, emp_no, hire_date, job, salary, dept_id, mng_id, res) {

        //check if dept_id exists
        if (dl.getDepartment(company, dept_id) == null) {
            return res.json({'error': 'The department with an id of '+dept_id+' does not exist'});
        }

        //check if employee exists
        if (dl.getEmployee(emp_id) == null) {
            return res.json({'error': 'The employee with an id of '+emp_id+' does not exist'});
        }

        //check if date is on a weeekend
        var dt = new Date(hire_date);
        if (dt.getDay() == 6 || dt.getDay() == 5) {
            return res.json({'error':'The date '+hire_date+' is on a weekend'})
        }
        
        employee = dl.getEmployee(emp_id);
        employee.setEmpName(emp_name);
        employee.setEmpNo(emp_no);
        employee.setHireDate(hire_date);
        employee.setJob(job);
        employee.setSalary(salary);
        employee.setDeptId(dept_id);
        employee.setMngId(mng_id);
        updatedEmployee = dl.updateEmployee(employee);
        return res.json({'success': updatedEmployee});
}

//deletes an employee based on emp_id
function deleteEmployee(emp_id, res) {
    if (dl.getEmployee(emp_id) == null) {
        return res.json({'error':'The employee with an id of  '+emp_id+' does not exist'})
    } else {
        employee = dl.getEmployee(emp_id);
        dl.deleteEmployee(emp_id);
        return res.json({'success': 'Employee ' + emp_id + ' has been deleted.'});
    }
}

//returns a timecard based on timecard_id
function getTimecard(timecard_id, res) {
    let timecard = dl.getTimecard(timecard_id);

    if (timecard == null) {
        return res.json({'error': 'There is no timecard with an id of '+timecard_id});
    } else {
        return res.json({'timecard': timecard});
    }
}

//returns a list of all timecards based on emp_id
function getAllTimecards(emp_id, res) {
    try {
        let timecards = dl.getAllTimecard(emp_id);
        if (timecards !== null) {
            return res.json({'timecards': timecards});
        } else {
            return res.json({'error': 'timecards for this emp do not exist!'});
        }
    } catch (e) {
        return res.json({'error': 'Please use a valid input for emp_id'});
    }
}

//inserts new timecard
function insertTimecard(emp_id, start_time, end_time, res) {
    if (dl.getEmployee(emp_id) == null) {
        return res.json({'error':'The employee with an id of  '+emp_id+' does not exist'})
    }

    //check if start time is on a Weekend
    var st = new Date(start_time);
    if (st.getDay() == 6 || st.getDay() == 5) {
        return res.json({'error':'The start time '+start_time+' is on a weekend'})
    }

    //check if end time is on a weekend
    var et = new Date(end_time);
    if (et.getDay() == 6 || et.getDay() == 5) {
        return res.json({'error':'The start time '+end_time+' is on a weekend'})
    }

    //check if start and end time are on the same day
    if (et.getDate !== st.getDate) {
        return res.json({'error':'The start time and end time are not on the same day'})
    }

    //check if end time is at least an hour from start time
    var ONE_HOUR = 60 * 60 * 1000;
    hourst = new Date(st.getTime() + ONE_HOUR);
    if (et >= hourst) {
        // at least an hour from start time
    } else {
        // not an hour from start time
        return res.json({'error':'The end time is not at least an hour from start time'})
    }


    employee = dl.getEmployee(emp_id);
    if (employee !== null) {
        timecard = new Timecard(start_time, end_time, emp_id);
        newTimecard = dl.insertTimecard(timecard);
        return res.json({'success': newTimecard});
    } else {
        return res.json({'error': 'employee with the id ' + emp_id + ' does not exist'});
    }

}

//updates existing timecard
function updateTimecard(timecard_id, start_time, end_time, res) {
    //check if start time is on a Weekend
    var st = new Date(start_time);
    if (st.getDay() == 6 || st.getDay() == 5) {
        return res.json({'error':'The start time '+start_time+' is on a weekend'})
    }

    //check if end time is on a weekend
    var et = new Date(end_time);
    if (et.getDay() == 6 || et.getDay() == 5) {
        return res.json({'error':'The start time '+end_time+' is on a weekend'})
    }

    //check if start and end time are on the same day
    if (et.getDate !== st.getDate) {
        return res.json({'error':'The start time and end time are not on the same day'})
    }

    //check if end time is at least an hour from start time
    var ONE_HOUR = 60 * 60 * 1000;
    hourst = new Date(st.getTime() + ONE_HOUR);
    if (et >= hourst) {
        // at least an hour from start time
    } else {
        // not an hour from start time
        return res.json({'error':'The end time is not at least an hour from start time'})
    }

    t = dl.getTimecard(timecard_id);
    if(t !== null) {
        t.setStartTime(start_time);
        t.setEndTime(end_time);
        updatedTimecard = dl.updateTimecard(t);
        return res.json({'success': updatedTimecard});
    } else {
        return res.json({'error': 'timecard with the id ' + timecard_id + ' does not exist'});
    }
}

//deletes timecard based on timecard_id
function deleteTimecard(timecard_id, res) {
    timecard = dl.getTimecard(timecard_id);
    if (timecard !== null) {
        deletedTimecard = dl.deleteTimecard(timecard_id);
        return res.json({'success': "Timecard " + timecard_id + " has been deleted."});
    } else {
        return res.json({'error': 'timecard with the id ' + timecard_id + ' does not exist'});
    }
}

module.exports = {deleteEverything, getDepartment, getAllDepartments, insertDepartment, updateDepartment, deleteDepartment, getAllEmployees, getEmployee,
    insertEmployee, updateEmployee, deleteEmployee, getTimecard,
    getAllTimecards, insertTimecard, updateTimecard, deleteTimecard};
