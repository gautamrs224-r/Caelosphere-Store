import { useState } from 'react'
import { FiMail } from 'react-icons/fi'
import Button from '../ui/Button'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <section className="py-20">
      <div className="container-page">
        <div className="glass-card-elevated relative overflow-hidden p-10 md:p-14 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-aurora-purple/10 via-transparent to-royal-blue/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-premium flex items-center justify-center shrink-0 shadow-glow-purple">
            <FiMail className="text-white text-2xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-heading-white">Stay in the loop</h3>
            <p className="text-slate-gray mt-2">
              Get exclusive deals, new product updates, and design resources straight to your inbox.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input-field flex-1 md:w-64"
            />
            <Button type="submit" className="whitespace-nowrap">
              Subscribe
            </Button>
          </form>
          {submitted && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-success">
              You're subscribed — welcome aboard!
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
