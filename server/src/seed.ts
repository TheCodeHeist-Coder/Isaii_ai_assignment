import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User, { UserRole } from './models/User';

dotenv.config();

const departments = ['Engineering', 'Human Resources', 'Marketing', 'Sales', 'Finance', 'Design'];
const designations = {
  Engineering: ['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'DevOps Engineer', 'QA Engineer'],
  'Human Resources': ['HR Manager', 'Recruiter', 'HR Specialist'],
  Marketing: ['Marketing Manager', 'Content Writer', 'SEO Specialist', 'Social Media Manager'],
  Sales: ['Sales Manager', 'Account Executive', 'Business Development'],
  Finance: ['Accountant', 'Financial Analyst', 'Finance Manager'],
  Design: ['UI/UX Designer', 'Graphic Designer', 'Product Designer']
};

const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'Robert', 'Sarah', 'David', 'Jessica', 'William', 'Ashley', 'Richard', 'Jennifer', 'Joseph', 'Linda', 'Thomas', 'Barbara', 'Christopher', 'Susan', 'Charles', 'Margaret', 'Daniel', 'Jessica', 'Matthew', 'Dorothy', 'Anthony'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris'];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing users except maybe keeping admins if needed, but for a fresh seed let's clear all
    await User.deleteMany({});
    console.log('Cleared existing users');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Seed Admin
    const admin = new User({
      name: 'Admin User',
      email: 'admin@hrms.com',
      password: hashedPassword,
      role: UserRole.ADMIN
    });
    await admin.save();
    console.log('Admin user created');

    // Seed Employees
    const employees = [];
    for (let i = 1; i <= 25; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      const name = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@hrms.com`;
      const department = departments[i % departments.length] as keyof typeof designations;
      const deptDesignations = designations[department];
      const designation = deptDesignations[i % deptDesignations.length];
      const employeeId = `EMP${1000 + i}`;

      employees.push({
        name,
        email,
        password: hashedPassword,
        role: UserRole.EMPLOYEE,
        employeeId,
        department,
        designation,
        joiningDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      });
    }

    await User.insertMany(employees);
    console.log('25 Employee users created');

    console.log('Seeding completed successfully');
    console.log('Admin: admin@hrms.com / password123');
    console.log('All employees password: password123');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
