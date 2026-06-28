import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { FiGithub, FiFacebook } from 'react-icons/fi'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

const perks = [
  { title: 'Your Purchases', desc: 'Access all your downloads and order history' },
  { title: 'Favorites', desc: 'Save and organize your favorite products' },
  { title: 'Instant Access', desc: 'Download your files and get updates instantly' },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    await login(data)
    setLoading(false)
    navigate('/')
  }

  return (
    <div className="container-page py-12">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left copy */}
        <div className="hidden lg:block">
          <span className="text-aurora-purple font-medium">Welcome Back!</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-3 leading-tight">
            Sign in to your <span className="text-gradient-marketplace">Caelosphere</span> account
          </h1>
          <p className="text-slate-gray mt-4 max-w-md">
            Access your purchases, favorites, and exclusive resources all in one place.
          </p>

          <div className="space-y-5 mt-10">
            {perks.map((p) => (
              <div key={p.title} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-aurora-purple/10 flex items-center justify-center text-aurora-purple shrink-0">
                  <FiLock />
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
          <h2 className="text-2xl font-bold text-heading-white">Sign In</h2>
          <p className="text-sm text-slate-gray mt-1">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-7">
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
              placeholder="Enter your password"
              error={errors.password && 'Password is required'}
              {...register('password', { required: true })}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 text-sm text-slate-gray cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-aurora-purple w-4 h-4 rounded" />
                Remember me
              </label>
              <Link to="#" className="text-sm text-aurora-purple hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Signing In…' : 'Sign In'} {!loading && <FiArrowRight />}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-cool-gray">or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <SocialButton icon={<FcGoogle />} label="Google" />
            <SocialButton icon={<FiGithub />} label="GitHub" />
            <SocialButton icon={<FiFacebook className="text-[#1877F2]" />} label="Facebook" />
          </div>

          <p className="text-center text-sm text-slate-gray mt-7">
            Don't have an account?{' '}
            <Link to="/register" className="text-aurora-purple hover:underline font-medium">
              Sign up
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
