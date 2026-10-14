"use client";

import Link from "next/link";

export default function TermsPage() {
    const updated = "October 17, 2026";

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Hero */}
            <section className="relative overflow-hidden pt-40 pb-12">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px]" />
                    <div className="absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-red-500/20 blur-[120px]" />
                </div>
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />

                <div className="relative mx-auto max-w-4xl px-6 text-center">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-300 backdrop-blur">
                        📋 Please read carefully
                    </div>
                    <h1 className="text-4xl font-black sm:text-5xl lg:text-6xl">
                        Terms of{" "}
                        <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                            Service
                        </span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-gray-400">
                        The rules and guidelines for using FoodieHub's food delivery
                        services.
                    </p>
                    <p className="mt-3 text-xs text-gray-500">
                        Last updated: <strong className="text-gray-300">{updated}</strong>
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="relative pb-24">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur sm:p-12">
                        <div className="space-y-10 text-gray-300">
                            <Section title="1. Acceptance of Terms">
                                <p>
                                    By accessing or using FoodieHub ("the Service"), you agree to
                                    be bound by these Terms of Service. If you do not agree to
                                    these terms, please do not use the Service.
                                </p>
                                <p>
                                    We may update these Terms at any time. Continued use of the
                                    Service after changes means you accept the updated Terms.
                                </p>
                            </Section>

                            <Section title="2. About FoodieHub">
                                <p>
                                    FoodieHub is a food delivery platform that connects customers
                                    with local restaurants and delivery riders. We are not a
                                    restaurant — we act as an intermediary that facilitates orders
                                    between you and our partner restaurants.
                                </p>
                            </Section>

                            <Section title="3. Eligibility">
                                <p>To use FoodieHub, you must:</p>
                                <ul>
                                    <li>Be at least 18 years old, or have parental consent.</li>
                                    <li>Provide accurate, current, and complete information.</li>
                                    <li>Keep your login credentials secure and confidential.</li>
                                    <li>Use the Service only for lawful purposes.</li>
                                </ul>
                            </Section>

                            <Section title="4. User Accounts">
                                <SubHeading>Account creation</SubHeading>
                                <p>
                                    When you register, you agree to provide a valid email address
                                    and verify it. You are responsible for all activity under your
                                    account.
                                </p>

                                <SubHeading>Account security</SubHeading>
                                <ul>
                                    <li>Never share your password with anyone.</li>
                                    <li>Notify us immediately of unauthorized access.</li>
                                    <li>
                                        We are not liable for losses caused by unauthorized use of
                                        your account if you failed to keep credentials secure.
                                    </li>
                                </ul>

                                <SubHeading>Account termination</SubHeading>
                                <p>
                                    We reserve the right to suspend or terminate accounts that
                                    violate these Terms, engage in fraud, abuse our platform, or
                                    harm other users or restaurants.
                                </p>
                            </Section>

                            <Section title="5. Orders & Payments">
                                <SubHeading>Placing orders</SubHeading>
                                <ul>
                                    <li>All orders are subject to restaurant availability.</li>
                                    <li>
                                        Prices, taxes, delivery fees, and discounts are shown before
                                        you confirm.
                                    </li>
                                    <li>
                                        Once an order is placed and accepted by the restaurant, it
                                        cannot be cancelled without penalty.
                                    </li>
                                </ul>

                                <SubHeading>Payments</SubHeading>
                                <ul>
                                    <li>
                                        We accept cash on delivery and (where available) card
                                        payments.
                                    </li>
                                    <li>
                                        All prices are in Pakistani Rupees (PKR) unless otherwise
                                        stated.
                                    </li>
                                    <li>
                                        You agree to pay all charges incurred under your account.
                                    </li>
                                </ul>

                                <SubHeading>Refunds</SubHeading>
                                <ul>
                                    <li>
                                        If an order is incorrect, missing items, or arrives cold or
                                        damaged, contact us within 1 hour of delivery.
                                    </li>
                                    <li>
                                        Approved refunds are processed within 5–7 business days to
                                        the original payment method.
                                    </li>
                                    <li>
                                        Refunds for cash-on-delivery orders are handled via bank
                                        transfer or store credit.
                                    </li>
                                </ul>
                            </Section>

                            <Section title="6. Delivery">
                                <ul>
                                    <li>
                                        Estimated delivery times are provided by restaurants and are
                                        not guaranteed.
                                    </li>
                                    <li>
                                        Delivery times may be affected by weather, traffic, or high
                                        demand.
                                    </li>
                                    <li>
                                        You must provide a correct delivery address and be available
                                        to receive the order.
                                    </li>
                                    <li>
                                        If you are unavailable when the rider arrives, the order may
                                        be cancelled without refund.
                                    </li>
                                    <li>
                                        Riders are independent contractors, not FoodieHub employees.
                                    </li>
                                </ul>
                            </Section>

                            <Section title="7. Deals & Promotions">
                                <ul>
                                    <li>
                                        Deals are subject to availability and time limits shown on
                                        each deal.
                                    </li>
                                    <li>
                                        Promo codes cannot be combined unless explicitly stated.
                                    </li>
                                    <li>
                                        We may modify or cancel promotions at any time without prior
                                        notice.
                                    </li>
                                    <li>
                                        Abuse of promotions (e.g., multiple accounts, fake orders)
                                        may result in account termination.
                                    </li>
                                </ul>
                            </Section>

                            <Section title="8. Prohibited Conduct">
                                <p>You agree not to:</p>
                                <ul>
                                    <li>Place fraudulent or fake orders.</li>
                                    <li>Harass, threaten, or abuse restaurants or delivery riders.</li>
                                    <li>Attempt to hack, scrape, or disrupt our Service.</li>
                                    <li>Use the Service for money laundering or illegal activity.</li>
                                    <li>Impersonate another person or entity.</li>
                                    <li>Violate any applicable laws or regulations.</li>
                                </ul>
                                <p>
                                    Violation may result in account suspension, legal action, and
                                    liability for damages.
                                </p>
                            </Section>

                            <Section title="9. Intellectual Property">
                                <p>
                                    All content on FoodieHub — including logos, text, images,
                                    graphics, and software — is owned by FoodieHub or its
                                    licensors and protected by copyright and trademark laws.
                                </p>
                                <p>
                                    You may not copy, modify, distribute, or use our content
                                    without written permission.
                                </p>
                            </Section>

                            <Section title="10. Limitation of Liability">
                                <p>To the maximum extent permitted by law:</p>
                                <ul>
                                    <li>
                                        FoodieHub is not liable for the quality, safety, or legality
                                        of food prepared by restaurants.
                                    </li>
                                    <li>
                                        We are not liable for indirect, incidental, or consequential
                                        damages.
                                    </li>
                                    <li>
                                        Our total liability for any claim shall not exceed the amount
                                        you paid for the specific order in question.
                                    </li>
                                </ul>
                            </Section>

                            <Section title="11. Indemnification">
                                <p>
                                    You agree to indemnify and hold FoodieHub harmless from any
                                    claims, damages, or expenses arising from your use of the
                                    Service or violation of these Terms.
                                </p>
                            </Section>

                            <Section title="12. Dispute Resolution">
                                <p>
                                    Any disputes arising from these Terms or the Service will be
                                    resolved through good-faith negotiation. If unresolved, the
                                    dispute will be submitted to binding arbitration in Karachi,
                                    Pakistan, in accordance with local laws.
                                </p>
                            </Section>

                            <Section title="13. Governing Law">
                                <p>
                                    These Terms are governed by the laws of Pakistan. Any legal
                                    action must be brought in the courts of Karachi, Pakistan.
                                </p>
                            </Section>

                            <Section title="14. Contact Us">
                                <p>Questions about these Terms? Reach us at:</p>
                                <ul>
                                    <li>
                                        📧 Email:{" "}
                                        <a
                                            href="mailto:legal@foodiehub.com"
                                            className="text-orange-400 hover:underline"
                                        >
                                            legal@foodiehub.com
                                        </a>
                                    </li>
                                    <li>📍 Address: FoodieHub HQ, Block 5, Clifton, Karachi, Pakistan</li>
                                    <li>📞 Phone: +92 300 1234567</li>
                                </ul>
                            </Section>
                        </div>

                        {/* Bottom nav */}
                        <div className="mt-12 flex flex-wrap gap-3 border-t border-white/10 pt-8">
                            <Link
                                href="/"
                                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
                            >
                                ← Back Home
                            </Link>
                            <Link
                                href="/privacy"
                                className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-bold"
                            >
                                Read Privacy Policy →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section>
            <h2 className="mb-4 text-2xl font-black text-white">{title}</h2>
            <div className="space-y-3 leading-relaxed">{children}</div>
        </section>
    );
}

function SubHeading({ children }: { children: React.ReactNode }) {
    return <h3 className="mt-4 text-lg font-bold text-white">{children}</h3>;
}