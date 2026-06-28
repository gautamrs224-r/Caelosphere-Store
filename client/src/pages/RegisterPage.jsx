import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FiUser, FiMail, FiLock, FiUserPlus, FiZap, FiShield, FiCloud, FiHeart } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { FiGithub, FiFacebook } from 'react-icons/fi'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

const perks = [
  { icon: FiZap, title: 'Instant Access', desc: 'Get immediate access to premium products' },
  { icon: FiShield, title: 'Secure & Safe', desc: 'Your data is protected with top-notch security' },
  { icon: FiCloud, title: 'Unlimited Downloads', desc: 'Download products anytime, anywhere' },
  { icon: FiHeart, title: 'Exclusive Benefits', desc: 'Get exclusive offers and early access' },
]

function passwordStrength(value = '') {
  if (value.length >= 10) return { label: 'Strong', level: 3 }
  if (value.length >= 6) return { label: 'Medium', level: 2 }
  if (value.length > 0) return { label: 'Weak', level: 1 }
  return { label: '', level: 0 }
}

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password', '')
  const strength = passwordStrength(password)

  const onSubmit = async (data) => {
    setLoading(true)
    await registerUser(data)
    setLoading(false)
    navigate('/')
  }

  return (
    <div className="container-page py-12">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left copy */}
        <div className="hidden lg:block">
          <span className="text-aurora-purple font-medium">Welcome!</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-3 leading-tight">
            Create your <span className="text-gradient-marketplace">Caelosphere</span> account
          </h1>
          <p className="text-slate-gray mt-4 max-w-md">
            Join thousands of developers and designers who build faster with premium digital products.
          </p>

          <div className="space-y-5 mt-10">
            {perks.map((p) => (
              <div key={p.title} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-aurora-purple/10 flex items-center justify-center text-aurora-purple shrink-0">
                  <p.icon />
                </div>
                <div>
                  <h3 className="font-medium text-heading-white">{p.title}</h3>
                  <p className="text-sm text-slate-gray">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div className="glass-card-elevated p-8 md:p-10 max-w-md w-full mx-auto">
          <h2 className="text-2xl font-bold text-heading-white">Create Account</h2>
          <p className="text-sm text-slate-gray mt-1">Fill in your details to get started</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-7">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                icon={<FiUser />}
                placeholder="Jane"
                error={errors.firstName && 'Required'}
                {...register('firstName', { required: true })}
              />
              <Input
                label="Last Name"
                icon={<FiUser />}
                placeholder="Doe"
                error={errors.lastName && 'Required'}
                {...register('lastName', { required: true })}
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              icon={<FiMail />}
              placeholder="Enter your email address"
              error={errors.email && 'Please enter a valid email address'}
              {...register('email', { required: true })}
            />
            <Input
              label="Password"
              type="password"
              icon={<FiLock />}
              placeholder="Create a password"
              error={errors.password && 'Password is required'}
              {...register('password', { required: true, minLength: 6 })}
            />
            {password && (
              <div className="flex items-center gap-2 -mt-2">
                <span className="text-xs text-slate-gray">{strength.label}</span>
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3].map((n) => (
                    <span
                      key={n}
                      className={`h-1 flex-1 rounded-full ${
                        n <= strength.level
                          ? strength.level === 3
                            ? 'bg-success'
                            : strength.level === 2
                            ? 'bg-warning'
                            : 'bg-error'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            <Input
              label="Confirm Password"
              type="password"
              icon={<FiLock />}
              placeholder="Re-enter your password"
              error={errors.confirmPassword && 'Passwords must match'}
              {...register('confirmPassword', {
                required: true,
                validate: (val) => val === password,
              })}
            />

            <label className="flex items-start gap-2.5 text-sm text-slate-gray cursor-pointer">
              <input
                type="checkbox"
                className="accent-aurora-purple w-4 h-4 rounded mt-0.5"
                {...register('terms', { required: true })}
              />
              <span>
                I agree to the{' '}
                <Link to="#" className="text-aurora-purple hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="#" className="text-aurora-purple hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <Button type="submit" disabled={loading} className="w-full">
              <FiUserPlus /> {loading ? 'Creating Account…' : 'Create Account'}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-cool-gray">or sign up with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <SocialButton icon={<FcGoogle />} label="Google" />
            <SocialButton icon={<FiGithub />} label="GitHub" />
            <SocialButton icon={<FiFacebook className="text-[#1877F2]" />} label="Facebook" />
          </div>

          <p className="text-center text-sm text-slate-gray mt-7">
            Already have an account?{' '}
            <Link to="/login" className="text-aurora-purple hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function SocialButton({ icon, label }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-sm text-soft-silver hover:bg-white/[0.04] transition-colors"
    >
      {icon} <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
