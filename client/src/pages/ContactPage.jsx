import { useState } from 'react'
import { FiMail, FiMessageSquare, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import SectionHeader from '../components/ui/SectionHeader'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const contactMethods = [
  {
    icon: FiMail,
    title: 'Email Us',
    detail: 'support@caelospherestore.com',
    desc: "We'll respond within 24 hours",
  },
  {
    icon: FiMessageSquare,
    title: 'Live Chat',
    detail: 'Available 24/7',
    desc: 'Chat with our support team',
  },
  {
    icon: FiMapPin,
    title: 'Office',
    detail: 'Remote-first team',
    desc: 'Serving creators worldwide',
  },
]

const faqs = [
  {
    q: 'How do I access my purchased products?',
    a: 'After checkout, your files are available instantly from your account dashboard under "Your Purchases."',
  },
  {
    q: 'Do you offer refunds?',
    a: "Yes — we offer a 30-day money-back guarantee on all products if you're not satisfied.",
  },
  {
    q: 'Can I use products in commercial projects?',
    a: 'Most products include a commercial license. Check the license tag on each product page for specifics.',
  },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = () => {
    setSubmitted(true)
    reset()
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="container-page py-16">
      <SectionHeader
        eyebrow="Get In Touch"
        title="We'd Love to"
        highlight="Hear From You"
        subtitle="Questions about a product, a license, or a partnership? Send us a message and our team will get back to you."
      />

      <div className="grid sm:grid-cols-3 gap-5 mt-12">
        {contactMethods.map((m) => (
          <div key={m.title} className="glass-card p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-aurora-purple/10 text-aurora-purple flex items-center justify-center mx-auto">
              <m.icon size={20} />
            </div>
            <h3 className="font-heading font-semibold text-heading-white mt-4">{m.title}</h3>
            <p className="text-sm text-soft-silver mt-1">{m.detail}</p>
            <p className="text-xs text-cool-gray mt-1">{m.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8 mt-12">
        {/* Form */}
        <div className="glass-card-elevated p-8">
          <h2 className="text-xl font-heading font-semibold text-heading-white">Send us a message</h2>
          <p className="text-sm text-slate-gray mt-1">Fill out the form and we'll be in touch shortly.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-7">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="Jane Doe"
                error={errors.name && 'Name is required'}
                {...register('name', { required: true })}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                error={errors.email && 'A valid email is required'}
                {...register('email', { required: true })}
              />
            </div>
            <Input
              label="Subject"
              placeholder="What's this about?"
              error={errors.subject && 'Subject is required'}
              {...register('subject', { required: true })}
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-soft-silver">Message</label>
              <textarea
                rows={5}
                placeholder="Tell us a bit more…"
                className="input-field resize-none"
                {...register('message', { required: true })}
              />
              {errors.message && <span className="text-xs text-error">Message is required</span>}
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              <FiSend /> Send Message
            </Button>

            {submitted && (
              <p className="flex items-center gap-2 text-sm text-success">
                <FiCheckCircle /> Thanks — your message has been sent. We'll reply soon.
              </p>
            )}
          </form>
        </div>

        {/* FAQ sidebar */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-heading-white">Frequently Asked</h3>
          {faqs.map((f) => (
            <div key={f.q} className="glass-card p-5">
              <h4 className="text-sm font-medium text-heading-white">{f.q}</h4>
              <p className="text-sm text-slate-gray mt-2">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
