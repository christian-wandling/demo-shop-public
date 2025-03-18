import { OrderItem } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Response object representing an order item with product details and pricing.
 */
export class OrderItemResponse {
  /**
   * Unique identifier of the product.
   */
  @ApiProperty()
  readonly productId: number;

  /**
   * Name of the product.
   */
  @ApiProperty()
  readonly productName: string;

  /**
   * URL or path to the product's thumbnail image.
   */
  @ApiProperty()
  readonly productThumbnail: string;

  /**
   * Quantity of the product ordered.
   */
  @ApiProperty()
  readonly quantity: number;

  /**
   * Price per unit of the product.
   */
  @ApiProperty()
  readonly unitPrice: number;

  /**
   * Total price for this item (unitPrice × quantity).
   */
  @ApiProperty()
  readonly totalPrice: number;
}

/**
 * Converts an OrderItem entity to an OrderItemResponse DTO.
 * Calculates the total price based on unit price and quantity.
 *
 * @param item - The order item entity to convert
 * @returns An OrderItemResponse object
 */
export const toOrderItemResponse = (item: OrderItem): OrderItemResponse => {
  return {
    productId: item.product_id,
    productName: item.product_name,
    productThumbnail: item.product_thumbnail,
    quantity: item.quantity,
    unitPrice: Number(item.price),
    totalPrice: Number(item.price) * item.quantity,
  };
};
