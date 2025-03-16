import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { FormErrorComponent } from './form-error.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { CommonModule } from '@angular/common';

const meta: Meta<FormErrorComponent> = {
  component: FormErrorComponent,
  title: 'Shared/FormErrorComponent',
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
};
export default meta;
type Story = StoryObj<FormErrorComponent>;

export const RequiredError: Story = {
  args: {
    fieldName: 'Name',
    errors: { required: true },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(`${args.fieldName} is required`)).toBeTruthy();
  },
};

export const InvalidEmailError: Story = {
  args: {
    errors: { email: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Email invalid')).toBeTruthy();
  },
};

export const MultipleErrors: Story = {
  args: {
    fieldName: 'Name',
    errors: { required: true, email: true },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(`${args.fieldName} is required`)).toBeTruthy();
    expect(canvas.getByText('Email invalid')).toBeTruthy();
  },
};
