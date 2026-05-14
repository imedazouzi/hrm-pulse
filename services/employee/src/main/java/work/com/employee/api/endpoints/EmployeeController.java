package work.com.employee.api.endpoints;

import org.springframework.web.bind.annotation.*;
import work.com.employee.application.service.EmployeeService;
import work.com.employee.domain.model.Employee;
import work.com.employee.infra.persistence.JpaEmployeeRepository;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService employeeService;
    private final JpaEmployeeRepository employeeRepository;

    public EmployeeController(EmployeeService employeeService, JpaEmployeeRepository employeeRepository) {
        this.employeeService = employeeService;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee) {
        return employeeService.createEmployee(employee.getFirstName(), employee.getLastName());
    }
}
