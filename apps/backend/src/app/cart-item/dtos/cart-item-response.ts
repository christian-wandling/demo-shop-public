import { HydratedCartItem } from '../entities/hydrated-cart-item';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents a response object for cart items with product details.
 * Used to provide structured information about items in a shopping cart.
 */
export class CartItemResponse {
  /**
   * Unique identifier of the cart item
   */
  @ApiProperty()
  readonly id: number;

  /**
   * Identifier of the product in the cart item
   */
  @ApiProperty()
  readonly productId: number;

  /**
   * Name of the product
   */
  @ApiProperty()
  readonly productName: string;

  /**
   * URL or path to the product thumbnail image
   */
  @ApiProperty()
  readonly productThumbnail: string;

  /**
   * Quantity of the product in the cart
   */
  @ApiProperty()
  readonly quantity: number;

  /**
   * Price per unit of the product
   */
  @ApiProperty()
  readonly unitPrice: number;

  /**
   * Total price calculated as unitPrice * quantity
   */
  @ApiProperty()
  readonly totalPrice: number;
}

/**
 * Converts a HydratedCartItem to a CartItemResponse object.
 * Extracts relevant product information and calculates prices.
 *
 * @param item - The hydrated cart item with product details
 * @returns A formatted cart item response object
 */
export const toCartItemResponse = (item: HydratedCartItem): CartItemResponse => {
  const productThumbnail = item.product.images?.[0]?.uri;

  return {
    id: item.id,
    productId: item.product_id,
    productName: item.product.name,
    productThumbnail,
    quantity: item.quantity,
    unitPrice: Number(item.product.price),
    totalPrice: Number(item.product.price) * item.quantity,
  };
};
