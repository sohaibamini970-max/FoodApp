"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
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
                        🔒 Your privacy matters
                    </div>
                    <h1 className="text-4xl font-black sm:text-5xl lg:text-6xl">
                        Privacy{" "}
                        <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                            Policy
                        </span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-gray-400">
                        Learn how FoodieHub collects, uses, and protects your personal
                        information.
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
                        <div className="prose prose-invert max-w-none space-y-10 text-gray-300">
                            <Section title="1. Introduction">
                                <p>
                                    Welcome to FoodieHub ("we", "our", "us"). We are committed to
                                    protecting your personal information and your right to
                                    privacy. This Privacy Policy explains how we collect, use,
                                    disclose, and safeguard your information when you visit our
                                    website or use our mobile services (collectively, the
                                    "Service").
                                </p>
                                <p>
                                    Please read this policy carefully. If you do not agree with
                                    the terms of this Privacy Policy, please do not access the
                                    Service.
                                </p>
                            </Section>

                            <Section title="2. Information We Collect">
                                <p>We collect information in the following ways:</p>

                                <SubHeading>Information you provide to us</SubHeading>
                                <ul>
                                    <li>
                                        <strong>Account information:</strong> name, email address,
                                        phone number, and password when you create an account.
                                    </li>
                                    <li>
                                        <strong>Order information:</strong> delivery address, order
                                        history, payment method details, and special instructions.
                                    </li>
                                    <li>
                                        <strong>Communication data:</strong> messages you send us
                                        through contact forms, email, or chat.
                                    </li>
                                    <li>
                                        <strong>OAuth data:</strong> if you sign in with Google or
                                        Facebook, we receive your name, email, and profile picture
                                        from those providers.
                                    </li>
                                </ul>

                                <SubHeading>Information collected automatically</SubHeading>
                                <ul>
                                    <li>
                                        <strong>Device data:</strong> IP address, browser type,
                                        operating system, and device identifiers.
                                    </li>
                                    <li>
                                        <strong>Usage data:</strong> pages visited, time spent,
                                        clicks, and referring URLs.
                                    </li>
                                    <li>
                                        <strong>Cookies:</strong> small data files stored in your
                                        browser to keep you logged in and remember preferences.
                                    </li>
                                </ul>

                                <SubHeading>Information from third parties</SubHeading>
                                <ul>
                                    <li>
                                        <strong>Payment processors:</strong> we never store full
                                        credit card numbers. All payment data is handled by
                                        PCI-DSS-compliant processors.
                                    </li>
                                    <li>
                                        <strong>Restaurant partners:</strong> information necessary
                                        to fulfill your orders.
                                    </li>
                                </ul>
                            </Section>

                            <Section title="3. How We Use Your Information">
                                <p>We use your information for the following purposes:</p>
                                <ul>
                                    <li>To create and manage your account.</li>
                                    <li>
                                        To process, fulfill, and deliver your food orders to the
                                        correct address.
                                    </li>
                                    <li>To communicate about your orders, updates, and offers.</li>
                                    <li>
                                        To send promotional emails about new restaurants, deals, and
                                        features (you can opt out at any time).
                                    </li>
                                    <li>
                                        To verify your email address and prevent fraud or
                                        unauthorized access.
                                    </li>
                                    <li>
                                        To improve our Service through analytics and
                                        personalization.
                                    </li>
                                    <li>
                                        To comply with legal obligations and enforce our Terms of
                                        Service.
                                    </li>
                                </ul>
                            </Section>

                            <Section title="4. Sharing Your Information">
                                <p>
                                    We never sell your personal information. We share it only
                                    with:
                                </p>
                                <ul>
                                    <li>
                                        <strong>Restaurant partners</strong> — name, delivery
                                        address, and order details needed to prepare and deliver
                                        your food.
                                    </li>
                                    <li>
                                        <strong>Delivery riders</strong> — name, phone, and delivery
                                        address for the duration of your delivery.
                                    </li>
                                    <li>
                                        <strong>Payment processors</strong> — for secure payment
                                        handling.
                                    </li>
                                    <li>
                                        <strong>Email service providers</strong> — for verification
                                        codes and transactional emails.
                                    </li>
                                    <li>
                                        <strong>Analytics tools</strong> — aggregated, anonymized
                                        usage data.
                                    </li>
                                    <li>
                                        <strong>Legal authorities</strong> — if required by law or
                                        to protect our rights.
                                    </li>
                                </ul>
                            </Section>

                            <Section title="5. Data Security">
                                <p>
                                    We implement industry-standard security measures to protect
                                    your data:
                                </p>
                                <ul>
                                    <li>Passwords are hashed with bcrypt — we never store them in plain text.</li>
                                    <li>All data transmitted over HTTPS/TLS.</li>
                                    <li>Access tokens expire automatically for security.</li>
                                    <li>Database access is restricted to authorized personnel only.</li>
                                    <li>Regular security audits and updates.</li>
                                </ul>
                                <p>
                                    However, no method of transmission over the internet is 100%
                                    secure. While we strive to protect your information, we cannot
                                    guarantee absolute security.
                                </p>
                            </Section>

                            <Section title="6. Your Rights">
                                <p>Depending on your location, you may have the right to:</p>
                                <ul>
                                    <li><strong>Access</strong> — request a copy of your personal data.</li>
                                    <li><strong>Correct</strong> — update inaccurate information.</li>
                                    <li><strong>Delete</strong> — request erasure of your account and data.</li>
                                    <li><strong>Opt out</strong> — unsubscribe from marketing emails at any time.</li>
                                    <li><strong>Withdraw consent</strong> — revoke previously granted permissions.</li>
                                </ul>
                                <p>
                                    To exercise any of these rights, contact us at{" "}
                                    <a
                                        href="mailto:privacy@foodiehub.com"
                                        className="text-orange-400 hover:underline"
                                    >
                                        privacy@foodiehub.com
                                    </a>
                                    . We respond within 30 days.
                                </p>
                            </Section>

                            <Section title="7. Cookies">
                                <p>We use the following types of cookies:</p>
                                <ul>
                                    <li>
                                        <strong>Essential cookies</strong> — for login sessions and
                                        security.
                                    </li>
                                    <li>
                                        <strong>Preference cookies</strong> — to remember your
                                        settings (e.g., cart contents).
                                    </li>
                                    <li>
                                        <strong>Analytics cookies</strong> — to understand how users
                                        interact with our Service.
                                    </li>
                                </ul>
                                <p>
                                    You can disable cookies in your browser settings, but some
                                    features may not work without them.
                                </p>
                            </Section>

                            <Section title="8. Children's Privacy">
                                <p>
                                    Our Service is not directed to individuals under the age of 13.
                                    We do not knowingly collect data from children. If you believe
                                    a child has provided us information, contact us and we will
                                    delete it promptly.
                                </p>
                            </Section>

                            <Section title="9. Changes to This Policy">
                                <p>
                                    We may update this Privacy Policy from time to time. When we
                                    do, we will post the new version and update the "Last updated"
                                    date. Continued use of the Service after changes constitutes
                                    acceptance.
                                </p>
                            </Section>

                            <Section title="10. Contact Us">
                                <p>
                                    Questions about this policy? Reach us at:
                                </p>
                                <ul>
                                    <li>
                                        📧 Email:{" "}
                                        <a
                                            href="mailto:privacy@foodiehub.com"
                                            className="text-orange-400 hover:underline"
                                        >
                                            privacy@foodiehub.com
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
                                href="/terms"
                                className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-bold"
                            >
                                Read Terms of Service →
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
    return (
        <h3 className="mt-4 text-lg font-bold text-white">{children}</h3>
    );
}