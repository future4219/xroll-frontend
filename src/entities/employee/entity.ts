import { Club } from "@/entities/club/entity"


export type FamilyMember = {
    familyMemberId: string;
    name:           string;
    relation:       string;
    age:            number;
};

export type MyNumber = {
    myNumber:       string;
    expirationDate: Date;
}

export type Employee = {
    employeeId:    string;
    name:           string;
    age:            number;
    myNumber:       MyNumber;
    familyMembers:  FamilyMember[];
    clubs:          Club[];
}
