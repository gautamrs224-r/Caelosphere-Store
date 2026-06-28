// Promotes an existing user to admin by email. Run this once, after you've
// already registered a normal account through the app's /register page.
//
// Usage:
//   node utils/makeAdmin.js you@example.com
//
// This is the simplest path to your first admin account — no seeding required.

import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import User from '../models/User.js'

dotenv.config()

const email = process.argv[2]

if (!email) {
  console.error('Usage: node utils/makeAdmin.js <email>')
  process.exit(1)
}

async function run() {
  await connectDB()
  try {
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { role: 'admin' },
      { new: true }
    )
    if (!user) {
      console.error(`No user found with email: ${email}`)
      console.error('Register that account through the app first, then run this again.')
      process.exitCode = 1
      return
    }
    console.log(`✓ ${user.email} is now an admin.`)
  } catch (err) {
    console.error('Failed to update user:', err.message)
    process.exitCode = 1
  } finally {
    await mongoose.connection.close()
  }
}

run()
