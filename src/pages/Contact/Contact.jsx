

import { useState } from "react";
import { toast } from "react-toastify";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";

export default function Contact() {
  const [form, setForm]       = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent successfully! We'll get back to you soon 📬", {
      style: { background: "#6B21A8", color: "#fff", fontWeight: "600", borderRadius: "12px" },
      progressStyle: { background: "#D8B4FE" },
    });
    setForm({ name: "", email: "", message: "" });
    setSending(false);
  };

  const info = [
    { Icon: HiOutlineMail,           label: "Email",   value: "support@mypet.com" },
    { Icon: HiOutlinePhone,          label: "Phone",   value: "+20 100 8691505" },
    { Icon: HiOutlineLocationMarker, label: "Address", value: "Cairo, Egypt" },
  ];

  const inputCls = "w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 bg-white dark:bg-[#2a2040] text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#13111C] pt-24 pb-16 transition-colors duration-300">

      {/* Header */}
      <div className="bg-primary-purple py-10 px-4 mb-10">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Contact Us</h1>
          <p className="text-yellow-300 text-sm font-medium uppercase tracking-widest">
            Home › Contact
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-2">Get in Touch</h2>
            <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed">
              Have a question about your order or our products? We're here to help.
              Fill out the form and we'll get back to you within 24 hours.
            </p>
          </div>
          <div className="space-y-4">
            {info.map(({ Icon, label, value }) => (
              <div key={label}
                className="flex items-center gap-4 bg-white dark:bg-[#1e1a2e] rounded-2xl border border-gray-100 dark:border-purple-900/30 shadow-sm px-5 py-4">
                <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                  <Icon className="text-purple-600 dark:text-purple-400 text-xl" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-[#1e1a2e] rounded-3xl shadow-sm border border-gray-100 dark:border-purple-900/30 p-8">
          <h2 className="text-xl font-extrabold text-gray-800 dark:text-white mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Message</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help you?"
                className={`${inputCls} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 bg-[#6B21A8] hover:bg-purple-800 disabled:opacity-60 text-white font-semibold rounded-xl transition"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}