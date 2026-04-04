export function GuaranteesSection() {
  const guarantees = [
    { icon: "🚚", title: "Free Shipping", desc: "On all orders above ₹999. Standard delivery in 4-6 days." },
    { icon: "↩️", title: "Easy Returns", desc: "7-day hassle-free return policy. No questions asked." },
    { icon: "🔬", title: "100% Authentic", desc: "Every fragrance is genuine, crafted in-house with premium ingredients." },
    { icon: "💳", title: "Secure Payment", desc: "Razorpay-powered checkout with UPI, cards, and net banking." },
  ];

  return (
    <section className="py-16 px-[var(--px)] bg-white border-t border-[var(--border)]">
      <div className="mx-auto max-w-[var(--max-w)]">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((g) => (
            <div key={g.title} className="text-center p-5 anim-up">
              <span className="text-3xl block mb-3">{g.icon}</span>
              <h3 className="font-semibold text-[var(--text)] mb-1">{g.title}</h3>
              <p className="text-xs text-[var(--text-3)] leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
