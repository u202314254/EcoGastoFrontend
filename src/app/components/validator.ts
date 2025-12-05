import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador personalizado para emails que devuelve errores específicos.
 */
export function customEmailValidator(): ValidatorFn {
  
  return (control: AbstractControl): ValidationErrors | null => {
    
    const value = control.value;

    if (!value) {
      return null;
    }


    if (!value.includes('@')) {
      return { faltaArroba: true };
    }

    const parts = value.split('@');
    if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
      return { formatoInvalido: true };
    }

    const domain = parts[1];

    if (!domain.includes('.')) {
      return { faltaDominio: true };
    }

    const domainParts = domain.split('.');
    if (domainParts[domainParts.length - 1].length === 0) {
      return { faltaDominio: true };
    }

    return null;
  };
}