export type UUID = string;
export type Email = string;
export type PhoneNumber = string;
export type Date = string; // ISO 8601 format
export enum Subject {
	MATH = "MATH",
	SCIENCE = "SCIENCE",
	ENGLISH = "ENGLISH",
	HISTORY = "HISTORY",
	ART = "ART",
	MUSIC = "MUSIC",
	PHYSICAL_EDUCATION = "PHYSICAL_EDUCATION",
}
export enum Grade {
	FRESHMAN = "FRESHMAN",
	SOPHOMORE = "SOPHOMORE",
	JUNIOR = "JUNIOR",
	SENIOR = "SENIOR",
}
export interface Person {
	id: number;
	firstName: string;
	lastName: string;
	email: Email;
	phoneNumber: PhoneNumber;
	dateOfBirth: Date;
}
export interface Teacher extends Person {
	subjects: Subject[];
	hireDate: Date;
	classesTeaching: UUID[]; // Reference to Class IDs
}
export interface Student extends Person {
	grade: Grade;
	enrollmentDate: Date;
	classesAttending: UUID[]; // Reference to Class IDs
}
export interface Class {
	id: UUID;
	name: string;
	subject: Subject;
	teacherId: UUID; // Reference to Teacher ID
	studentIds: UUID[]; // Reference to Student IDs
	schedule: ClassSchedule;
}
export interface ClassSchedule {
	dayOfWeek: string;
	startTime: string; // HH:MM format
	endTime: string; // HH:MM format
	roomNumber: string;
}
// Type for the entire database
export interface SchoolDatabase {
	teachers: Teacher[];
	students: Student[];
	classes: Class[];
}
