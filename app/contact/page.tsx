import { Mail, Phone, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@invexto.in";
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "+919999999999";

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Get in touch</h1>
          <p className="mt-2 text-gray-500">Reach out directly — we&apos;re happy to help.</p>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          <a
            href={`mailto:${email}`}
            className="group flex items-center gap-4 rounded-2xl border border-emerald-800/30 bg-gradient-to-br from-emerald-900/20 to-gray-950 p-5 transition hover:-translate-y-0.5 hover:border-emerald-600/50 hover:shadow-lg hover:shadow-emerald-900/20"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600/20">
              <Mail className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Email</p>
              <p className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                {email}
              </p>
            </div>
          </a>

          <a
            href={`tel:${phone}`}
            className="group flex items-center gap-4 rounded-2xl border border-emerald-800/30 bg-gradient-to-br from-emerald-900/20 to-gray-950 p-5 transition hover:-translate-y-0.5 hover:border-emerald-600/50 hover:shadow-lg hover:shadow-emerald-900/20"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600/20">
              <Phone className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Phone</p>
              <p className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                {phone}
              </p>
            </div>
          </a>
        </div>

        <div className="rounded-2xl border border-emerald-800/30 bg-gradient-to-br from-emerald-900/20 to-gray-950 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600/20">
              <MessageSquare className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Send a message</h2>
              <p className="text-sm text-gray-500">We&apos;ll get back to you within 24 hours</p>
            </div>
          </div>

          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-xl border border-emerald-800/25 bg-emerald-950/30 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-emerald-600/50 focus:ring-1 focus:ring-emerald-600/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-emerald-800/25 bg-emerald-950/30 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-emerald-600/50 focus:ring-1 focus:ring-emerald-600/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">Message</label>
              <textarea
                rows={5}
                placeholder="How can we help you?"
                className="w-full resize-none rounded-xl border border-emerald-800/25 bg-emerald-950/30 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-emerald-600/50 focus:ring-1 focus:ring-emerald-600/20"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-900/30"
            >
              Send Message
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
