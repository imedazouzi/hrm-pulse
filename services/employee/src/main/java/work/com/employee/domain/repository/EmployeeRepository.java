package work.com.employee.domain.repository;

import work.com.employee.domain.model.Employee;

import java.util.Optional;
import java.util.UUID;

public interface EmployeeRepository {
    Optional<Employee> findById(UUID id);
    Employee save(Employee employee);
}
