package work.com.employee.infra.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import work.com.employee.domain.model.Employee;
import work.com.employee.domain.repository.EmployeeRepository;

import java.util.UUID;

@Repository
public interface JpaEmployeeRepository extends JpaRepository<Employee, UUID>, EmployeeRepository {
    // Additional database-specific queries can be added here
}
