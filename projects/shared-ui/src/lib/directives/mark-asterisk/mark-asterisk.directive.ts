import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import { FormControl, FormGroup, NgControl, Validators } from '@angular/forms';

@Directive({
  selector: 'input[appMarkAsterisk], textarea[appMarkAsterisk]',
})
export class MarkAsteriskDirective implements OnInit {
  constructor(
    private elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
    @Optional() @Self() private ngControl: NgControl
  ) {}

  ngOnInit(): void {
    const { placeholder } = this.elementRef.nativeElement;

    if (this.ngControl?.control?.hasValidator(Validators.required)) {
      this.elementRef.nativeElement.placeholder = placeholder + ' *';
    }
  }
}
