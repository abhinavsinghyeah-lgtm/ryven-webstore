import Image from "next/image";
import { CartItem } from "@/types/cart";
import { formatPricePaise } from "@/lib/format";

interface Props {
  items: CartItem[];
  subtotalPaise: number;
  shippingPaise: number;
  totalPaise: number;
}

export default function OrderSummary({ items, subtotalPaise, shippingPaise, totalPaise }: Props) {
  const currency = items[0]?.product?.currency ?? "INR";

  return (
    <div className="rounded-2xl border border-[#e8e8e4] bg-[#fafaf8] p-5 space-y-4">
      <h3 className="text-sm font-semibold text-[#111] uppercase tracking-wider">Order Summary</h3>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-3">
            <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-[#f0f0ec] shrink-0">
              {item.product.imageUrl ? (
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xl">🧴</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#111] truncate">{item.product.name}</p>
              <p className="text-xs text-[#888]">Qty {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-[#111] shrink-0">
              {formatPricePaise(item.lineTotalPaise, currency)}
            </p>
          </li>
        ))}
      </ul>

      <div className="border-t border-[#e8e8e4] pt-3 space-y-1.5">
        <div className="flex justify-between text-sm text-[#555]">
          <span>Subtotal</span>
          <span>{formatPricePaise(subtotalPaise, currency)}</span>
        </div>
        <div className="flex justify-between text-sm text-[#555]">
          <span>Shipping</span>
          <span>{shippingPaise === 0 ? "Free" : formatPricePaise(shippingPaise, currency)}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-[#111] pt-1">
          <span>Total</span>
          <span>{formatPricePaise(totalPaise, currency)}</span>
        </div>
      </div>
    </div>
  );
}
