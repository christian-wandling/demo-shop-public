/**
 * Configuration options for PDF document drawing and rendering
 * Contains comprehensive settings for positioning, borders, colors, and text styling
 *
 * @property {object} pointer - Current drawing position coordinates
 * @property {number} pointer.x - X-coordinate of the current drawing position (in points)
 * @property {number} pointer.y - Y-coordinate of the current drawing position (in points)
 *
 * @property {object} border - Document margins defining the drawable area
 * @property {number} border.left - Left margin position (in points)
 * @property {number} border.right - Right margin position (in points)
 * @property {number} border.top - Top margin position (in points)
 * @property {number} border.bottom - Bottom margin position (in points)
 *
 * @property {object} line - Line drawing configuration
 * @property {object} line.color - Color settings for lines
 * @property {number} line.color.light - Light line color value (0-255 grayscale)
 *
 * @property {object} text - Text rendering configuration
 * @property {object} text.color - Color settings for different text elements
 * @property {number} text.color.darker - Very dark text color value (0-255 grayscale)
 * @property {number} text.color.dark - Dark text color value (0-255 grayscale)
 * @property {number} text.color.light - Light text color value (0-255 grayscale)
 * @property {number} text.color.lighter - Very light text color value (0-255 grayscale)
 *
 * @property {object} text.size - Font size settings for different text elements
 * @property {number} text.size.tiny - Tiny font size (in points)
 * @property {number} text.size.smaller - Smaller font size (in points)
 * @property {number} text.size.small - Small font size (in points)
 * @property {number} text.size.default - Default font size (in points)
 *
 * @property {object} text.font - Font family settings
 * @property {'Helvetica'} text.font.default - Default font family to use for text
 */
export type DrawOptions = {
  pointer: {
    x: number;
    y: number;
  };
  border: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  line: {
    color: {
      light: number;
    };
  };
  text: {
    color: {
      darker: number;
      dark: number;
      light: number;
      lighter: number;
    };
    size: {
      tiny: number;
      smaller: number;
      small: number;
      default: number;
    };
    font: {
      default: 'Helvetica';
    };
  };
};
