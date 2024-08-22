import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Course } from '../../features/dashboard/courses/models/course';
import { TestRequest } from '@angular/common/http/testing';

export function noOnlySpacesValidator(control: AbstractControl) {
    if(control.value && control.value.trim().length === 0) {
        return{
            noOnlySpaces: true
        }
    }
    return null
}

export function noLeadingSpacesValidator(control: AbstractControl) {
    if(control.value && control.value.trimLeft().length !== control.value.length){
        return{
            noLeadingSpaces: true
        }
    }
    return null
}

export function dateRangeValidator(minDate: Date | null, maxDate: Date | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
  
      const date = new Date(value);
      if (minDate && maxDate && (date < minDate || date > maxDate)) {
        return { dateRange: true };
      }
      return null;
    };
}

export function beforeStartDateValidator(startDate: Date): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = new Date(control.value);
      if (selectedDate >= startDate) {
        return { beforeStartDate: true };
      }
      return null;
    };
}

export function studentAlreadyEnrolledValidator(course: Course | null): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (course && course.students && course.students.includes(control.value)) {
        return { studentAlreadyEnrolled: true };
      }
      return null;
    };
  }