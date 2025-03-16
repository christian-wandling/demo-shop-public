import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { DateTimeComponent } from './date-time.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { CommonModule } from '@angular/common';

const meta: Meta<DateTimeComponent> = {
  component: DateTimeComponent,
  title: 'Shared/DateTimeComponent',
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
};
export default meta;
type Story = StoryObj<DateTimeComponent>;

export const WithDate: Story = {
  args: {
    dateTime: new Date('2025-03-16T12:00:00'), // Example with specific date
  },
  argTypes: {
    dateTime: {
      control: {
        type: 'date',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const date = args.dateTime.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    expect(canvas.getByText(date)).toBeTruthy();
  },
};

export const WithISOString: Story = {
  args: {
    dateTime: '2025-03-16T12:00:00Z',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const date = new Date(args.dateTime).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    expect(canvas.getByText(date)).toBeTruthy();
  },
};
