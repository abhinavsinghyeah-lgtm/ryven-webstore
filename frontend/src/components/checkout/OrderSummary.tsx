import Image from "next/image";
import { CartItem } from "@/types/cart";
import { formatPricePaise } from "@/lib/format";

interface Props {
  items: CartItem[];
  subtotalPaise: number;
  shippingPaise?: number | null;
  totalPaise: number;
  shippingLabel?: string;
  shippingState?: "pending" | "selected";
}

export default function OrderSummary({
  items,
  subtotalPaise,
  shippingPaise,
  totalPaise,
  shippingLabel,
  shippingState = "selected",
}: Props) {
  const currency = items[0]?.product?.currency ?? "INR";
  const isPending = shippingState === "pending" || shippingPaise == null;
  const displayedTotalPaise = isPending ? subtotalPaise : totalPaise;

  return (
    <div className="chk-card-warm chk-summary">
      <p className="chk-summary-title">Order Summary</p>

      <div className="chk-summary-items">
        {items.map((item) => (
          <div key={item.productId} className="chk-summary-item">
            <div className="chk-summary-img">
              {item.product.imageUrl ? (
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  sizes="52px"
                  className="object-cover"
                />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🧴</div>
              )}
            </div>
            <div className="chk-summary-item-info">
              <p className="chk-summary-item-name">{item.product.name}</p>
              <p className="chk-summary-item-qty">Qty {item.quantity}</p>
            </div>
            <p className="chk-summary-item-price">
              {formatPricePaise(item.lineTotalPaise, currency)}
            </p>
          </div>
        ))}
      </div>

      <div className="chk-summary-totals">
        <div className="chk-summary-row">
          <span>Subtotal</span>
          <span>{formatPricePaise(subtotalPaise, currency)}</span>
        </div>
        <div className="chk-summary-row">
          <span>Shipping</span>
          <span>
            {isPending
              ? "Calculating..."
              : shippingPaise === 0
                ? "Free"
                : formatPricePaise(shippingPaise, currency)}
          </span>
        </div>
        {shippingLabel && !isPending ? (
          <p className="chk-summary-note">{shippingLabel}</p>
        ) : null}
        <div className="chk-summary-row total">
          <span>Total</span>
          <span>{formatPricePaise(displayedTotalPaise, currency)}</span>
        </div>
        {isPending ? (
          <p className="chk-summary-note">Total excludes shipping until you select a delivery option.</p>
        ) : null}
      </div>
    </div>
  );
}
