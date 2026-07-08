import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "Design", message: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const services = ["Design", "Video Editing", "AI Automations", "Digital Marketing"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.message.trim()) newErrors.message = "Message cannot be empty";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Construct WhatsApp link with form details
      const phoneNumber = "918121948341";
      const messageText = `Hi Vamshi, I need your *${form.service}* service. 🚀\n\nHere are my details:\n👤 *Name:* ${form.name}\n✉️ *Email:* ${form.email}\n🏢 *Company:* ${form.company || "N/A"}\n💬 *Message:* ${form.message}`;
      const encodedMessage = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, "_blank");

      // Reset form
      setForm({ name: "", email: "", company: "", service: "Design", message: "" });

      // Clear success indicator after a few seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 800);
  };

  return (
    <section id="contact" className="space-y-8 text-left select-none">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Connect
        </h2>
      </div>

      <div className="p-8 rounded-[24px] bento-card dark:bento-card-dark shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Left column info */}
          <div className="md:col-span-5 space-y-6">
            <p className="text-sm text-zinc-450 dark:text-zinc-500 leading-relaxed font-normal">
              Ready to design brand assets, automate team workflows, or run acquisition campaigns? Let's connect.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-zinc-400" />
                <a href="mailto:dathrikavamshi8@gmail.com" className="text-xs font-semibold text-zinc-850 dark:text-zinc-200 hover:underline">
                  dathrikavamshi8@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-zinc-400" />
                <a href="tel:+918121948341" className="text-xs font-semibold text-zinc-850 dark:text-zinc-200 hover:underline">
                  +91 8121948341
                </a>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-850 dark:text-zinc-200">
                  Hyderabad, Telangana, India
                </span>
              </div>
            </div>
          </div>

          {/* Right column form */}
          <form onSubmit={handleSubmit} className="md:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-xs font-semibold focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-900 dark:text-zinc-100 transition-colors duration-150"
                  placeholder="Your name"
                />
                {errors.name && <p className="text-[10px] text-rose-500 font-semibold">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-xs font-semibold focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-900 dark:text-zinc-100 transition-colors duration-150"
                  placeholder="name@company.com"
                />
                {errors.email && <p className="text-[10px] text-rose-500 font-semibold">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="company" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={form.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-xs font-semibold focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-900 dark:text-zinc-100 transition-colors duration-150"
                  placeholder="Company name"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="service" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Service</label>
                <select
                  id="service"
                  name="service"
                  value={form.service}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-xs font-semibold focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-900 dark:text-zinc-100 transition-colors duration-150 cursor-pointer"
                >
                  {services.map((serv) => (
                    <option key={serv} value={serv}>{serv}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-xs font-semibold focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-900 dark:text-zinc-100 transition-colors duration-150 resize-none"
                placeholder="What are we building?"
              />
              {errors.message && <p className="text-[10px] text-rose-500 font-semibold">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>Send message</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {submitSuccess && (
              <p className="text-xs text-emerald-500 font-semibold mt-2">
                Message sent successfully. I will get back to you shortly.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
