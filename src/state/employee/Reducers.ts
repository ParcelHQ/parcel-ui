import { v4 as uuidv4 } from 'uuid';
import { CREATE_EMPLOYEE, DELETE_EMPLOYEE, UPDATE_EMPLOYEE } from './Constants';

export default function EmployeeReducer(state: any, action: any) {
  switch (action.type) {
    case CREATE_EMPLOYEE:
      return [
        ...state,
        {
          id: uuidv4(),
          name: action.payload.name,
          department: action.payload.department,
          currency: action.payload.currency,
          salary: action.payload.salary,
        },
      ];

    case DELETE_EMPLOYEE:
      return state.filter((employee: any) => employee.id !== action.payload);

    case UPDATE_EMPLOYEE:
      const updatedEmployee = action.payload;

      const updatedEmployees = state.map((employee: any) => {
        if (employee.id === updatedEmployee.id) {
          return updatedEmployee;
        }
        return employee;
      });

      //!FIX UPDATE TO STATE DIRECTLY
      return [...updatedEmployees];

    default:
      return state;
  }
}
