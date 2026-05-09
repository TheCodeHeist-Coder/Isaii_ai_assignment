import { Request, Response } from 'express';
import User, { UserRole } from '../models/User';
import bcrypt from 'bcryptjs';

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await User.find({ role: UserRole.EMPLOYEE }).select('-password');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employee = await User.findById(req.params.id).select('-password');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { name, email, password, employeeId, department, designation, joiningDate } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = new User({
      name,
      email,
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
      employeeId,
      department,
      designation,
      joiningDate
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { name, email, department, designation, joiningDate, employeeId } = req.body;
    
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.department = department || employee.department;
    employee.designation = designation || employee.designation;
    employee.joiningDate = joiningDate || employee.joiningDate;
    employee.employeeId = employeeId || employee.employeeId;

    await employee.save();
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await User.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
