import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorDialogComponent {
  message: string = '';
}
